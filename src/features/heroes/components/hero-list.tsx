import { useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useHeroes } from "@/features/heroes/hooks/use-heroes";
import { HeroCard } from "./hero-card";
import { HeroCardSkeleton } from "./hero-card-skeleton";

export const HeroList = () => {
  const { heroId } = useParams({ strict: false });
  const { data: heroes, isLoading, isError, refetch } = useHeroes();

  if (isLoading) {
    return (
      <section className="flex flex-wrap justify-center gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <HeroCardSkeleton key={i} />
        ))}
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex flex-col items-center gap-4 py-8">
        <p className="text-destructive">無法載入英雄列表</p>
        <Button variant="outline" onClick={() => refetch()}>
          重試
        </Button>
      </section>
    );
  }

  if (!heroes || heroes.length === 0) {
    return <section className="py-8 text-center text-muted-foreground">目前沒有英雄資料</section>;
  }

  return (
    <section className="flex flex-wrap justify-center gap-4">
      {heroes.map((hero) => (
        <HeroCard key={hero.id} hero={hero} isSelected={hero.id === heroId} />
      ))}
    </section>
  );
};
