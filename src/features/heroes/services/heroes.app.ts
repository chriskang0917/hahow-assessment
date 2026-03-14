import type { Hero } from "@/types/hero.type";
import { fetchHeroesApi } from "./heroes.api";

export const fetchHeroes = async (signal?: AbortSignal): Promise<Hero[]> => {
  const response = await fetchHeroesApi(signal);
  return response;
};
