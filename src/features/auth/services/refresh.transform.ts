import type { RefreshTokenResponse } from "./refresh.dto";

export const dtoToRefreshToken = (payload: RefreshTokenResponse) => {
  return {
    accessToken: payload.access,
    refreshToken: payload.refresh,
  };
};
