import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { LoginStateType } from "./index";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Smartphone,
  ScanQrCode,
  Facebook,
  Twitter,
  Chrome,
} from "lucide-react";

const formSchema = z.object({
  account: z.string().min(1, { message: "请输入账号" }),
  password: z.string().min(1, { message: "请输入密码" }),
  remember: z.boolean().default(true).optional(),
});

const socialLogins = [
  { Icon: Facebook, name: "Facebook" },
  { Icon: Chrome, name: "Google" },
  { Icon: Twitter, name: "Twitter" },
];

type FormValues = z.infer<typeof formSchema>;

const LoginForm = ({
  show,
  setLoginView,
}: {
  show: string;
  setLoginView: (value: LoginStateType) => void;
}) => {
  const navigate = useNavigate();
  const { setItem } = useLocalStorage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: "",
      password: "",
      remember: true,
    },
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  const handleViewChange = useCallback(
    (view: LoginStateType) => {
      setLoginView(view);
    },
    [setLoginView]
  );

  const onSubmit = async (values: FormValues) => {
    console.log("Submitted Data:", values); //

    const loginPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        Math.random() > 0.1
          ? resolve({ name: "Login Successful!" })
          : reject(new Error("Login Failed!"));
      }, 1500);
    });

    toast.promise(loginPromise, {
      loading: "Logging in, please wait...",
      success: (data: any) => {
        setItem("token", "1234567890");
        navigate("/", { replace: true });
        return `${data.name}`;
      },
      error: (err) => `${err.message}`,
    });
  };

  if (show !== "login") return null;

  return (
    <div className="w-[320px]">
      <div className="mb-6 text-center text-lg font-bold">系统登录 Ace.</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>账户</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入你的账户"
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
                    placeholder="请输入你的密码"
                    {...field}
                    autoComplete="current-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0 cursor-pointer">记住我</FormLabel>
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="link"
              size="sm"
              className="text-xs"
              onClick={() => handleViewChange("forget")}
            >
              忘记密码?
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Spinner className="mr-2" />}
            {isSubmitting ? "登录中..." : "登录"}
          </Button>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleViewChange("mobile")}
            >
              <Smartphone className="mr-2 h-4 w-4" /> 手机登录
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleViewChange("QRcode")}
            >
              <ScanQrCode className="mr-2 h-4 w-4" /> 二维码登录
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                其他登录方式
              </span>
            </div>
          </div>

          <div className="flex justify-around">
            {socialLogins.map(({ Icon, name }) => (
              <Button
                key={name}
                type="button"
                variant="outline"
                size="icon"
                onClick={() => toast.error(`${name} 登录方式未开放。`)}
              >
                <Icon className="h-5 w-5" />
              </Button>
            ))}
          </div>

          <div className="text-center text-sm">
            没有账号？
            <Button
              type="button"
              variant="link"
              className="px-1"
              onClick={() => handleViewChange("register")}
            >
              去注册
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
