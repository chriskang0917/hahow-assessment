import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <>
      <main className="flex min-h-screen min-w-screen items-center justify-center">
        <Outlet />
      </main>
    </>
  );
}
