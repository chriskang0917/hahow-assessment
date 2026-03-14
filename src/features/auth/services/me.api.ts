import axiosInstance from "@/lib/axios";

const END_POINT = "/api/user/me";

export const meApi = async () => {
  return await axiosInstance.get(END_POINT);
};
