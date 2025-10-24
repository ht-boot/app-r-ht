import React, { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";

// 定义组件的属性类型，这里没有属性
interface RealTimeClockProps {
  /** * 可选属性：用于自定义时间的显示格式 (例如 'zh-CN', 'en-US')
   */
  locale?: string;
  /**
   * 可选属性：用于自定义 Date.toLocaleString 的选项
   * 默认：{ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }
   */
  options?: Intl.DateTimeFormatOptions;
}

const RealTimeClock: React.FC<RealTimeClockProps> = ({
  locale = "zh-CN",
  options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 使用 24 小时制
  },
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  // 格式化时间显示
  const formattedTime = currentTime.toLocaleTimeString(locale, options);

  // 完整的日期时间，例如 2024年10月24日 星期四
  const fullDate =
    currentTime.toLocaleDateString().split("/").join(".") +
    " " +
    currentTime.toLocaleDateString("zh-CN", { weekday: "long" });

  return (
    <div
      className="real-time-clock"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <p className="text-4xl font-bold text-neutral-700 dark:text-neutral-300">
        {formattedTime}
      </p>
      <p className="flex gap-1 mt-1">
        <p className="text-sm text-gray-500">{fullDate}</p>
        <CalendarDays className="text-gray-500" size={18} />
      </p>
    </div>
  );
};

export default RealTimeClock;
