import type { ZodType } from "zod";

/**
 * Validate an API response against a Zod schema using safeParse.
 * Returns the parsed data on success, or throws on failure.
 */
export function responseWithSchema<T>(response: unknown, schema: ZodType<T>): T {
  const result = schema.safeParse(response);

  if (!result.success) {
    console.error("[responseWithSchema] Validation failed:", result.error.flatten());
    throw result.error;
  }

  return result.data;
}
