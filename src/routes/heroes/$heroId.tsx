import { createFileRoute } from "@tanstack/react-router";
import { HeroProfile } from "@/features/heroes/components/hero-profile";

export const Route = createFileRoute("/heroes/$heroId")({
  component: HeroProfilePage,
  errorComponent: HeroProfileError,
});

function HeroProfileError() {
  return (
    <div className="mt-8 rounded-xl border border-destructive/50 p-6 text-center">
      <p className="text-destructive">載入英雄資料時發生錯誤</p>
    </div>
  );
}

function HeroProfilePage() {
  const { heroId } = Route.useParams();
  return <HeroProfile heroId={heroId} />;
}
