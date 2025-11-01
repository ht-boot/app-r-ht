import service from "@/api/request";
// 定义基础返回结构，可根据项目自定义
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  [key: string]: any;
}
// 文件校验
export const fileCheck = (params: {
  fileName: string;
  fileHash: string;
}): Promise<ApiResponse> => {
  return service({
    url: "/file/check",
    method: "post",
    data: params,
  });
};

// 分片上传
export const fileUpload = (params: {
  fileHash: string;
  chunkIndex: number;
  chunk: Blob;
}): Promise<ApiResponse> => {
  const { fileHash, chunkIndex, chunk } = params;
  const formData = new FormData();
  formData.append("fileHash", fileHash);
  formData.append("chunkIndex", chunkIndex.toString());
  formData.append("chunk", chunk);
  return service({
    url: "/file/upload",
    method: "post",
    data: formData,
  });
};

// 分片合并
export const fileMerge = (params: {
  fileHash: string;
  fileName: string;
  chunkCount: number;
}): Promise<ApiResponse> => {
  return service({
    url: "/file/merge",
    method: "post",
    data: params,
  });
};
