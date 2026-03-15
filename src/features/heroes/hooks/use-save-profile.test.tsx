// @vitest-environment happy-dom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { useSaveProfile } from "./use-save-profile";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from "sonner";

const server = setupServer();

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());

describe("useSaveProfile", () => {
  const profile = { str: 5, int: 5, agi: 5, luk: 5 };

  it("shows 404 error message when hero is not found", async () => {
    server.use(
      http.patch("*/heroes/:heroId/profile", () =>
        new HttpResponse(null, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useSaveProfile("999"), { wrapper: createWrapper() });
    result.current.mutate(profile);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith("找不到該英雄，請再選擇其他英雄嘗試");
  });

  it("shows 400 error message when input is invalid", async () => {
    server.use(
      http.patch("*/heroes/:heroId/profile", () =>
        new HttpResponse(null, { status: 400 }),
      ),
    );

    const { result } = renderHook(() => useSaveProfile("1"), { wrapper: createWrapper() });
    result.current.mutate(profile);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith("輸入的值不正確，請確認後再次送出");
  });

  it("shows generic error message for 500 errors", async () => {
    server.use(
      http.patch("*/heroes/:heroId/profile", () =>
        new HttpResponse(null, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useSaveProfile("1"), { wrapper: createWrapper() });
    result.current.mutate(profile);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith("儲存失敗，請重試");
  });

  it("shows success toast on successful save", async () => {
    server.use(
      http.patch("*/heroes/:heroId/profile", () =>
        HttpResponse.json({ str: 5, int: 5, agi: 5, luk: 5 }),
      ),
    );

    const { result } = renderHook(() => useSaveProfile("1"), { wrapper: createWrapper() });
    result.current.mutate(profile);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("能力值更新成功");
  });
});
