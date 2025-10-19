import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import BackLogin from "./back-login";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginStateType } from "./index";

const formSchema = z
  .object({
    account: z.string().min(8, "账号不能为空， 且至少8位"),
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: "密码至少8位，包含大小写字母和数字",
      }),
    phone: z.string().regex(/^1[3456789]\d{9}$/, "请输入正确的手机号"),
    email: z.string().email("请输入正确的邮箱"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    // 验证失败时显示的错误信息
    message: "两次输入的密码不一致",
    // 错误信息应该显示在 'confirmPassword' 字段下方
    path: ["confirmPassword"],
  });
type FormValues = z.infer<typeof formSchema>;

export default function RegisterForm({
  show,
  setLoginView,
}: {
  show: LoginStateType;
  setLoginView: (view: LoginStateType) => void;
}) {
  // 定义账号、密码与校验规则
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: "",
      password: "",
      email: "",
      phone: "",
      confirmPassword: "",
    },
    mode: "onChange", // 可选， 表示输入时就触发校验
  });

  const onRegister = async (values: any) => {
    // TODO: 注册逻辑
    console.log(values);
  };

  if (show !== "register") return null;

  return (
    <div className="w-[320px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onRegister)} className="space-y-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-[18px] font-bold">用户账号注册 </p>
          </div>

          <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="请输入账号" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="请输入手机号" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="请输入邮箱" {...field} />
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
                <FormControl>
                  <Input
                    type="password"
                    placeholder="请输入密码（至少8位，包含大小写字母和数字）"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="请再次输入密码"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            注册
          </Button>

          <div className="mb-2 text-xs text-gray">
            <span>注册即我同意</span>
            <a href="./" className="text-sm underline! text-primary!">
              服务条款
            </a>
            {" & "}
            <a href="./" className="text-sm underline! text-primary!">
              隐私政策
            </a>
          </div>

          <BackLogin setLoginView={setLoginView} />
        </form>
      </Form>
    </div>
  );
}
