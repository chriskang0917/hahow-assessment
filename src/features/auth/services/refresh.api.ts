import axiosInstance from "@/lib/axios";
import type { RefreshTokenResponse } from "./refresh.dto";

const END_POINT = "/api/auth/token/refresh";

export const refreshTokenApi = async (refreshToken: string) => {
  return await axiosInstance.post<RefreshTokenResponse>(END_POINT, {
    refresh: refreshToken,
  });
};
