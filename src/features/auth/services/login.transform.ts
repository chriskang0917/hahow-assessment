import type { AuthToken } from "@/types/auth.type";
import type { LoginResponse } from "./login.dto";

export const dtoToLoginToken = (payload: LoginResponse): AuthToken => {
  return {
    accessToken: payload.access,
    refreshToken: payload.refresh,
  };
};
