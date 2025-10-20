import React from "react";

type RoutersType = {
  [key: string]: React.FC;
};

const routerPaths: RoutersType = {
  Layout: React.lazy(() => import("@/pages/layout")),
  About: React.lazy(() => import("@/pages/about")),
  Home: React.lazy(() => import("@/pages/home")),
  Login: React.lazy(() => import("@/pages/login")),
  404: React.lazy(() => import("@/pages/404")),
  Home1: React.lazy(() => import("@/pages/home1")),
  Home2: React.lazy(() => import("@/pages/home2")),
};

export default routerPaths;
