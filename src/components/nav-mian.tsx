import { MenuItem } from "@/components/menu-items";
import type { MenuItemType } from "@/components/menu-items";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";

export function NavMain({ items }: { items: MenuItemType[] }) {
  // 递归渲染菜单项
  return (
    <SidebarGroup>
      <SidebarGroupLabel>平台</SidebarGroupLabel>
      <SidebarMenu>
        <MenuItem items={items} />
      </SidebarMenu>
    </SidebarGroup>
  );
}
