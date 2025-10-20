import type { LoginStateType } from "./index";
import BackLogin from "./back-login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useState, memo } from "react";

// 定义手机号、验证码与校验规则
const LoginMobileSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, { message: "请输入正确的手机号" }),
  verifyCode: z.string().min(6, { message: "请输入验证码" }).max(6),
});
const LoginMobile = ({
  show,
  setLoginView,
}: {
  show: LoginStateType;
  setLoginView: (value: LoginStateType) => void;
}) => {
  const form = useForm<z.infer<typeof LoginMobileSchema>>({
    resolver: zodResolver(LoginMobileSchema),
    defaultValues: {
      phone: "",
      verifyCode: "",
    },
    mode: "onChange", // 可选， 表示输入时就触发校验
  });

  const [isSending, setIsSending] = useState(false);
  const [seconds, setSeconds] = useState(60);

  if (show !== "mobile") return null;

  /**
   * 发送验证码的函数
   * 该函数处理验证码发送的逻辑，包括设置发送状态和倒计时功能
   */
  const sendVerifyCode = () => {
    // 设置正在发送的状态为true
    setIsSending(true);
    const timer = setInterval(() => {
      // 使用函数形式的setState，基于之前的秒数更新
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer); // 清除定时器
          setIsSending(false);
          return 60; // 重置秒数
        }
        // 否则秒数减1
        return prev - 1;
      });
    }, 1000);
  };
  const onSubmit = (data: z.infer<typeof LoginMobileSchema>) => {
    console.log(data);
  };
  return (
    <>
      <Form {...form}>
        <div className="text-[18px] font-bold text-center mb-4">手机登录</div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>手机号</FormLabel>
                <FormControl>
                  <Input placeholder="请输入手机号" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="verifyCode"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>验证码</FormLabel>
                  {isSending ? (
                    <div className="text-sm text-gray-400">
                      {seconds} 秒后重新发送
                    </div>
                  ) : (
                    <div
                      className="text-right text-sm font-medium cursor-pointer"
                      onClick={() => sendVerifyCode()}
                    >
                      发送验证码
                    </div>
                  )}
                </div>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            登 录
          </Button>
        </form>
      </Form>
      <BackLogin setLoginView={setLoginView} /> {/* 返回登录 */}
    </>
  );
};
export default memo(LoginMobile);
