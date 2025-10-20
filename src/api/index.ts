import type { RouteType } from "@/router";

// 模拟数据
export const menuList: RouteType[] = [
  {
    name: "Home",
    path: "/",
    element: "Home",
    children: [
      {
        name: "Home1",
        path: "/home1",
        element: "Home1",
      },
      {
        name: "Home2",
        path: "/home2",
        element: "Home2",
      },
    ],
  },
  {
    name: "About",
    path: "/about",
    element: "About",
  },
];
