import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/me.app";

export const useMeInfo = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });
};
