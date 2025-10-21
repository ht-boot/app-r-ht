import type { RouteType } from "@/router";

// 模拟数据
export const menuList: RouteType[] = [
  {
    name: "Home",
    path: "/home",
    children: [
      {
        name: "Home",
        path: "/home/home1",
        element: "Home",
      },
      {
        name: "Home1",
        path: "/home/home2",
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
