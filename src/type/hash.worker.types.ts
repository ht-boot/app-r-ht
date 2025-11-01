/**
 * 初始化消息
 * @param totalChunks - 总分片数
 * @param fileSize - 文件的总大小 (用于精确计算进度)
 */
export type InitPayload = {
  totalChunks: number;
  fileSize: number;
};

/**
 * 分片消息
 * @param chunk - 文件分片 (Blob)
 * @param chunkIndex - 当前分片的索引
 */
export type ChunkPayload = {
  chunk: Blob;
  chunkIndex: number;
};

/**
 * Worker 接收的消息类型
 */
export type WorkerMessageIn =
  | { type: "init"; payload: InitPayload }
  | { type: "chunk"; payload: ChunkPayload };

// --- 从 Worker 发送回主线程 (React) 的消息 ---

/**
 * 进度回报
 * @param progress - 0-100 的百分比
 * @param processedSize - 已处理的字节数
 */
export type ProgressPayload = {
  progress: number;
  processedSize: number;
};

/**
 * 完成回报
 * @param hash - 最终的 MD5 Hash 值
 * @param progress - 100
 */
export type CompletePayload = {
  hash: string;
  progress: 100;
};

/**
 * 错误回报
 * @param message - 错误信息
 */
export type ErrorPayload = {
  message: string;
};

/**
 * Worker 发送的消息类型
 */
export type WorkerMessageOut =
  | { type: "progress"; payload: ProgressPayload }
  | { type: "complete"; payload: CompletePayload }
  | { type: "error"; payload: ErrorPayload };
