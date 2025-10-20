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

import { useNavigate } from "react-router-dom";

// 递归渲染菜单项
export const MenuItem = ({ items }: { items: RouteType[] }) => {
  const [openMenuMap, setOpenMenuMap] = useState<string[]>([]); // 默认展开第一个菜单项
  const navigate = useNavigate(); // 导航到指定路径
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

  return items.map((item) => (
    <Collapsible key={item.path} asChild open={openMenuMap.includes(item.path)}>
      <SidebarMenuItem>
        {item.children && item.children.length > 0 ? (
          <CollapsibleTrigger asChild onClick={() => onToggleMenu(item.path)}>
            <SidebarMenuButton
              tooltip={item.name}
              className="text-nowrap cursor-pointer justify-between overflow-hidden"
            >
              {item.icon && <item.icon />}
              <span>{item.name}</span>
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
            className="cursor-pointer"
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
  ));
};
