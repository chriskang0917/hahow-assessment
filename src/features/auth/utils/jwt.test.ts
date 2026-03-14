import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "@/utils/logger";
import { parseJWT } from "./jwt";

// Mock logger
vi.mock("@/utils/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe("parseJWT", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("parseJWT success", () => {
    it("should parse valid JWT token", () => {
      const payload = { exp: 1234567890 };
      const base64Payload = btoa(JSON.stringify(payload));
      const token = `header.${base64Payload}.signature`;

      const result = parseJWT(token);

      expect(result).toEqual({ exp: 1234567890 });
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should handle JWT token with URL-safe base64 characters", () => {
      const payload = { exp: 9876543210 };
      const base64Payload = btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_");
      const token = `header.${base64Payload}.signature`;

      const result = parseJWT(token);

      expect(result).toEqual({ exp: 9876543210 });
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should parse JWT payload with additional fields", () => {
      const payload = {
        exp: 1234567890,
        iat: 1234567800,
        sub: "user123",
        role: "factory",
      };
      const base64Payload = btoa(JSON.stringify(payload));
      const token = `header.${base64Payload}.signature`;

      const result = parseJWT(token);

      expect(result).toEqual(payload);
      expect(logger.error).not.toHaveBeenCalled();
    });
  });

  describe("parseJWT error", () => {
    it("should return null when token format is incorrect", () => {
      const invalidToken = "invalid.token";

      const result = parseJWT(invalidToken);

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith("Error parsing JWT:", expect.any(Error));
    });

    it("should return null when token is an empty string", () => {
      const result = parseJWT("");

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith("Error parsing JWT:", expect.any(Error));
    });

    it("should return null when token has only one part", () => {
      const result = parseJWT("onlyonepart");

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith("Error parsing JWT:", expect.any(Error));
    });

    it("should return null when payload is not a valid base64", () => {
      const invalidBase64Token = "header.invalid@base64!.signature";

      const result = parseJWT(invalidBase64Token);

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith("Error parsing JWT:", expect.any(Error));
    });

    it("should return null when payload is not a valid JSON", () => {
      const invalidJsonPayload = btoa("invalid json content");
      const token = `header.${invalidJsonPayload}.signature`;

      const result = parseJWT(token);

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith("Error parsing JWT:", expect.any(Error));
    });
  });

  describe("parseJWT edge cases", () => {
    it("should handle exp as 0", () => {
      const payload = { exp: 0 };
      const base64Payload = btoa(JSON.stringify(payload));
      const token = `header.${base64Payload}.signature`;

      const result = parseJWT(token);

      expect(result).toEqual({ exp: 0 });
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should handle long JWT token", () => {
      const payload = {
        exp: 1234567890,
        longField: "a".repeat(1000),
      };
      const base64Payload = btoa(JSON.stringify(payload));
      const token = `header.${base64Payload}.signature`;

      const result = parseJWT(token);

      expect(result).toEqual(payload);
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should handle string with multiple dots", () => {
      const result = parseJWT("part1.part2.part3.part4.part5");

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith("Error parsing JWT:", expect.any(Error));
    });
  });

  describe("type checking", () => {
    it("should return an object with the correct type", () => {
      const payload = { exp: 1234567890 };
      const base64Payload = btoa(JSON.stringify(payload));
      const token = `header.${base64Payload}.signature`;

      const result = parseJWT(token);

      expect(result).toBeDefined();
      expect(typeof result?.exp).toBe("number");
    });

    it("should handle exp as not a number", () => {
      const payload = { exp: "not-a-number" };
      const base64Payload = btoa(JSON.stringify(payload));
      const token = `header.${base64Payload}.signature`;

      const result = parseJWT(token);

      expect(result).toEqual({ exp: "not-a-number" });
      expect(logger.error).not.toHaveBeenCalled();
    });
  });
});
