import { refreshTokenApi } from "./refresh.api";

/**
 *  Application layer
 *  Responsible for transforming data from the interface layer into data required by the backend
 */

export const fetchRefreshToken = async (refreshToken: string) => {
  return await refreshTokenApi(refreshToken);
};
