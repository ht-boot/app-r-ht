// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";

// ---------- Layout ----------
function Layout() {
  return (
    <div>
      <h1>我的网站</h1>
      <nav>
        <Link to="/">首页</Link> | <Link to="/about">关于</Link> |{" "}
        <Link to="/dashboard">仪表盘</Link>
      </nav>
      <hr />
      {/* 子路由出口 */}
      <Outlet />
    </div>
  );
}

// ---------- Pages ----------
function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <h2>首页</h2>
      <button onClick={() => navigate("/about")}>跳转到关于页面</button>
    </div>
  );
}

function About() {
  return <h2>关于我们</h2>;
}

function Dashboard() {
  return (
    <div>
      <h2>仪表盘</h2>
      <nav>
        <Link to="stats">统计</Link> | <Link to="settings">设置</Link>
      </nav>
      <Outlet />
    </div>
  );
}

function Stats() {
  return <h3>统计页面</h3>;
}

function Settings() {
  return <h3>设置页面</h3>;
}

// 动态路由示例
function User() {
  const { id } = useParams();
  return <h2>用户 ID: {id}</h2>;
}

// 404 页面
function NotFound() {
  return <h2>404 - 页面不存在</h2>;
}

// ---------- App ----------
export default function App() {
  return (
    <Router>
      <Routes>
        {/* 根布局路由 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />

          {/* 仪表盘嵌套路由 */}
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="stats" element={<Stats />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 动态路由 */}
          <Route path="user/:id" element={<User />} />

          {/* 重定向 */}
          <Route path="old-home" element={<Navigate to="/" replace />} />

          {/* 404 页面 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}
