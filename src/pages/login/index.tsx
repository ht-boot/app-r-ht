import { useState } from "react";
import LoginForm from "./login-form";
import ForgetPwd from "./forget-pwd";
import LoginQRcode from "./login-qrcode";
import LoginMobile from "./login-mobile";
import RegisterForm from "./register-form";
import LoginLeft from "./login-left";
import Theme from "@/components/theme";

export type LoginStateType =
  | "login"
  | "register"
  | "forget"
  | "mobile"
  | "QRcode";

const Login = () => {
  const [loginView, setLoginView] = useState<LoginStateType>("login"); // login | register | forget | mobile | qRcode
  return (
    <>
      <div className="flex flex-wrap h-screen items-center">
        <Theme />
        <div className="flex-1 max-lg:hidden">
          <LoginLeft />
        </div>
        {/* 右侧容器 */}
        <div className="flex-1 flex flex-col items-center justify-center mx-auto h-[100vh]">
          <LoginForm show={loginView} setLoginView={setLoginView} />
          <ForgetPwd show={loginView} setLoginView={setLoginView} />
          <LoginQRcode show={loginView} setLoginView={setLoginView} />
          <LoginMobile show={loginView} setLoginView={setLoginView} />
          <RegisterForm show={loginView} setLoginView={setLoginView} />
        </div>
      </div>
    </>
  );
};
export default Login;
