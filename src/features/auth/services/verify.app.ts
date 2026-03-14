import { verifyAuthApi } from "@/features/auth/services/verify.api";

/**
 *  Application layer
 *  Responsible for transforming data from the interface layer into data required by the backend
 */

export const verifyAuth = async (token: string | null): Promise<void> => {
  await verifyAuthApi(token);
};
