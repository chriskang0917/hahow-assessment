import { useQuery } from "@tanstack/react-query";
import { fetchHeroes } from "@/features/heroes/services/heroes.app";

export const useHeroes = () =>
  useQuery({
    queryKey: ["heroes"],
    queryFn: ({ signal }) => fetchHeroes(signal),
    staleTime: 5 * 60 * 1000,
  });
