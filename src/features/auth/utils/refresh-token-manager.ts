import { fetchRefreshToken } from "../services/refresh.app";
import { TokenManager } from "./token-manager";

export type TokenManagerType = typeof TokenManager;

class RefreshTokenManager {
  private refreshPromise: Promise<{ accessToken: string; refreshToken: string }> | null = null;
  private readonly tokenManager: InstanceType<TokenManagerType>;

  constructor(TokenManager: TokenManagerType) {
    this.tokenManager = new TokenManager();
  }

  async refresh(): Promise<{ accessToken: string; refreshToken: string }> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = this.performRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.tokenManager.refreshToken;

    if (!refreshToken) throw new Error("No refresh token available");

    const response = await fetchRefreshToken(refreshToken);

    if (!response.ok) {
      throw new Error("Refresh token failed");
    }

    const { access: newAccessToken, refresh: newRefreshToken } = response.data;

    this.tokenManager.saveTokens(newAccessToken, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}

export const refreshTokenManager = new RefreshTokenManager(TokenManager);
