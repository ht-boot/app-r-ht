import type { LucideIcon } from "lucide-react";
import { Route } from "react-router-dom";
import routerPaths from "./routes";

export type MetaType = {
  title?: string;
  isActive?: boolean;
};

export type RouteType = {
  path: string;
  name: string;
  icon?: LucideIcon; // 图标
  element?: string;
  meta?: MetaType[];
  children?: RouteType[]; // 子路由
};
// 递归扁平化路由
const flattenRoutes = (
  routes: RouteType[],
  acc: RouteType[] = []
): RouteType[] => {
  routes.forEach((route) => {
    if (route.children && route.children.length > 0) {
      flattenRoutes(route.children, acc);
    } else {
      acc.push(route);
    }
  });

  return acc;
};

// 主函数，用于生成最终的路由配置数组
export const generateRoutes = (dynamicRoutes: RouteType[]) => {
  const finalDynamicRoutes = flattenRoutes(dynamicRoutes);

  const routes = [
    {
      path: "/",
      name: "首页",
      element: "Layout", // 这里使用字符串来表示组件，实际使用时需要根据字符串来动态加载组件
      children: [...finalDynamicRoutes],
    },
    {
      path: "/login",
      name: "登录",
      element: "Login",
    },
    {
      path: "*",
      name: "404",
      element: "404",
    },
  ];
  return routes;
};

// 递归生成Route组件
export const generateRouteElements = (
  routes: RouteType[]
): React.ReactNode[] => {
  return routes
    .map((route) => {
      if (!route.path || !route.element) return null;

      const Element = routerPaths[route.element];

      if (route.children) {
        return (
          <Route key={route.path} path={route.path} element={<Element />}>
            {generateRouteElements(route.children)}
          </Route>
        );
      } else {
        return (
          <Route key={route.path} path={route.path} element={<Element />} />
        );
      }
    })
    .filter(Boolean);
};
