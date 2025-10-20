import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>🏠 欢迎来到主页</h1>
      <p>这是一个演示 React Router v6 嵌套路由的完整案例。</p>
      <Outlet />
    </div>
  );
};

export default Home;
