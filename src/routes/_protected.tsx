import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Header from "@/components/common/header";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isLogin) throw redirect({ to: "/auth/login" });
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Header />
      <main className="mt-17 min-h-[calc(100vh-4.25rem)] max-w-screen p-3">
        <Outlet />
      </main>
    </>
  );
}
