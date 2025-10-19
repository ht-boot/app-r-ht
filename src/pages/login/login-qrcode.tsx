import type { LoginStateType } from "./index";
import { QRCodeSVG } from "qrcode.react";
import BackLogin from "./back-login";
export default function LoginQRcode({
  show,
  setLoginView,
}: {
  show: LoginStateType;
  setLoginView: (view: LoginStateType) => void;
}) {
  if (show !== "QRcode") return null;
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 h-[100vh]">
        <p className="text-[20px] font-bold">扫描二维码登录</p>
        <p className="pb-1 text-muted-foreground text-[12px]">
          点击扫一扫，登录
        </p>
        <QRCodeSVG value="https://github.com/ht-boot/app-r-ht" size={168} />
        <BackLogin setLoginView={setLoginView} />
      </div>
    </>
  );
}
