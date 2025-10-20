import { Home } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Route } from "react-router-dom";
import routerPaths from "./routers";

export type MetaType = {
  title?: string;
  isActive?: boolean;
};

export type RouteType = {
  path?: string;
  name?: string;
  icon?: LucideIcon; // 图标
  element?: string;
  meta?: MetaType[];
  children?: RouteType[]; // 子路由
};

// 主函数，用于生成最终的路由配置数组
export const generateRoutes = (dynamicRoutes: RouteType[]) => {
  const finalDynamicRoutes = Array.isArray(dynamicRoutes) ? dynamicRoutes : [];
  const routes = [
    {
      path: "/",
      name: "首页",
      icon: Home,
      element: "Layout", // 这里使用字符串来表示组件，实际使用时需要根据字符串来动态加载组件
      children: [...finalDynamicRoutes],
    },
    {
      path: "/login",
      element: "Login", // 这里使用字符串来表示组件，实际使用时需要根据字符串来动态加载组件
    },
    {
      path: "*",
      element: "404", // 这里使用字符串来表示组件，实际使用时需要根据字符串来动态加载组件
    },
  ];

  console.log(routes, "routes");

  return routes;
};

// 递归生成Route组件
export const generateRouteElements = (
  routes: RouteType[]
): React.ReactNode[] => {
  return routes.map((route) => {
    const Element = routerPaths[route.element as string];

    if (route.children) {
      return (
        <Route key={route.path} path={route.path} element={<Element />}>
          {generateRouteElements(route.children)}
        </Route>
      );
    } else {
      return <Route key={route.path} path={route.path} element={<Element />} />;
    }
  });
};
