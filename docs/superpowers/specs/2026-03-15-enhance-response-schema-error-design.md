# Enhance responseWithSchema Error Context

## Problem

`responseWithSchema` validates API responses against Zod schemas but only logs `result.error.flatten()` and throws a raw `ZodError`. When validation fails, there is no way to know which endpoint returned bad data or what the actual response was — making debugging difficult across console, error tracking services, and UI error boundaries.

## Decision

Introduce a `SchemaValidationError` custom Error class that captures structured context from the `AxiosResponse`, and refactor `responseWithSchema` to accept the full `AxiosResponse` instead of pre-extracted `data`.

## Error Context Fields

| Field | Source | Purpose |
|---|---|---|
| `endpoint` | `[response.config.baseURL, response.config.url].filter(Boolean).join("")` | Identify which API failed |
| `method` | `response.config.method` | Distinguish GET vs PATCH on same endpoint |
| `status` | `response.status` | Confirm HTTP succeeded but schema didn't |
| `responseBody` | `response.data` | See actual data that failed validation |
| `requestBody` | `response.config.data` | Cross-reference what was sent (mutations) |
| `zodError` | `result.error` | Original Zod validation details |

## Design

### New file: `src/errors/schema-validation-error.ts`

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

### Modified: `src/utils/response-with-schema.ts`

Signature changes from `(response: unknown, schema)` to `(response: AxiosResponse, schema)`. Internally calls `schema.safeParse(response.data)` and throws `SchemaValidationError` with full context on failure.

```ts
import type { AxiosResponse } from "axios";
import type { ZodSchema } from "zod";
import { SchemaValidationError } from "@/errors/schema-validation-error";

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

### Modified call sites

All `.api.ts` files that use `responseWithSchema` change from destructuring `{ data }` to passing the full response:

- `src/features/heroes/services/heroes.api.ts`
- `src/features/heroes/services/hero-profile.api.ts`

```ts
// before
const { data } = await axiosInstance.get("/heroes", { signal });
return responseWithSchema(data, heroSchema.array());

// after
const response = await axiosInstance.get("/heroes", { signal });
return responseWithSchema(response, heroSchema.array());
```

## Impact

- **New file**: `src/errors/schema-validation-error.ts`
- **Modified**: `src/utils/response-with-schema.ts` (signature change — breaking for any caller)
- **Modified**: `src/features/heroes/services/heroes.api.ts`
- **Modified**: `src/features/heroes/services/hero-profile.api.ts`
- **Not modified**: `src/features/heroes/services/save-profile.api.ts` — does not use `responseWithSchema` (returns `void`)
- **Tests**: No existing tests for `responseWithSchema`. New tests must be created for both `SchemaValidationError` (construction, message format, field assignment) and `responseWithSchema` (success path, failure path with mocked `AxiosResponse`)
- **No new dependencies**: uses existing `axios` and `zod` types
