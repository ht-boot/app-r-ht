// import { useLoginView } from "./index";
import { Button } from "@/components/ui/button";
import { ArrowLeftToLine } from "lucide-react";
import type { LoginStateType } from "./index";

const BackLogin = ({
  setLoginView,
}: {
  setLoginView: (view: LoginStateType) => void;
}) => {
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
};
export default BackLogin;
