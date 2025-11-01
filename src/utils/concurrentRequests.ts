type TaskResult<T> =
  | { status: "fulfilled"; value: T }
  | { status: "rejected"; reason: any };

/**
 * @template T
 * @param  taskFunctions - 任务函数数组，每个函数必须返回 Promise<T>。
 * @param limit - 最大并发数。
 * @returns - 返回一个按原始顺序排列的结果数组。
 */
const concurrentRun = async <T>(
  taskFunctions: Array<() => Promise<T>>,
  limit: number
): Promise<Array<TaskResult<T>>> => {
  const effectiveLimit = Math.max(1, Math.min(limit, taskFunctions.length));

  const results: Array<TaskResult<T>> = new Array(taskFunctions.length);

  type IndexedTask = {
    task: () => Promise<T>;
    index: number; // 原始索引，用于保证结果顺序
  };
  const taskQueue: IndexedTask[] = taskFunctions.map((task, index) => ({
    task,
    index,
  }));

  // 不断地从队列中取出任务执行，直到队列为空
  const worker = async () => {
    while (taskQueue.length > 0) {
      // 竞争性地从队列头部取出一个任务
      const nextTask = taskQueue.shift();

      if (nextTask) {
        const { task, index } = nextTask;
        try {
          // 执行任务
          const value = await task();
          // 记录成功结果
          results[index] = { status: "fulfilled", value: value };
        } catch (error) {
          // 记录失败原因
          results[index] = { status: "rejected", reason: error };
        }
      }
    }
  };

  // 创建 effectiveLimit 个 worker 并同时运行
  const workers: Promise<void>[] = [];
  for (let i = 0; i < effectiveLimit; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);

  return results;
};
export default concurrentRun;
