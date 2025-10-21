import type { RouteType } from "@/router";

// 模拟数据
export const menuList: RouteType[] = [
  {
    name: "Home",
    path: "/",
    children: [
      {
        name: "Home",
        path: "/",
        element: "Home",
      },
      {
        name: "Home1",
        path: "/home1",
        element: "Home1",
      },
    ],
  },
  {
    name: "About",
    path: "/about",
    element: "About",
  },
];
