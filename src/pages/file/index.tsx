import Upload from "@/components/file/upload";
import { FileCheck } from "lucide-react";

const FileUpload = () => {
  return (
    <>
      <div className="w-full ml-5 m-auto">
        <div className="flex items-baseline">
          <div className="flex items-center text-2xl text-accent-foreground font-medium">
            <FileCheck />
            <span>文件管理 /</span>{" "}
          </div>
          <p className="text-gray-400 text-sm">文件共享</p>
        </div>
      </div>
      <div className="file-upload-container">
        <Upload />
        <div>
          文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试
        </div>
      </div>
    </>
  );
};

export default FileUpload;
