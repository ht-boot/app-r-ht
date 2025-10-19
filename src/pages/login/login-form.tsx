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

const formSchema = z.object({
  account: z.string().min(1, { message: "用户名不能为空。" }),
  password: z.string().min(1, { message: "密码至少6位" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function MyForm() {
  // 记住我
  const [remember, setRemember] = useState(true);

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
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="account"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder="请输入用户名" {...field} />
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
                <Input type="password" placeholder="请输入密码" {...field} />
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
            variant="link"
            size="sm"
            className="cursor-pointer text-red-400 hover:text-red-600 text-[12px]"
          >
            忘记密码?
          </Button>
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          登 录
        </Button>
        {/* 手机登录/二维码登录 */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Button variant="outline" className="w-full cursor-pointer">
            <Smartphone />
            手机登录
          </Button>
          <Button variant="outline" className="w-full cursor-pointer">
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
          <Button variant="outline" size="icon" className="cursor-pointer">
            <Facebook className="w-20 h-20" />
          </Button>
          <Button variant="outline" size="icon" className="cursor-pointer">
            <Chromium />
          </Button>
          <Button variant="outline" size="icon" className="cursor-pointer">
            <Twitter />
          </Button>
        </div>
      </form>
    </Form>
  );
}
