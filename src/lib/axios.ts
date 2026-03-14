import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { refreshTokenManager } from "@/features/auth/utils/refresh-token-manager";
import { tokenManager } from "@/features/auth/utils/token-manager";
import { camelToSnake, snakeToCamel } from "@/utils/case-transform";
import { logger } from "@/utils/logger";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    /**
     *  Designated for retry mechanism
     *  If the request is retried, the value is set to true
     */
    _retry?: boolean;
  }

  export interface AxiosResponse {
    ok: boolean;
  }
}

const baseURL = import.meta.env.VITE_BASE_URL;
const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.request.use(
  (config) => enhancedRequestSuccess(config),
  (error) => enhancedRequestError(error),
);

axiosInstance.interceptors.response.use(
  (response) => enhancedSuccessResponse(response, true),
  (error) => enhancedErrorResponse(error, false),
);

const enhancedRequestSuccess = (config: InternalAxiosRequestConfig) => {
  const transferredData = camelToSnake(config.data);
  return { ...config, data: transferredData };
};

const enhancedRequestError = (error: AxiosError) => {
  logger.error("Request error:", error);
  return Promise.reject(error);
};

const enhancedSuccessResponse = (response: AxiosResponse, ok: boolean): AxiosResponse => {
  const transferredData = snakeToCamel(response.data);
  return { ...response, ok, data: transferredData };
};

const enhancedErrorResponse = async (error: AxiosError, ok: boolean) => {
  const originalRequest = error.config;
  const authStore = useAuthStore.getState();

  /**
   *  If the request is unauthorized, try to refresh the token
   *  If the refresh token is invalid, logout the user
   */
  if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const refreshToken = tokenManager.refreshToken;
      if (refreshToken) {
        const response = await refreshTokenManager.refresh();
        const { accessToken, refreshToken } = response;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        tokenManager.saveTokens(accessToken, refreshToken);

        return axiosInstance(originalRequest);
      }
    } catch (refreshError) {
      logger.error("Refresh token error:", refreshError);
      authStore.logout();
      return Promise.reject({ ...error, ok });
    }
  }

  /**
   *  If the request is forbidden, logout the user
   */
  if (error.response?.status === 403) {
    authStore.logout();
    return Promise.reject({ ...error.response, ok });
  }

  if (error.response) return Promise.reject({ ...error.response, ok });

  return Promise.reject({ ...error, ok });
};

export default axiosInstance;
