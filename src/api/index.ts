import type { RouteType } from "@/router";

// 模拟数据
export const menuList: RouteType[] = [
  {
    name: "首页",
    path: "/",
    icon: "LayoutDashboard",
    element: "home",
  },

  {
    name: "系统管理",
    path: "/system",
    icon: "LucideSettings",
    children: [
      {
        name: "菜单管理",
        path: "/system/menu",
        icon: "MenuIcon",
        element: "menu",
      },
      {
        name: "权限管理",
        path: "/system/auth",
        icon: "KeySquareIcon",
        element: "auth",
      },
      {
        name: "图标管理",
        path: "/system/icon",
        icon: "LucideSettings2",
        element: "icon",
      },
    ],
  },
  {
    name: "用户管理",
    path: "/user",
    icon: "LucideUserRoundCog",
    children: [
      {
        name: "用户列表",
        path: "/user/list",
        icon: "LucideUserRoundPlus",
        element: "user",
      },
      {
        name: "角色管理",
        path: "/user/role",
        icon: "LucideUserRoundPen",
        element: "role",
      },
      {
        name: "个人信息",
        path: "/user/profile",
        icon: "LucideUserRoundSearch",
        element: "profile",
      },
    ],
  },
  {
    name: "任务管理",
    path: "/task",
    icon: "LaptopMinimalCheck",
    element: "task",
  },
  {
    name: "文件管理",
    path: "/fileUpload",
    icon: "CloudUploadIcon",
    element: "fileUpload",
  },
  {
    name: "动画管理",
    path: "/animate",
    icon: "Gamepad2Icon",
    element: "animate",
  },
];
