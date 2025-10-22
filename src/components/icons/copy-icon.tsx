import React, { useState, useCallback, useRef, useEffect } from "react";
import * as lucideIcons from "lucide-react";
import { Check } from "lucide-react";
import { toast } from "sonner";

// 假设您正在使用 shadcn/ui 或类似的组件库
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const timeoutRef = useRef<null | number>(null);

  const onCopy = useCallback(async () => {
    // 如果存在上一个定时器，先清除它，防止用户快速连续点击时出现状态错乱
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      if (!navigator.clipboard) {
        toast.error("浏览器不支持 clipboard API");
        return;
      }
      await navigator.clipboard.writeText(copyContent);
      setCopied(true);
      toast.success("复制成功，已复制到剪贴板！");

      // 将新的定时器 ID 存储在 ref 中
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      toast.error(`无法复制内容: ${err}`);
    }
  }, [copyContent]);

  useEffect(() => {
    // 返回的函数会在组件卸载（unmount）时执行
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onCopy}
            type="button"
            aria-label={`复制 ${copyContent}`}
            className={`
              p-2 rounded-lg transition-all duration-200 
              flex items-center justify-center 
              cursor-pointer
              hover:bg-primary/10  
              hover:scale-110 
              hover:shadow-md 
              focus:outline-none focus:ring-2 focus:ring-blue-500/50
              border
              ${className}
            `}
          >
            {copied ? (
              <Check className="text-green-600 w-6 h-6" />
            ) : (
              <Icon className="w-6 h-6" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{`${copyContent}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default React.memo(CopyIcon);
