import axios, { type AxiosResponse } from "axios";
import { camelToSnake, snakeToCamel } from "@/utils/case-transform";

const baseURL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  timeout: 15_000,
});

axiosInstance.interceptors.request.use((config) => {
  if (config.data) {
    config.data = camelToSnake(config.data);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    response.data = snakeToCamel(response.data);
    return response;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
