import React, { useRef, useState } from "react";
import createFileHash from "@/utils/createFileHash";
import { toast } from "sonner";
import { CloudUpload, X } from "lucide-react";
import { fileCheck } from "@/api/upload";

const LargeFileUpload: React.FC = () => {
  const [hash, setHash] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  // 处理文件选择
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }
    setHash("");
    const hashPromise = await createFileHash(selectedFile, (_p) => {
      // 更新 UI 状态，这里只更新进度条, 需要可使用
      // console.log(`文件读取进度: ${p}%`);
    });

    toast.dismiss("file-preparing"); // 关闭tosat

    setHash(hashPromise);
    setFile(selectedFile);
    // 文件读取完成，开始校验文件
    onFileCheck(hashPromise, selectedFile);

    if (e.target) {
      e.target.value = "";
    }
  };

  // 文件校验，查看文件是否已经上传了
  const onFileCheck = async (hash: string, selectedFile: File) => {
    if (!hash) {
      return;
    }
    const res = await fileCheck({
      fileHash: hash,
      fileName: selectedFile.name,
    });
    if (res.code === 200 && !res.file) {
      onChunkFile(hash, selectedFile);
    } else {
      toast.error("文件已存在");
    }
  };

  // 文件分片上传
  const onChunkFile = async (hash: string, file: File) => {
    if (!file) {
      return;
    }
  };

  // 文件上传

  // 文件读取准备中
  const onFilePreparing = () => {
    toast.loading(`文件较大,文件正在读取中,请耐心等待。`, {
      id: "file-preparing",
      action: {
        label: <X size={16} />,
        onClick: () => {
          // 手动关闭toast， 用于处理用户取消文件选择，toast 提示无法关闭
          toast.dismiss("file-preparing");
        },
      },
      duration: Infinity,
    });
  };

  return (
    <div className="my-2">
      <div
        className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg dark:bg-accent p-8 text-center shadow-lg cursor-pointer transition-colors duration-300 ease-in-out
          border-gray-200 hover:border-gray-300 min-h-50"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={onFileChange}
          onClick={() => onFilePreparing()}
        />
        <CloudUpload size={42} color="#737373" />
        <p className="text-gray-600 my-2">
          <span className="font-semibold text-blue-400"> 点击此处 </span>
          选择文件
        </p>
        <p className="text-xs text-gray-500">
          支持图片、音视频、PDF、Zip等任何文件
        </p>
      </div>
    </div>
  );
};
export default LargeFileUpload;
