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

import Icon from "@/components/icons/icon";

import type { RouteType } from "@/router";
import { useNavigate, useLocation } from "react-router-dom";

// 递归渲染菜单项
export const MenuItem = ({ items }: { items: RouteType[] }) => {
  const [openMenuMap, setOpenMenuMap] = useState<string[]>([]);
  const navigate = useNavigate(); // 导航到指定路径
  const location = useLocation(); // 获取当前路由信息

  const isMenuActive = (path: string, hasChildren: boolean) => {
    // 是当前 URL 的路径部分
    const currentPath = location.pathname;

    if (hasChildren) {
      // 针对父菜单：检查当前路径是否以菜单路径开头（部分匹配）
      return currentPath.startsWith(path + "/") || currentPath === path;
    } else {
      // 针对叶子菜单：精确匹配
      return currentPath === path;
    }
  };

  const onToggleMenu = (name: string) => {
    setOpenMenuMap((prev) => {
      // 使用展开运算符创建新的数组，并添加或移除 name
      const newArr = [...prev];
      if (newArr.includes(name)) {
        return newArr.filter((item) => item !== name);
      } else {
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
            <CollapsibleTrigger
              asChild
              onClick={() => onToggleMenu(item.path)}
              className="hover:bg-primary/10! hover:text-primary! active:bg-primary/10! active:text-primary!"
            >
              <SidebarMenuButton
                tooltip={item.name}
                className={`text-nowrap cursor-pointer justify-between overflow-hidden hover:bg-primary/10 hover:text-primary`}
              >
                {item.icon && <Icon name={item.icon} className="size-20" />}
                <span className="pl-3">{item.name}</span>
                <ChevronRight
                  className={`ml-auto transition-transform duration-200 ${
                    openMenuMap.includes(item.path) ? "rotate-90" : "rotate-0"
                  }`}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
          ) : (
            // 没有子菜单时，直接渲染链接
            <SidebarMenuButton
              tooltip={item.name}
              className={`text-nowrap hover:bg-primary/12 hover:text-primary active:bg-primary/10! active:text-primary! cursor-pointer transition-all overflow-hidden ${
                isActive
                  ? " dark:bg-gray-700 bg-primary/28 text-primary font-semibold"
                  : "" //  应用高亮
              }`}
              onClick={() => {
                navigate(item.path);
              }}
            >
              {item.icon && <Icon name={item.icon} className="size-20" />}
              <span className="pl-3">{item.name}</span>
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
