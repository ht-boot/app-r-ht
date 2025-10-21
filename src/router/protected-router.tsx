import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// 假设您有一个函数或Hook来获取用户的登录状态
const useAuth = () => {
  // 实际项目中，这里会读取 Redux/Context/localStorage 中的 token 或 user 状态
  const isAuthenticated = localStorage.getItem("token") ? true : false;
  return { isAuthenticated };
};

// 路由守卫组件
interface ProtectedRouteProps {
  // 您可以传递需要的权限等级等 props
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // 用户未登录，重定向到登录页
    // state={{ from: location }} 用于登录后跳回原页面
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 用户已登录，渲染子路由或元素
  // <Outlet /> 会渲染当前路由配置中嵌套的子元素
  return <Outlet />;
};

export default ProtectedRoute;
