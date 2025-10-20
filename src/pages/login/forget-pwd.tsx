import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginStateType } from "./index";
import BackLogin from "./back-login";
import { memo } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "请输入合法的邮箱地址。" }),
});

type FormValues = z.infer<typeof formSchema>;

const ForgetPwd = ({
  show,
  setLoginView,
}: {
  show: LoginStateType;
  setLoginView: (show: LoginStateType) => void;
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange", // 可选， 表示输入时就触发校验
  });
  if (show !== "forget") return null;
  const sendEmail = (values: FormValues) => {
    console.log(values);
  };

  return (
    <div className="w-[320px] max-h-max">
      <div className="mb-8 text-center">
        <div className="text-primary!">图片</div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(sendEmail)} className="space-y-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-[18px] font-bold">重置密码</p>
            <p className="text-balance text-sm text-muted-foreground text-[12px]">
              请输入与您帐户关联的电子邮箱地址，我们将通过电子邮箱向您发送重置密码的链接。
            </p>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="请输入有效邮箱" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            发送邮箱
          </Button>
          <BackLogin setLoginView={setLoginView} />
        </form>
      </Form>
    </div>
  );
};
export default memo(ForgetPwd);
