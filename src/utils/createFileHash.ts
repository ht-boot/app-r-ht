// 只需要修改 createFileHash 函数的结构
// --------------------------------------

import type {
  WorkerMessageIn,
  WorkerMessageOut,
  CompletePayload,
  ErrorPayload,
  ProgressPayload,
} from "@/type/hash.worker.types";

const createFileHash = (
  file: File,
  onProgress: (progress: number) => void
): Promise<string> => {
  // 将整个过程封装在一个 Promise 中
  return new Promise((resolve, reject) => {
    if (!file) {
      console.error("错误：请先选择一个文件");
      reject("未选择文件");
      return;
    }

    // Worker 实例
    const worker = new Worker(
      new URL("@/utils/hash.worker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    // 定义分片大小
    const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB
    // 计算文件的总分片数
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let currentChunk = 0;

    //  定义一个函数，用于发送下一个分片
    const sendNextChunk = () => {
      if (currentChunk < totalChunks) {
        const start = currentChunk * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const message: WorkerMessageIn = {
          type: "chunk",
          payload: { chunk, chunkIndex: currentChunk },
        };
        worker.postMessage(message);

        currentChunk++;
      }
    };

    worker.onmessage = (e: MessageEvent<WorkerMessageOut>) => {
      const { type, payload } = e.data;

      switch (type) {
        case "progress": {
          const { progress } = payload as ProgressPayload;
          // 可以在这里使用回调函数或事件发射器来汇报进度到 UI
          onProgress(progress);
          sendNextChunk();
          break;
        }
        case "complete": {
          const { hash } = payload as CompletePayload;
          worker.terminate(); // 完成后终止
          resolve(hash); // 3. 成功时调用 resolve 并返回 hash
          break;
        }
        case "error": {
          const { message } = payload as ErrorPayload;
          worker.terminate(); // 出错后终止
          reject(message); // 4. 失败时调用 reject
          break;
        }
      }
    };

    worker.onerror = (e) => {
      worker.terminate();
      reject(e.message || "Worker 发生致命错误");
    };

    // 启动 Worker
    const initMessage: WorkerMessageIn = {
      type: "init",
      payload: { totalChunks, fileSize: file.size },
    };
    worker.postMessage(initMessage);
  });
};

export default createFileHash;
