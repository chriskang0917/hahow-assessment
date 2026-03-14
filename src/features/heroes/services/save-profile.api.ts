import axiosInstance from "@/lib/axios";
import { responseWithSchema } from "@/utils/response-with-schema";
import type { HeroProfileDto } from "./hero-profile.dto";
import { heroProfileSchema } from "./hero-profile.schema";

export const patchHeroProfileApi = async (
  heroId: string,
  profile: HeroProfileDto,
): Promise<HeroProfileDto> => {
  const { data } = await axiosInstance.patch(`/heroes/${heroId}/profile`, profile);
  return responseWithSchema(data, heroProfileSchema);
};
