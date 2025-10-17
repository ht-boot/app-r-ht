import * as React from "react";
import { MonitorCog, User, IdCard, BookText } from "lucide-react";
import { NavMain } from "@/components/nav-mian";
import type { MenuItemType } from "@/components/menu-items";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import NavHeader from "@/components/nav-header";

const menuItems: MenuItemType[] = [
  {
    name: "系统管理",
    url: "/platform",
    isActive: false,
    icon: MonitorCog,
    children: [
      {
        name: "用户管理",
        url: "/platform/sub1",
        isActive: false,
        icon: User,
        children: [
          { name: "SubSubItem1", url: "/platform/sub1/sub1" },
          { name: "SubSubItem2", url: "/platform/sub1/sub2" },
        ],
      },
      {
        name: "角色管理",
        url: "/platform/sub2",
        icon: IdCard,
        children: [
          { name: "SubSubItem1", url: "/platform/sub1/sub1" },
          { name: "SubSubItem2", url: "/platform/sub1/sub2" },
        ],
      },
    ],
  },
  {
    name: "内容管理",
    url: "/dashboard",
    icon: BookText,
    children: [
      { name: "SubSubItem1", url: "/platform/sub1/sub1" },
      { name: "SubSubItem2", url: "/platform/sub1/sub2" },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems} />
      </SidebarContent>
      <SidebarFooter>
        <div>footer</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
