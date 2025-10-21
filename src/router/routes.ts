import React from "react";
import Layout from "@/pages/layout";
import Login from "@/pages/login";
import NotFind from "@/pages/404";

type RoutesType = {
  [key: string]: React.FC;
};

const routerPaths: RoutesType = {
  Layout,
  Login,
  404: NotFind, // 404页面
  Home: React.lazy(() => import("@/pages/home")),
  About: React.lazy(() => import("@/pages/about")),
  Home1: React.lazy(() => import("@/pages/home1")),
};

export default routerPaths;
