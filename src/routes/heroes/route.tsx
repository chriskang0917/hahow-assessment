import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/features/heroes/components/dark-mode-toggle";
import { HeroList } from "@/features/heroes/components/hero-list";

export const Route = createFileRoute("/heroes")({
  component: HeroesLayout,
  errorComponent: HeroesError,
});

function HeroesError() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-lg text-destructive">頁面發生錯誤</p>
      <Button onClick={() => router.invalidate()}>重新載入</Button>
    </main>
  );
}

function HeroesLayout() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hahow Heroes</h1>
        <DarkModeToggle />
      </div>
      <HeroList />
      <Outlet />
    </main>
  );
}
