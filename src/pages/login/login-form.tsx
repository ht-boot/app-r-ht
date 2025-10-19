import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  ScanQrCode,
  Facebook,
  Chromium,
  Twitter,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  account: z.string().min(1, { message: "用户名不能为空。" }),
  password: z.string().min(1, { message: "密码不能为空。" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function MyForm() {
  // 记住我
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: "",
      password: "",
    },
    mode: "onChange", // 可选， 表示输入时就触发校验
  });

  function onSubmit(values: FormValues) {
    console.log("提交的数据：", values);
    toast.promise<{ name: string }>(
      () =>
        new Promise((resolve, reject) => {
          setLoading(true);
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            Math.random() > 0.1
              ? resolve({ name: "登录成功！" })
              : reject(new Error("登录失败！"));
          }, 2000);
        }),
      {
        loading: "系统登录中， 请稍后...",
        success: (data) => {
          setLoading(false);
          return `登录成功！${data.name}`;
        },
        error: (err) => {
          setLoading(false);
          return `${err.message}`;
        },
      }
    );
  }

  return (
    <div className="w-[320px]">
      <Form {...form}>
        <div className="flex flex-col items-center justify-center mb-6 font-bold text-[18px]">
          登录系统 System Ace.
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>用户名</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入用户名"
                    {...field}
                    autoComplete="username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    placeholder="请输入密码"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* 记住我/忘记密码 */}
          <div className="flex flex-row justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                className="cursor-pointer"
                id="remember"
                checked={remember}
                onCheckedChange={(checked) =>
                  setRemember(checked === "indeterminate" ? false : checked)
                }
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                记住我
              </label>
            </div>
            <Button
              type="button" // 防止表单提交 触发submit事件
              variant="link"
              size="sm"
              className="cursor-pointer text-[12px]"
            >
              忘记密码?
            </Button>
          </div>
          <>
            {loading ? (
              <Button disabled className="w-full cursor-pointer">
                <Spinner />
                登录中...
              </Button>
            ) : (
              <Button type="submit" className="w-full cursor-pointer">
                登 录
              </Button>
            )}
          </>

          {/* 手机登录/二维码登录 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
            >
              <Smartphone />
              手机登录
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
            >
              <ScanQrCode />
              二维码登录
            </Button>
          </div>
          {/* 其他登录方式 */}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              其他登录方式
            </span>
          </div>
          <div className="flex  justify-around text-2xl">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="cursor-pointer"
              onClick={() => toast.error("功能暂未实现。")}
            >
              <Facebook className="w-20 h-20" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="cursor-pointer"
              onClick={() => toast.error("功能暂未实现。")}
            >
              <Chromium />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="cursor-pointer"
              onClick={() => toast.error("功能暂未实现。")}
            >
              <Twitter />
            </Button>
          </div>

          {/* 注册 */}
          <div className="text-center text-sm">
            没有账号？
            <Button type="button" variant="link" className="px-1">
              立即注册
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
