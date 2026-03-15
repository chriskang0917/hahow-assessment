# PATCH Error Handling Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add HTTP status code-specific error toast messages for the PATCH save-profile mutation, and skip retries for 4xx errors on queries.

**Architecture:** Modify `onError` in `useSaveProfile` to check `AxiosError` status codes and display appropriate toast messages. Modify `query-client.ts` retry config to skip 4xx errors.

**Tech Stack:** React Query, Axios, Sonner (toast), Vitest, MSW, React Testing Library

---

## Chunk 1: Implementation and Tests

### Task 1: Add status-code-specific error messages to useSaveProfile

**Files:**
- Modify: `src/features/heroes/hooks/use-save-profile.ts`
- Test: `src/features/heroes/hooks/use-save-profile.test.tsxx` (create)

- [ ] **Step 1: Write failing tests for PATCH error handling**

Create `src/features/heroes/hooks/use-save-profile.test.tsx`:

```ts
// @vitest-environment happy-dom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { useSaveProfile } from "./use-save-profile";

const baseURL = "https://hahow-recruit.herokuapp.com";

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
      http.patch(`${baseURL}/heroes/:heroId/profile`, () =>
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
      http.patch(`${baseURL}/heroes/:heroId/profile`, () =>
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
      http.patch(`${baseURL}/heroes/:heroId/profile`, () =>
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
      http.patch(`${baseURL}/heroes/:heroId/profile`, () =>
        HttpResponse.json({ str: 5, int: 5, agi: 5, luk: 5 }),
      ),
    );

    const { result } = renderHook(() => useSaveProfile("1"), { wrapper: createWrapper() });
    result.current.mutate(profile);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("能力值更新成功");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/features/heroes/hooks/use-save-profile.test.tsx`
Expected: 404 and 400 tests FAIL (both currently show "儲存失敗，請重試")

- [ ] **Step 3: Implement status-code-specific error handling**

Modify `src/features/heroes/hooks/use-save-profile.ts`:

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import type { HeroProfile } from "@/types/hero.type";
import { saveHeroProfile } from "@/features/heroes/services/save-profile.app";

export const useSaveProfile = (heroId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: HeroProfile) => saveHeroProfile(heroId, profile),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(["heroes", heroId, "profile"], variables);
      toast.success("能力值更新成功");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 404:
            toast.error("找不到該英雄，請再選擇其他英雄嘗試");
            return;
          case 400:
            toast.error("輸入的值不正確，請確認後再次送出");
            return;
        }
      }
      toast.error("儲存失敗，請重試");
    },
  });
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/features/heroes/hooks/use-save-profile.test.tsx`
Expected: All 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/heroes/hooks/use-save-profile.ts src/features/heroes/hooks/use-save-profile.test.tsx
git commit -m "feat: add status-code-specific error messages for PATCH save-profile"
```

### Task 2: Skip retry for 4xx errors on queries

**Files:**
- Modify: `src/lib/query-client.ts`
- Test: `src/lib/query-client.test.ts` (create)

- [ ] **Step 1: Write failing tests for retry logic**

Create `src/lib/query-client.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { AxiosError, AxiosHeaders } from "axios";
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/query-client.test.ts`
Expected: FAIL because `retry` is currently `3` (a number, not a function)

- [ ] **Step 3: Implement 4xx retry skip**

Modify `src/lib/query-client.ts`:

```ts
import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (isAxiosError(error) && error.response && error.response.status >= 400 && error.response.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(3000 * 2 ** attemptIndex, 15000),
    },
  },
});

export default queryClient;
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/query-client.test.ts`
Expected: All 6 tests PASS

- [ ] **Step 5: Run all tests to verify no regressions**

Run: `npx vitest run`
Expected: All tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/query-client.ts src/lib/query-client.test.ts
git commit -m "feat: skip retry for 4xx client errors on queries"
```

### Task 3: Final verification

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests PASS

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: No type errors
