import { MenuItem } from "@/components/menu-items";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { menuList } from "@/api";
export function NavMain() {
  // 递归渲染菜单项
  return (
    <SidebarGroup>
      <SidebarGroupLabel>平台</SidebarGroupLabel>
      <SidebarMenu>
        <MenuItem items={menuList} />
      </SidebarMenu>
    </SidebarGroup>
  );
}
