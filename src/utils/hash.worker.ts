// src/workers/hash.worker.ts

import SparkMD5 from "spark-md5";
// 导入我们定义的共享类型
import type {
  WorkerMessageIn,
  WorkerMessageOut,
  InitPayload,
  ChunkPayload,
} from "@/type/hash.worker.types";

let fileReader: FileReader;
let spark: SparkMD5.ArrayBuffer;
let processedChunks = 0;
let totalChunks = 0;
let fileSize = 0;
let processedSize = 0;

/**
 * 初始化并设置 FileReader
 */
const init = (payload: InitPayload) => {
  fileReader = new FileReader();
  spark = new SparkMD5.ArrayBuffer();
  totalChunks = payload.totalChunks;
  fileSize = payload.fileSize;
  processedChunks = 0;
  processedSize = 0; // 初始化已处理大小

  // 当 FileReader 成功读取一个分片时触发
  fileReader.onload = (e) => {
    //  检查结果
    const buffer = e.target?.result as ArrayBuffer;
    if (!buffer) {
      const errorMsg: WorkerMessageOut = {
        type: "error",
        payload: { message: "无法读取文件分片" },
      };
      self.postMessage(errorMsg);
      return;
    }

    //  增量计算 Hash
    spark.append(buffer);
    processedChunks++;
    processedSize += buffer.byteLength;

    //  计算进度
    // 我们使用 processedSize / fileSize 来获得更准确的进度
    // 因为最后一块分片可能不是满的
    const progress = Math.round((processedSize / fileSize) * 100);

    //  根据是否完成发送不同消息
    if (processedChunks < totalChunks) {
      // 未完成：发送进度，主线程收到后会发送下一块
      const progressMsg: WorkerMessageOut = {
        type: "progress",
        payload: { progress, processedSize },
      };
      self.postMessage(progressMsg);
    } else {
      // 已完成：计算最终 Hash 并发送
      const hash = spark.end();
      const completeMsg: WorkerMessageOut = {
        type: "complete",
        payload: { hash, progress: 100 },
      };
      self.postMessage(completeMsg);

      // 5. 关闭 Worker 释放资源
      self.close();
    }
  };

  // FileReader 读取出错
  fileReader.onerror = () => {
    const errorMsg: WorkerMessageOut = {
      type: "error",
      payload: { message: "FileReader 读取文件时出错" },
    };
    self.postMessage(errorMsg);
  };
};

/**
 * 处理主线程发来的分片
 */
const processChunk = (payload: ChunkPayload) => {
  if (!fileReader) {
    const errorMsg: WorkerMessageOut = {
      type: "error",
      payload: { message: 'Worker 尚未初始化，请先发送 "init" 消息。' },
    };
    self.postMessage(errorMsg);
    return;
  }
  // 异步读取分片内容，完成后将触发 fileReader.onload
  fileReader.readAsArrayBuffer(payload.chunk);
};

// 监听主线程发来的消息
self.onmessage = (e: MessageEvent<WorkerMessageIn>) => {
  const { type, payload } = e.data;

  switch (type) {
    case "init": {
      init(payload as InitPayload);
      // 初始化成功后，发送一个 0% 的进度消息
      // 主线程以此为信号，开始发送第一个分片
      const startMsg: WorkerMessageOut = {
        type: "progress",
        payload: { progress: 0, processedSize: 0 },
      };
      self.postMessage(startMsg);
      break;
    }

    case "chunk":
      processChunk(payload as ChunkPayload);
      break;
  }
};
