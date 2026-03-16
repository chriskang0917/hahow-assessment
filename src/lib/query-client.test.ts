import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import queryClient from "./query-client";

function createAxiosError(status: number): AxiosError {
  return new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
    status,
    data: null,
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() },
  });
}

describe("queryClient retry config", () => {
  const retryFn = queryClient.getDefaultOptions().queries?.retry as (
    failureCount: number,
    error: Error,
  ) => boolean;

  it("does not retry on 400 error", () => {
    expect(retryFn(0, createAxiosError(400))).toBe(false);
  });

  it("does not retry on 404 error", () => {
    expect(retryFn(0, createAxiosError(404))).toBe(false);
  });

  it("does not retry on 422 error", () => {
    expect(retryFn(0, createAxiosError(422))).toBe(false);
  });

  it("retries on 500 error when failureCount < 3", () => {
    expect(retryFn(0, createAxiosError(500))).toBe(true);
    expect(retryFn(1, createAxiosError(500))).toBe(true);
    expect(retryFn(2, createAxiosError(500))).toBe(true);
  });

  it("stops retrying on 500 error when failureCount >= 3", () => {
    expect(retryFn(3, createAxiosError(500))).toBe(false);
  });

  it("retries on non-Axios error when failureCount < 3", () => {
    expect(retryFn(0, new Error("Network error"))).toBe(true);
  });
});
