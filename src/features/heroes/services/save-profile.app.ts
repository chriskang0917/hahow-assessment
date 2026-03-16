import type { HeroProfile } from "@/types/hero.type";
import { patchHeroProfileApi } from "./save-profile.api";

export const saveHeroProfile = async (heroId: string, profile: HeroProfile): Promise<void> => {
  await patchHeroProfileApi(heroId, profile);
};
