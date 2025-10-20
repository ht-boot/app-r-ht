import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  //  1. 包装整个应用以启用路由功能
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
