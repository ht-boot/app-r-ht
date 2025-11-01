import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

type PropsType = {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

const Switch = ({ checked, setChecked }: PropsType) => {
  // const [checked, setChecked] = useState(false);
  // 定义拨片 (Thumb) 的样式，用于切换时使用
  const spring = {
    type: "spring" as const, // 添加弹簧动画
    bounce: 0.5, // 弹性回弹
  };

  return (
    <div
      className="p-1 w-[58px] h-[30px] rounded-2xl cursor-pointer flex items-center"
      style={{
        backgroundColor: checked ? "#404040" : "#f5f5f5", // 轨道背景色变化
        justifyContent: checked ? "flex-end" : "flex-start", // 控制拨片位置
      }}
      onClick={() => setChecked(!checked)}
    >
      <motion.div
        // 将 layout 放在拨片上
        layout
        transition={spring} // 添加弹簧动画
        className="w-6 h-6 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: checked ? "#262626" : "#fff", // 拨片背景色变化
        }}
      >
        {/* 拨片内部的图标 */}
        {checked ? (
          <Moon className="w-4 h-4 text-gray-100" />
        ) : (
          <Sun className="w-4 h-4 text-gray-500" />
        )}
      </motion.div>
    </div>
  );
};
export default Switch;
