import type { RouteType } from "@/router";

// 模拟数据
export const menuList: RouteType[] = [
  {
    name: "系统管理",
    path: "/system",
    children: [
      {
        name: "菜单管理",
        path: "/system/menu",
        element: "menu",
      },
      {
        name: "权限管理",
        path: "/system/auth",
        element: "auth",
      },
      {
        name: "图标管理",
        path: "/system/icon",
        element: "icon",
      },
    ],
  },
  {
    name: "用户管理",
    path: "/user",
    children: [
      {
        name: "用户列表",
        path: "/user/userList",
        element: "userList",
      },
      {
        name: "角色管理",
        path: "/user/role",
        element: "role",
      },
      {
        name: "个人信息",
        path: "/user/profile",
        element: "profile",
      },
    ],
  },
  {
    name: "任务管理",
    path: "/task",
    element: "task",
  },
];
