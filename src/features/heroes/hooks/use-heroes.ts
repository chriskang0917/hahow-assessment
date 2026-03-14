import { useQuery } from "@tanstack/react-query";
import { fetchHeroesApi } from "@/features/heroes/services/heroes.api";

export const useHeroes = () =>
  useQuery({
    queryKey: ["heroes"],
    queryFn: ({ signal }) => fetchHeroesApi(signal),
    staleTime: 5 * 60 * 1000,
  });
