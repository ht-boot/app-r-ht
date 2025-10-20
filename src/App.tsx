import { Routes } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { generateRoutes, generateRouteElements } from "./router";
import { menuList } from "./api";

// 生成路由配置
const routes = generateRoutes(menuList);

const App = () => (
  <div className="App">
    <Routes>{generateRouteElements(routes)}</Routes>
    <Toaster
      position="top-right" // top-left, top-center, bottom-right, bottom-left, bottom-center
      toastOptions={{
        duration: 3000, // toast 显示时间
        style: { fontSize: "14px" },
      }}
    />
  </div>
);

export default App;
