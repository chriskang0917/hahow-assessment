import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Link,
} from "@/components/ui";
import { forgotPasswordSchema } from "@/features/auth/schema/forgot-password.schema";

export const Route = createFileRoute("/auth/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onMount: forgotPasswordSchema,
      onChange: forgotPasswordSchema,
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <Card className="w-full max-w-lg border-0 shadow-lg">
      <CardHeader className="space-y-1 pb-3">
        <CardTitle className="text-center text-2xl font-semibold">重設密碼</CardTitle>
        <CardDescription className="text-center">
          我們會將一封認證信寄送至你的 Email，請點擊信裡的確認連結以重設密碼。
        </CardDescription>
        <CardDescription className="text-center">
          找不到認證信時，請到「垃圾信件」分類查找。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <form.Field
            name="email"
            children={(field) => (
              <div className="flex flex-col gap-y-1">
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="請輸入你的 Email..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-11"
                />
              </div>
            )}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                {form.state.isSubmitting ? (
                  <div className="flex items-center justify-center gap-x-2">
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    發送中...
                  </div>
                ) : (
                  "發送重設密碼信件"
                )}
              </Button>
            )}
          />

          <Link className="mt-4" to="/auth/login">
            <ArrowLeft className="h-4 w-4" />
            <span>返回登入頁面</span>
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
