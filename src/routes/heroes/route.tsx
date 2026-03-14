import { createFileRoute, Outlet } from "@tanstack/react-router";
import { HeroList } from "@/features/heroes/components/hero-list";

export const Route = createFileRoute("/heroes")({
  component: HeroesLayout,
});

function HeroesLayout() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <HeroList />
      <Outlet />
    </main>
  );
}
