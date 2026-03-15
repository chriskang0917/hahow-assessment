# Enhance responseWithSchema Error Context — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add structured error context (endpoint, method, status, response/request body) to `responseWithSchema` validation failures via a custom `SchemaValidationError` class.

**Architecture:** Create `SchemaValidationError` in `src/errors/`, refactor `responseWithSchema` to accept full `AxiosResponse` instead of raw data, update all call sites.

**Tech Stack:** TypeScript, Zod, Axios, Vitest

**Spec:** `docs/superpowers/specs/2026-03-15-enhance-response-schema-error-design.md`

---

## File Structure

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/errors/schema-validation-error.ts` | Custom Error class with structured context fields |
| Create | `src/errors/schema-validation-error.test.ts` | Unit tests for error class construction and fields |
| Modify | `src/utils/response-with-schema.ts` | Accept `AxiosResponse`, throw `SchemaValidationError` |
| Create | `src/utils/response-with-schema.test.ts` | Unit tests for success/failure paths with mocked `AxiosResponse` |
| Modify | `src/features/heroes/services/heroes.api.ts` | Pass full response instead of destructured `data` |
| Modify | `src/features/heroes/services/hero-profile.api.ts` | Pass full response instead of destructured `data` |

---

### Task 1: Create SchemaValidationError class with tests

**Files:**
- Create: `src/errors/schema-validation-error.ts`
- Create: `src/errors/schema-validation-error.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/errors/schema-validation-error.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { SchemaValidationError } from "./schema-validation-error";

