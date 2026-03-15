import { useQuery } from "@tanstack/react-query";
import { fetchHeroProfile } from "@/features/heroes/services/hero-profile.app";

export const useHeroProfile = (heroId: string) =>
  useQuery({
    queryKey: ["heroes", heroId, "profile"],
    queryFn: ({ signal }) => fetchHeroProfile(heroId, signal),
    enabled: !!heroId,
  });
