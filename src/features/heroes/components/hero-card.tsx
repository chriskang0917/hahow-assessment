import { memo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { Hero } from "@/types/hero.type";

type HeroCardProps = {
  hero: Hero;
  isSelected: boolean;
};

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' fill='%23ccc'%3E%3Crect width='150' height='150'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

export const HeroCard = memo(({ hero, isSelected }: HeroCardProps) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to="/heroes/$heroId"
      params={{ heroId: hero.id }}
      className={cn(
        "flex w-36 flex-col items-center rounded-xl border-2 p-4 transition-colors hover:border-primary/50",
        isSelected
          ? "border-primary bg-primary/10"
          : "border-transparent",
      )}
    >
      <img
        src={imgError ? FALLBACK_IMAGE : hero.image}
        alt={hero.name}
        className="aspect-square w-full rounded-lg object-cover"
        loading="lazy"
        onError={() => setImgError(true)}
      />
      <p className="mt-2 text-center font-medium">{hero.name}</p>
    </Link>
  );
});

HeroCard.displayName = "HeroCard";
