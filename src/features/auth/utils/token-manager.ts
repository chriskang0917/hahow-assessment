import { parseJWT } from "@/features/auth/utils/jwt";
import { logger } from "@/utils/logger";
import { CookieUtils } from "./cookie";

const DEFAULT_EXPIRES_AT = 30 * 24 * 60 * 60 * 1000;
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const EXPIRES_AT_IN_MINUTES = 5;
const MILLISECONDS_PER_SECOND = 1000;
const MINUTES_PER_SECOND = 60;

export class TokenManager {
  private cookieUtils: typeof CookieUtils;

  constructor(cookieUtilsInstance: typeof CookieUtils = CookieUtils) {
    this.cookieUtils = cookieUtilsInstance;
  }

  saveTokens(accessToken: string, refreshToken: string) {
    try {
      const accessTokenPayload = parseJWT(accessToken);
      const refreshTokenPayload = parseJWT(refreshToken);

      const accessTokenExpiresAt = accessTokenPayload?.exp
        ? accessTokenPayload.exp * MILLISECONDS_PER_SECOND
        : DEFAULT_EXPIRES_AT;
      const refreshTokenExpiresAt = refreshTokenPayload?.exp
        ? refreshTokenPayload.exp * MILLISECONDS_PER_SECOND
        : DEFAULT_EXPIRES_AT;

      this.cookieUtils.setCookie(ACCESS_TOKEN_KEY, accessToken, accessTokenExpiresAt);
      this.cookieUtils.setCookie(REFRESH_TOKEN_KEY, refreshToken, refreshTokenExpiresAt);

      logger.log("Tokens saved successfully");

      return {
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      };
    } catch (error) {
      logger.error("Error saving tokens:", error);
      return null;
    }
  }

  get accessToken() {
    return this.cookieUtils.getCookie(ACCESS_TOKEN_KEY);
  }

  get refreshToken() {
    return this.cookieUtils.getCookie(REFRESH_TOKEN_KEY);
  }

  get hasAccessToken() {
    return !!this.accessToken;
  }

  get hasRefreshToken() {
    return !!this.refreshToken;
  }

  get isAccessTokenExpired() {
    return this.isExpired(this.accessTokenExpiresAt);
  }

  get isRefreshTokenExpired() {
    return this.isExpired(this.refreshTokenExpiresAt);
  }

  get accessTokenExpiresAt() {
    const accessTokenPayload = parseJWT(this.accessToken);
    if (!accessTokenPayload?.exp) return null;
    return accessTokenPayload.exp * MILLISECONDS_PER_SECOND;
  }

  get refreshTokenExpiresAt() {
    const refreshTokenPayload = parseJWT(this.refreshToken);
    if (!refreshTokenPayload?.exp) return null;
    return refreshTokenPayload.exp * MILLISECONDS_PER_SECOND;
  }

  private isExpired(expiresAt: number | null) {
    if (!expiresAt) return true;
    return Date.now() > Number(expiresAt);
  }

  isAccessTokenExpiringSoon(minutesBefore: number = EXPIRES_AT_IN_MINUTES) {
    const expiresAt = this.accessTokenExpiresAt;
    if (!expiresAt) return true;

    const timeBeforeExpiration =
      Date.now() + minutesBefore * MILLISECONDS_PER_SECOND * MINUTES_PER_SECOND;
    return timeBeforeExpiration > Number(expiresAt);
  }

  isRefreshTokenExpiringSoon(minutesBefore: number = EXPIRES_AT_IN_MINUTES) {
    const expiresAt = this.refreshTokenExpiresAt;
    if (!expiresAt) return true;

    const timeBeforeExpiration =
      Date.now() + minutesBefore * MILLISECONDS_PER_SECOND * MINUTES_PER_SECOND;
    return timeBeforeExpiration > Number(expiresAt);
  }

  deleteTokens() {
    this.cookieUtils.deleteCookie(ACCESS_TOKEN_KEY);
    this.cookieUtils.deleteCookie(REFRESH_TOKEN_KEY);
  }
}

export const tokenManager = new TokenManager();
