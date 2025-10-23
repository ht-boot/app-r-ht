// Icon.tsx

// 导入所有依赖
import * as lucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react"; // 导入一个默认图标
import { IconArrCollection } from "./icons-gallery";

interface CopyIconProps extends lucideIcons.LucideProps {
  name: string;
  className?: string;
}

const IconMap = new Map<string, React.FC<lucideIcons.LucideProps>>();

// 遍历数组并填充 Map
IconArrCollection.forEach(([key, value]) => {
  IconMap.set(key, value);
});

const Icon: React.FC<CopyIconProps> = ({ name, ...props }) => {
  const IconComponent = IconMap.get(name);

  const ComponentToRender = IconComponent || HelpCircle;

  return (
    <>
      <ComponentToRender {...props} />
    </>
  );
};

export default Icon;
