import axiosInstance from "@/lib/axios";

/**
 *  Data Access Object
 *  Responsible for fetching and updating data from the backend
 */

const END_POINT = "/api/auth/token/verify";

export const verifyAuthApi = async (token: string | null): Promise<void> => {
  return await axiosInstance.post(END_POINT, { token });
};
