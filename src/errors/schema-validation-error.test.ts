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
