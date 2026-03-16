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
      endpoint: [response.config.baseURL, response.config.url].filter(Boolean).join(""),
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
