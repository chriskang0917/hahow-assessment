import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { login } from "../services/login.app";
import { useAuthStore } from "../store/useAuthStore";
import { tokenManager } from "../utils/token-manager";

export const useLoginMutation = () => {
  const loginFn = useAuthStore.use.login();
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      loginFn();
      tokenManager.saveTokens(data.accessToken, data.refreshToken);
      router.invalidate();
    },
  });
};
