import { createFileRoute } from "@tanstack/react-router";
import { HeroProfile } from "@/features/heroes/components/hero-profile";

export const Route = createFileRoute("/heroes/$heroId")({
  component: HeroProfilePage,
});

function HeroProfilePage() {
  const { heroId } = Route.useParams();
  return <HeroProfile heroId={heroId} />;
}
