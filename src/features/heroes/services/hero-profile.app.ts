import type { HeroProfile } from "@/types/hero.type";
import { fetchHeroProfileApi } from "./hero-profile.api";

export const fetchHeroProfile = async (
  heroId: string,
  signal?: AbortSignal,
): Promise<HeroProfile> => {
  const response = await fetchHeroProfileApi(heroId, signal);
  return response;
};
