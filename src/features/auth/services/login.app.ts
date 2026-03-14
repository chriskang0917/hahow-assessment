import type { AuthToken } from "@/types/auth.type";
import { loginApi } from "./login.api";
import type { LoginPayload } from "./login.dto";
import { dtoToLoginToken } from "./login.transform";

/**
 *  Application layer
 *  Responsible for transforming data from the interface layer into data required by the backend
 */

export const login = async (payload: LoginPayload): Promise<AuthToken> => {
  const response = await loginApi(payload);
  return dtoToLoginToken(response.data);
};
