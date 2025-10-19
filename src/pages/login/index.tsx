import LoginForm from "./login-form";
export default function Login() {
  return (
    <>
      <div className="flex flex-wrap h-screen">
        <div className="flex-1 max-lg:hidden flex items-center justify-center">
          left
        </div>
        {/* 右侧容器 */}
        <div className="flex-1 flex flex-col items-center mt-20 mx-auto w-full">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
