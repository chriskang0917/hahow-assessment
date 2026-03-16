import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { SchemaValidationError } from "@/errors/schema-validation-error";
import { responseWithSchema } from "./response-with-schema";

const defaultConfig: InternalAxiosRequestConfig = {
  headers: {} as InternalAxiosRequestConfig["headers"],
  baseURL: "https://api.example.com",
  url: "/heroes",
  method: "get",
};

const createMockResponse = (
  overrides: {
    data?: unknown;
    status?: number;
    statusText?: string;
    headers?: AxiosResponse["headers"];
    config?: Partial<InternalAxiosRequestConfig>;
  } = {},
): AxiosResponse => ({
  data: overrides.data ?? {},
  status: overrides.status ?? 200,
  statusText: overrides.statusText ?? "OK",
  headers: overrides.headers ?? {},
  config: { ...defaultConfig, ...overrides.config },
});

const heroSchema = z.object({
  id: z.string(),
  name: z.string(),
});

describe("responseWithSchema", () => {
  it("should return parsed data when validation succeeds", () => {
    const response = createMockResponse({
      data: { id: "1", name: "Deku" },
    });

    const result = responseWithSchema(response, heroSchema);

    expect(result).toEqual({ id: "1", name: "Deku" });
  });

  it("should throw SchemaValidationError when validation fails", () => {
    const response = createMockResponse({
      data: { id: 123, name: "Deku" },
    });

    expect(() => responseWithSchema(response, heroSchema)).toThrow(SchemaValidationError);
  });

  it("should include endpoint, method, status in the error", () => {
    const response = createMockResponse({
      data: { invalid: true },
      status: 200,
      config: {
        baseURL: "https://api.example.com",
        url: "/heroes",
        method: "get",
      },
    });

    try {
      responseWithSchema(response, heroSchema);
      expect.unreachable("Should have thrown");
    } catch (e) {
      const error = e as SchemaValidationError;
      expect(error.endpoint).toBe("https://api.example.com/heroes");
      expect(error.method).toBe("get");
      expect(error.status).toBe(200);
      expect(error.responseBody).toEqual({ invalid: true });
      expect(error.zodError).toBeInstanceOf(z.ZodError);
    }
  });

  it("should include requestBody in the error for mutations", () => {
    const response = createMockResponse({
      data: { bad: "response" },
      config: {
        method: "patch",
        data: { str: 10, int: 5 },
      },
    });

    try {
      responseWithSchema(response, heroSchema);
      expect.unreachable("Should have thrown");
    } catch (e) {
      const error = e as SchemaValidationError;
      expect(error.requestBody).toEqual({ str: 10, int: 5 });
    }
  });

  it("should handle missing baseURL gracefully", () => {
    const response = createMockResponse({
      data: { bad: true },
      config: {
        baseURL: undefined,
        url: "/heroes",
        method: "get",
      },
    });

    try {
      responseWithSchema(response, heroSchema);
      expect.unreachable("Should have thrown");
    } catch (e) {
      const error = e as SchemaValidationError;
      expect(error.endpoint).toBe("/heroes");
    }
  });

  it("should console.error with flattened zod error", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {
      // mock implementation
    });
    const response = createMockResponse({
      data: { invalid: true },
    });

    try {
      responseWithSchema(response, heroSchema);
    } catch {
      // expected
    }

    expect(consoleSpy).toHaveBeenCalledOnce();
    consoleSpy.mockRestore();
  });
});
