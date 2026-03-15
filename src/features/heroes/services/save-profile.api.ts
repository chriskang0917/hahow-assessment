import axiosInstance from "@/lib/axios";
import type { HeroProfile } from "@/types/hero.type";

export const patchHeroProfileApi = async (
  heroId: string,
  profile: HeroProfile,
): Promise<void> => {
  await axiosInstance.patch(`/heroes/${heroId}/profile`, profile);
};
