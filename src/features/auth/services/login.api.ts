import axiosInstance from "@/lib/axios";
import type { LoginPayload, LoginResponse } from "./login.dto";

/**
 *  Data Access Object
 *  Responsible for fetching and updating data from the backend
 */

const END_POINT = "/api/auth/token/obtain";

export const loginApi = async (payload: LoginPayload) => {
  return axiosInstance.post<LoginResponse>(END_POINT, payload);
};
