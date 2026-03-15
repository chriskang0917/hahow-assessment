import axiosInstance from "@/lib/axios";
import { responseWithSchema } from "@/utils/response-with-schema";
import type { HeroDto } from "./heroes.dto";
import { heroSchema } from "./heroes.schema";

export const fetchHeroesApi = async (signal?: AbortSignal): Promise<HeroDto[]> => {
  const response = await axiosInstance.get("/heroes", { signal });
  return responseWithSchema(response, heroSchema.array());
};
