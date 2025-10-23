import {
  TvMinimalPlay,
  Image as ImageIcon, // 重命名 Image 避免与 motion/react 冲突
  Headphones,
  FileChartLine,
  File,
  RefreshCw,
  LucideTrash2,
} from "lucide-react";
import React, { useState, useRef, useCallback, useMemo } from "react"; // 导入 useMemo
import { AnimatePresence, motion } from "motion/react";
import success from "@/assets/success.svg";
import upload from "@/assets/upload.svg";

// 定义上传文件的状态接口
interface UploadableFile {
  file: File;
  id: string;
  progress: number; // 0-100
  status: "pending" | "uploading" | "success" | "error";
}

const FileUploader: React.FC = () => {
  const [files, setFiles] = useState<UploadableFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Helper Functions ---

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon />;
    if (fileType.startsWith("video/")) return <TvMinimalPlay />;
    if (fileType.startsWith("audio/")) return <Headphones />;
    if (fileType === "application/pdf") return <FileChartLine />;
    return <File />;
  };

  // --- State Updaters ---

  const updateFileProgress = (
    id: string,
    progressUpdater: (prevProgress: number) => number
  ) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.id === id ? { ...f, progress: progressUpdater(f.progress) } : f
      )
    );
  };

  const updateFileStatus = (id: string, status: UploadableFile["status"]) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.id === id ? { ...f, status } : f))
    );
  };

  const onRemoveFile = (fileId: string) => {
    // ⚠️ 优化点：当文件被移除时，如果有正在进行中的上传，需要发送取消信号（此处为模拟）
    setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
  };

  // --- Upload Logic (Optimized) ---
  const uploadFile = (fileToUpload: UploadableFile) => {
    updateFileStatus(fileToUpload.id, "uploading");

    const interval = setInterval(() => {
      updateFileProgress(fileToUpload.id, (prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          const isSuccess = Math.random() > 0.2; // 80% 成功
          updateFileStatus(fileToUpload.id, isSuccess ? "success" : "error");
          return 100;
        }
        return prevProgress + 10;
      });
    }, 150);
    return () => clearInterval(interval);
  };

  const onUpload = (filesToUpload: UploadableFile[]) => {
    const targets = filesToUpload.filter(
      (f) => f.status === "pending" || f.status === "error"
    );

    if (targets.length === 0) {
      alert("没有待上传或需要重试的文件！");
      return;
    }

    targets.forEach(uploadFile);
  };

  const onRetryFile = (file: UploadableFile) => {
    // 重置进度为0后重新上传
    updateFileProgress(file.id, () => 0);
    onUpload([file]);
  };

  const onCancel = () => {
    //  在实际应用中，这里需要遍历所有正在 uploading 的文件并调用它们的取消函数
    setFiles([]);
  };

  // --- File/Drag Handlers ---

  const addFiles = (newFiles: File[]) => {
    const existingFileNames = new Set(files.map((f) => f.file.name));

    const newUploadableFiles: UploadableFile[] = newFiles
      .filter((file) => !existingFileNames.has(file.name))
      .map((file) => ({
        file,
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        progress: 0,
        status: "pending" as const,
      }));

    setFiles((prevFiles) => [...prevFiles, ...newUploadableFiles]);
  };

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        addFiles(droppedFiles);
      }
    },
    [files]
  ); //  优化：添加 files 依赖，确保 addFiles 中的 Set 拿到最新的文件列表

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      addFiles(selectedFiles);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const hasPendingFiles = useMemo(
    () => files.some((f) => f.status === "pending" || f.status === "error"),
    [files]
  );

  const isUploading = useMemo(
    () => files.some((f) => f.status === "uploading"),
    [files]
  );

  const pendingCount = useMemo(
    () => files.filter((f) => f.status === "pending").length,
    [files]
  );

  const getStatusIcon = (uploadableFile: UploadableFile) => {
    const status = uploadableFile.status;
    switch (status) {
      case "success":
        return <img src={success} alt="success" className="w-5 h-5" />;
      case "error":
        return (
          <LucideTrash2
            className="w-5 h-5 text-rose-800 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // 阻止点击事件冒泡到 li 的父元素
              onRemoveFile(uploadableFile.id);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl m-auto mt-2 rounded-xl font-sans">
      {/* 拖拽区域 */}
      {/* onDragEnter, onDragLeave, onDragOver 保持不变 */}
      <div
        className={`border-3 border-dashed rounded-lg dark:bg-accent p-8 text-center shadow-lg cursor-pointer transition-colors duration-300 ease-in-out
          border-gray-200 hover:border-gray-300`}
        onDragOver={(e) => e.preventDefault()} // 简化：直接内联
        onDrop={onDrop}
        onClick={openFileDialog}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelect}
          multiple
          className="hidden"
        />
        <img src={upload} alt="upload" className="w-12 h-12 m-auto" />
        <p className="text-gray-600 mb-2 mt-1">
          将文件拖拽至此，或
          <span className="font-semibold text-blue-400"> 点击此处 </span>
          选择文件
        </p>
        <p className="text-xs text-gray-500 mt-2">
          支持图片、视频、PDF等任何文件
        </p>
      </div>

      {/* 文件列表 */}
      <div className="mt-6">
        <ul className="space-y-3">
          <AnimatePresence>
            {files.map((uploadableFile) => (
              <motion.li
                key={uploadableFile.id}
                layout
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: -100,
                  height: 0,
                  // ⚠️ 关键动画优化：确保 margin/padding 在退出时归零，以防止按钮跳动
                  paddingTop: 0,
                  paddingBottom: 0,
                  marginTop: 0,
                  marginBottom: 0,
                  transition: { duration: 0.2 },
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center p-1 shadow-xl dark:bg-accent border rounded-lg overflow-hidden" // ⚠️ 优化：添加 overflow-hidden 防止内容闪烁
              >
                {/* 图标与信息主体 */}
                <span className="text-2xl mr-2 ml-2">
                  {getFileIcon(uploadableFile.file.type)}
                </span>
                <div className="grow bg-transparent">
                  {/* 文件名称 与 成功/失败图标 */}
                  <div className="text-[14px] font-medium truncate flex items-center justify-between">
                    <p>{uploadableFile.file.name}</p>
                    {getStatusIcon(uploadableFile)}
                  </div>

                  {/* 进度条 */}
                  <div className="flex items-center">
                    <div className="w-full rounded-full h-1.5 mt-1 mb-1 bg-gray-100 dark:bg-neutral-600">
                      {(uploadableFile.status === "uploading" ||
                        uploadableFile.status === "success" ||
                        uploadableFile.status === "error") && (
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ease-in-out ${
                            uploadableFile.status === "error"
                              ? "bg-rose-800"
                              : "bg-emerald-500"
                          } mr-2`}
                          style={{ width: `${uploadableFile.progress}%` }}
                        />
                      )}
                    </div>
                    {/* 移除按钮 */}
                    {uploadableFile.status === "pending" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // 阻止父级元素的事件
                          onRemoveFile(uploadableFile.id);
                        }}
                        className="mr-4 ml-4 text-gray-400 hover:text-gray-600 text-2xl font-light"
                      >
                        <LucideTrash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* 文件大小/进度/重试 */}
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] text-gray-500 text-nowrap">
                      {formatFileSize(uploadableFile.file.size)}
                    </p>
                    {uploadableFile.status === "error" ? (
                      <div
                        className="text-[13px] ml-2 text-rose-800 flex items-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRetryFile(uploadableFile);
                        }}
                      >
                        <p>上传失败，点击重新上传</p>
                        <RefreshCw size={16} className="ml-1" />
                      </div>
                    ) : (
                      (uploadableFile.status === "uploading" ||
                        uploadableFile.status === "success") && (
                        <div className="text-[13px] ml-2 flex items-center">
                          {uploadableFile.progress}%
                        </div>
                      )
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {files.length > 0 && (
          <div className="flex items-center">
            <button
              onClick={() => onUpload(files)}
              disabled={!hasPendingFiles || isUploading}
              className="mt-6 py-2 px-4 text-[14px] font-bold rounded-lg bg-emerald-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? "正在上传..." : `上传 ${pendingCount} 个文件`}
            </button>
            <button
              onClick={onCancel}
              disabled={isUploading}
              className="mt-6 text-[14px] ml-4 py-2 px-4 font-bold rounded-lg bg-rose-800 text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              关闭
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
