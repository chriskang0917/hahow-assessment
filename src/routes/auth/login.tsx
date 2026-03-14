import { useForm } from "@tanstack/react-form";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { OctagonAlert } from "lucide-react";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Link,
  Typography,
} from "@/components/ui";
import { useLoginMutation } from "@/features/auth/hooks/useLoginMutation";
import { loginSchema } from "@/features/auth/schema/login.schema";

export const Route = createFileRoute("/auth/login")({
  beforeLoad: async ({ context }) => {
    if (context.auth.isLogin && context.auth.role) {
      throw redirect({ to: `/${context.auth.role}/home` });
    }
  },
  component: Login,
});

const defaultValues = {
  email: "",
  password: "",
};

function Login() {
  const { mutate: login, error, isPending } = useLoginMutation();

  const form = useForm({
    defaultValues,
    validators: {
      onMount: loginSchema,
      onChange: loginSchema,
    },
    onSubmit: ({ value }) => {
      login(value);
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
        <CardTitle className="flex items-center justify-center text-2xl font-semibold">
          LOGO
        </CardTitle>
        <CardDescription className="text-center">登入</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <OctagonAlert />
              <AlertDescription>無效的帳號或密碼，請再試一次。</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-y-1">
            <form.Field
              name="email"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>使用者名稱</Label>
                  <Input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="請輸入使用者名稱"
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-11"
                  />
                </>
              )}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <form.Field
              name="password"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>密碼</Label>
                  <Input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="請輸入密碼"
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-11"
                  />
                </>
              )}
            />
          </div>

          <div className="flex items-center justify-end">
            <Link to="/auth/forgot-password">忘記密碼？</Link>
          </div>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit || isSubmitting || isPending}
              >
                {isSubmitting ? "登入中..." : "登入"}
              </Button>
            )}
          />
        </form>

        <Typography variant="muted" className="mt-6 text-center">
          需要幫助嗎？請聯繫 Chris
        </Typography>
      </CardContent>
    </Card>
  );
}
