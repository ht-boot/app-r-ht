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
  home: React.lazy(() => import("@/pages/home")),
  menu: React.lazy(() => import("@/pages/system/menu")),
  icon: React.lazy(() => import("@/pages/system/icon")),
  user: React.lazy(() => import("@/pages/user/user")),
  role: React.lazy(() => import("@/pages/user/role")),
  profile: React.lazy(() => import("@/pages/user/profile")),
  fileUpload: React.lazy(() => import("@/pages/file/file-upload")),
  task: React.lazy(() => import("@/pages/task")),
  auth: React.lazy(() => import("@/pages/system/auth")),
};

export default routerPaths;