describe("SchemaValidationError", () => {
  const makeZodError = () => {
    const schema = z.object({ id: z.number() });
    const result = schema.safeParse({ id: "not-a-number" });
    if (result.success) throw new Error("Expected failure");
    return result.error;
  };

  it("should set all context fields as readonly properties", () => {
    const zodError = makeZodError();
    const error = new SchemaValidationError({
      endpoint: "https://api.example.com/heroes",
      method: "get",
      status: 200,
      responseBody: { id: "not-a-number" },
      requestBody: undefined,
      zodError,
    });

    expect(error.endpoint).toBe("https://api.example.com/heroes");
    expect(error.method).toBe("get");
    expect(error.status).toBe(200);
    expect(error.responseBody).toEqual({ id: "not-a-number" });
    expect(error.requestBody).toBeUndefined();
    expect(error.zodError).toBe(zodError);
  });

  it("should format message with uppercase method, endpoint, and status", () => {
    const zodError = makeZodError();
    const error = new SchemaValidationError({
      endpoint: "https://api.example.com/heroes",
      method: "get",
      status: 200,
      responseBody: {},
      requestBody: undefined,
      zodError,
    });

    expect(error.message).toBe(
      "[GET https://api.example.com/heroes] Schema validation failed (HTTP 200)",
    );
  });

  it("should have name 'SchemaValidationError'", () => {
    const zodError = makeZodError();
    const error = new SchemaValidationError({
      endpoint: "/heroes",
      method: "patch",
      status: 200,
      responseBody: {},
      requestBody: { str: 1 },
      zodError,
    });

    expect(error.name).toBe("SchemaValidationError");
  });

  it("should be an instance of Error", () => {
    const zodError = makeZodError();
    const error = new SchemaValidationError({
      endpoint: "/heroes",
      method: "get",
      status: 200,
      responseBody: {},
      requestBody: undefined,
      zodError,
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(SchemaValidationError);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/errors/schema-validation-error.test.ts`
Expected: FAIL — cannot find module `./schema-validation-error`

- [ ] **Step 3: Write minimal implementation**

Create `src/errors/schema-validation-error.ts`:

```ts
import type { ZodError } from "zod";

export class SchemaValidationError extends Error {
  readonly endpoint: string;
  readonly method: string;
  readonly status: number;
  readonly responseBody: unknown;
  readonly requestBody: unknown;
  readonly zodError: ZodError;

  constructor(params: {
    endpoint: string;
    method: string;
    status: number;
    responseBody: unknown;
    requestBody: unknown;
    zodError: ZodError;
  }) {
    super(
      `[${params.method.toUpperCase()} ${params.endpoint}] Schema validation failed (HTTP ${params.status})`,
    );
    this.name = "SchemaValidationError";
    this.endpoint = params.endpoint;
    this.method = params.method;
    this.status = params.status;
    this.responseBody = params.responseBody;
    this.requestBody = params.requestBody;
    this.zodError = params.zodError;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/errors/schema-validation-error.test.ts`
Expected: 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/errors/schema-validation-error.ts src/errors/schema-validation-error.test.ts
git commit -m "feat: add SchemaValidationError class with structured context fields"
```

---

### Task 2: Refactor responseWithSchema with tests

**Files:**
- Modify: `src/utils/response-with-schema.ts`
- Create: `src/utils/response-with-schema.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/utils/response-with-schema.test.ts`:

```ts
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { SchemaValidationError } from "@/errors/schema-validation-error";
import { responseWithSchema } from "./response-with-schema";

const createMockResponse = (
  overrides: Partial<AxiosResponse> & {
    config?: Partial<InternalAxiosRequestConfig>;
  } = {},
): AxiosResponse => ({
  data: overrides.data ?? {},
  status: overrides.status ?? 200,
  statusText: overrides.statusText ?? "OK",
  headers: overrides.headers ?? {},
  config: {
    headers: {},
    baseURL: "https://api.example.com",
    url: "/heroes",
    method: "get",
    ...overrides.config,
  } as InternalAxiosRequestConfig,
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

    expect(() => responseWithSchema(response, heroSchema)).toThrow(
      SchemaValidationError,
    );
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
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/utils/response-with-schema.test.ts`
Expected: FAIL — current `responseWithSchema` expects `(unknown, ZodSchema)`, not `(AxiosResponse, ZodSchema)`

- [ ] **Step 3: Update implementation**

Replace `src/utils/response-with-schema.ts` with:

```ts
import type { AxiosResponse } from "axios";
import type { ZodSchema } from "zod";
import { SchemaValidationError } from "@/errors/schema-validation-error";

/**
 * Validate an API response against a Zod schema using safeParse.
 * Returns the parsed data on success, or throws SchemaValidationError on failure.
 */
export function responseWithSchema<T extends ZodSchema>(
  response: AxiosResponse,
  schema: T,
): T["_output"] {
  const result = schema.safeParse(response.data);

  if (!result.success) {
    const error = new SchemaValidationError({
      endpoint: [response.config.baseURL, response.config.url]
        .filter(Boolean)
        .join(""),
      method: response.config.method ?? "unknown",
      status: response.status,
      responseBody: response.data,
      requestBody: response.config.data,
      zodError: result.error,
    });
    console.error(error.message, result.error.flatten());
    throw error;
  }

  return result.data;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/utils/response-with-schema.test.ts`
Expected: 6 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/response-with-schema.ts src/utils/response-with-schema.test.ts
git commit -m "refactor: responseWithSchema accepts AxiosResponse, throws SchemaValidationError"
```

---

### Task 3: Update call sites

**Files:**
- Modify: `src/features/heroes/services/heroes.api.ts`
- Modify: `src/features/heroes/services/hero-profile.api.ts`

- [ ] **Step 1: Update heroes.api.ts**

In `src/features/heroes/services/heroes.api.ts`, change:

```ts
// before
const { data } = await axiosInstance.get("/heroes", { signal });
return responseWithSchema(data, heroSchema.array());

// after
const response = await axiosInstance.get("/heroes", { signal });
return responseWithSchema(response, heroSchema.array());
```

- [ ] **Step 2: Update hero-profile.api.ts**

In `src/features/heroes/services/hero-profile.api.ts`, change:

```ts
// before
const { data } = await axiosInstance.get(`/heroes/${heroId}/profile`, { signal });
return responseWithSchema(data, heroProfileSchema);

// after
const response = await axiosInstance.get(`/heroes/${heroId}/profile`, { signal });
return responseWithSchema(response, heroProfileSchema);
```

- [ ] **Step 3: Run TypeScript check**

Run: `make ts-check`
Expected: No type errors

- [ ] **Step 4: Run all tests**

Run: `pnpm vitest run`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/heroes/services/heroes.api.ts src/features/heroes/services/hero-profile.api.ts
git commit -m "refactor: update API call sites to pass full AxiosResponse to responseWithSchema"
```
