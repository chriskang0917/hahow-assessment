import { useEffect, useLayoutEffect } from "react";
import { verifyAuth } from "@/features/auth/services/verify.app";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { refreshTokenManager } from "@/features/auth/utils/refresh-token-manager";
import { tokenManager } from "@/features/auth/utils/token-manager";

const useAuthVerify = () => {
  const logout = useAuthStore.use.logout();
  const initialize = useAuthStore.use.initialize();

  useLayoutEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    /**
     *  If the refresh token is not present or expired,
     *  the user is not logged in - no need to verify
     */
    if (!tokenManager.hasRefreshToken || tokenManager.isRefreshTokenExpired) return;

    /**
     *  Refresh the access token if
     *  it is expiring soon in 5 minutes
     */
    if (tokenManager.isAccessTokenExpiringSoon()) {
      refreshTokenManager
        .refresh()
        .then(({ accessToken, refreshToken }) => {
          if (!accessToken || !refreshToken) return;
          tokenManager.saveTokens(accessToken, refreshToken);
        })
        .catch(logout);
      return;
    }

    /**
     *  Logout if the refresh token is invalid
     *  which means the user is not logged in for 1 day or more
     */
    verifyAuth(tokenManager.refreshToken).catch(logout);
  }, [logout]);
};

export default useAuthVerify;
