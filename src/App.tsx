import Login from "@/pages/login";
import { Toaster } from "./components/ui/sonner";

const App = () => (
  <div className="App">
    <Login />
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
