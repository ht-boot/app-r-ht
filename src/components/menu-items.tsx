import { useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";

import type { RouteType } from "@/router";

import { useNavigate, useLocation } from "react-router-dom";

// 递归渲染菜单项
export const MenuItem = ({ items }: { items: RouteType[] }) => {
  const [openMenuMap, setOpenMenuMap] = useState<string[]>([]); // 默认展开第一个菜单项
  const navigate = useNavigate(); // 导航到指定路径
  const location = useLocation(); // 🌟 1. 获取当前路由信息

  // 辅助函数，用于判断是否是当前活动路由
  const isMenuActive = (path: string, hasChildren: boolean) => {
    // location.pathname 是当前 URL 的路径部分
    const currentPath = location.pathname;

    if (hasChildren) {
      // 🌟 针对父菜单：检查当前路径是否以菜单路径开头（部分匹配）
      // 确保 '/path' 不匹配 '/path-name'，所以加上 '/'
      return currentPath.startsWith(path + "/") || currentPath === path;
    } else {
      // 🌟 针对叶子菜单：精确匹配
      return currentPath === path;
    }
  };

  const onToggleMenu = (name: string) => {
    setOpenMenuMap((prev) => {
      // 使用展开运算符创建新的数组，并添加或移除 name
      const newArr = [...prev];
      if (newArr.includes(name)) {
        // 如果该菜单项已经在数组中，移除它（折叠）
        return newArr.filter((item) => item !== name);
      } else {
        // 如果该菜单项不在数组中，添加它（展开）
        newArr.push(name);
        return newArr;
      }
    });
  };

  return items.map((item) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = isMenuActive(item.path, hasChildren as boolean); //  2. 判断是否选中
    // if (!openMenuMap.includes(item.path) && hasChildren && isActive) {
    //   setOpenMenuMap((prev) => [...new Set([...prev, item.path])]);
    // }
    return (
      <Collapsible
        key={item.path}
        asChild
        open={openMenuMap.includes(item.path)}
      >
        <SidebarMenuItem>
          {hasChildren ? (
            <CollapsibleTrigger asChild onClick={() => onToggleMenu(item.path)}>
              <SidebarMenuButton
                tooltip={item.name}
                className={`text-nowrap cursor-pointer justify-between overflow-hidden}`}
              >
                {item.icon && <item.icon />}
                <span>{item.name}</span>
                <ChevronRight
                  className={`ml-auto transition-transform duration-200 ${
                    openMenuMap.includes(item.path) || isActive
                      ? "rotate-90"
                      : "rotate-0"
                  }`}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
          ) : (
            // 没有子菜单时，直接渲染链接
            <SidebarMenuButton
              tooltip={item.name}
              className={`text-nowrap hover:bg-primary/12 hover:text-primary cursor-pointer transition-all justify-between overflow-hidden ${
                isActive
                  ? " dark:bg-gray-700 bg-primary/28 text-primary font-semibold "
                  : "" //  应用高亮
              }`}
              onClick={() => {
                navigate(item.path);
              }}
            >
              {item.icon && <item.icon />}
              <span>{item.name}</span>
            </SidebarMenuButton>
          )}
          <CollapsibleContent>
            <SidebarMenuSub className="p-0 pl-3 m-0">
              {item.children && item.children.length > 0 && (
                // 递归渲染子菜单
                <MenuItem items={item.children} />
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  });
};
