import type { User } from "@/types/auth.type";
import { meApi } from "./me.api";

export const getMe = async (): Promise<User> => {
  const response = await meApi();
  return response.data;
};
