import { createFileRoute, Outlet } from "@tanstack/react-router";
import { HeroList } from "@/features/heroes/components/hero-list";
import { DarkModeToggle } from "@/features/heroes/components/dark-mode-toggle";

export const Route = createFileRoute("/heroes")({
  component: HeroesLayout,
});

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
