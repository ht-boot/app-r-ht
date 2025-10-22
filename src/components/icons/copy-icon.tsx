import React, { useState, useCallback } from "react";
import * as lucideIcons from "lucide-react";
import { Check } from "lucide-react";
import { toast } from "sonner";

type LucideIconComponent = React.FC<lucideIcons.LucideProps>;

interface CopyIconProps {
  Icon: LucideIconComponent;
  copyContent: string;
  className?: string;
}

// ---  CopyIcon 组件  ---
const CopyIcon: React.FC<CopyIconProps> = ({
  Icon,
  copyContent,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      if (!navigator.clipboard) {
        toast.error("浏览器不支持 clipboard API");
        return;
      }
      await navigator.clipboard.writeText(copyContent);
      setCopied(true);
      toast.success("复制成功，已复制到剪贴板！！");
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      toast.error(`！！无法复制内容:${err}`);
    }
  }, [copyContent]);

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`
        pt-2 pb-2 rounded-lg transition-all duration-200 
        flex items-center justify-center 
        cursor-pointer
        hover:bg-primary/10  
        hover:scale-110 
        hover:shadow-md 
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
        border
        ${className}
      `}
      title={copied ? "已复制！" : `点击复制: ${copyContent}`}
      aria-label={`复制 ${copyContent}`}
    >
      {copied ? (
        <Check className="text-green-600 w-6 h-6" />
      ) : (
        <Icon className="w-6 h-6" />
      )}
    </button>
  );
};

export default CopyIcon;
