import { Button } from "@/components/ui/button";
import { ArrowLeftToLine } from "lucide-react";
import type { LoginStateType } from "./index";

export default function BackLogin({
  setLoginView,
}: {
  setLoginView: (view: LoginStateType) => void;
}) {
  const goBack = () => {
    setLoginView("login");
  };

  return (
    <Button
      type="button"
      variant="link"
      onClick={goBack}
      className="flex items-center justify-center mx-auto text-sm"
    >
      <ArrowLeftToLine /> 返回登录
    </Button>
  );
}
