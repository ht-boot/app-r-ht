import React, { useState, useMemo, useCallback, type ChangeEvent } from "react";
import * as lucideIcons from "lucide-react";
import { Input } from "@/components/ui/input";
import CopyIcon from "./copy-icon";

type LucideIconComponent = React.FC<lucideIcons.LucideProps>;

// --- 图标过滤逻辑 ---
const CATEGORY_KEYWORDS = [
  "ScanFace",
  "Instagram",
  "LogOut",
  "LogIn",
  "Settings",
  "Fingerprint",
  "WalletMinimalIcon",
  "CreditCard",
  "Arrows",
  "MenuIcon",
  "LaptopMinimalCheck",
  "LayoutDashboard",
  "FigmaIcon",
  "Store",
  "ChartBarBigIcon",
  "ChartPieIcon",
  "UserRound",
  "UserPlus",
  "UserRoundPen",
  "BotMessageSquareIcon",
  "CodeXmlIcon",
  "SquarePlay",
  "BadgeDollarSignIcon",
  "BadgeEuroIcon",
  "BadgeJapaneseYenIcon",
  "ScanBarcode",
  "ScanQrCode",
  "KeySquare",
  "Video",
  "BellRing",
  "Vibrate",
  "MapPinCheck",
  "AudioWaveform",
  "Paperclip",
  "Trash2",
  "SquareSplitHorizontal",
  "Gamepad2",
  "Hamburger",
  "Milk",
  "AppleIcon",
  "CloudUploadIcon",
];

const getFilteredIcons = (): [string, LucideIconComponent][] => {
  return (Object.entries(lucideIcons) as [string, LucideIconComponent][])
    .filter(([key]) => {
      // 优化过滤逻辑，排除内部工具和特定关键词
      const isInternalTool = [
        "createLucideIcon",
        "IconNode",
        "Icon",
        "icons",
        "LucideIcon",
        "default",
      ].includes(key);

      if (isInternalTool) {
        return false;
      }

      // 检查图标名称是否与关键词相关
      return CATEGORY_KEYWORDS.some((keyword) => key.includes(keyword));
    })
    .sort((a, b) => a[0].localeCompare(b[0]));
};

export const IconArrCollection = getFilteredIcons();

// ---  IconsGallery 组件 ---
const IconsGallery: React.FC = () => {
  // 获取过滤后的图标列表
  const initialIcons = useMemo(() => getFilteredIcons(), []);
  // 搜索词
  const [searchTerm, setSearchTerm] = useState("");

  const onSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const filterIcons = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLocaleLowerCase();
    if (!lowercasedSearchTerm) {
      return initialIcons;
    }
    return initialIcons.filter(([name]) =>
      name.toLocaleLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm, initialIcons]); // 仅当搜索词或初始列表变化时才重新计算

  return (
    <div className="container mx-auto p-2 sm:p-2">
      <h1 className="text-3xl font-extrabold mb-4">
        图标列表 ({initialIcons.length} 个)
      </h1>

      <Input
        onChange={onSearchChange}
        className="mb-4"
        placeholder={`在此搜索 ${initialIcons.length} 个图标, 点击图标可复制代码`}
      />

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-16 gap-3 sm:gap-4">
        {filterIcons.map(([iconName, IconComponent]) => (
          <CopyIcon
            key={iconName}
            Icon={IconComponent}
            copyContent={iconName}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(IconsGallery);
