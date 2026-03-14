import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isLogin) throw redirect({ to: "/auth/login" });
    if (context.auth.role) throw redirect({ to: `/${context.auth.role}/home` });
  },
  component: () => <Outlet />,
});
