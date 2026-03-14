import type { ZodSchema } from "zod";

/**
 * Validate an API response against a Zod schema using safeParse.
 * Returns the parsed data on success, or throws on failure.
 */
export function responseWithSchema<T extends ZodSchema>(
  response: unknown,
  schema: T,
): T["_output"] {
  const result = schema.safeParse(response);

  if (!result.success) {
    console.error("[responseWithSchema] Validation failed:", result.error.flatten());
    throw result.error;
  }

  return result.data;
}
