import axiosInstance from "@/lib/axios";
import { responseWithSchema } from "@/utils/response-with-schema";
import type { HeroProfileDto } from "./hero-profile.dto";
import { heroProfileSchema } from "./hero-profile.schema";

export const fetchHeroProfileApi = async (
  heroId: string,
  signal?: AbortSignal,
): Promise<HeroProfileDto> => {
  const { data } = await axiosInstance.get(`/heroes/${heroId}/profile`, { signal });
  return responseWithSchema(data, heroProfileSchema);
};
