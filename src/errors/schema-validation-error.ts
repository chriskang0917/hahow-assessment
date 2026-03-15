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
