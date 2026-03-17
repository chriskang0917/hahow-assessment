import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { HeroProfile } from "@/features/heroes/components/hero-profile";

const heroIdSchema = z.object({
  heroId: z.string().transform(Number).pipe(z.number().int().positive()),
});

export const Route = createFileRoute("/heroes/$heroId")({
  params: {
    parse: (params) => {
      const { heroId } = heroIdSchema.parse(params);
      return { heroId: String(heroId) };
    },
  },
  component: HeroProfilePage,
  errorComponent: HeroProfileError,
});

function HeroProfileError() {
  return (
    <div className="mt-8 rounded-xl border border-destructive/50 p-6 text-center text-destructive">
      找不到此英雄
    </div>
  );
}

function HeroProfilePage() {
  const { heroId } = Route.useParams();
  return <HeroProfile heroId={heroId} />;
}
