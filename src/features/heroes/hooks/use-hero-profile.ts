import { useQuery } from "@tanstack/react-query";
import { fetchHeroProfileApi } from "@/features/heroes/services/hero-profile.api";

export const useHeroProfile = (heroId: string) =>
  useQuery({
    queryKey: ["heroes", heroId, "profile"],
    queryFn: ({ signal }) => fetchHeroProfileApi(heroId, signal),
    enabled: !!heroId,
  });
