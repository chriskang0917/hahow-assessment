import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/heroes/")({
  component: HeroesIndexPage,
});

function HeroesIndexPage() {
  return (
    <p className="mt-8 text-center text-muted-foreground">
      請選擇一位英雄查看能力值
    </p>
  );
}
