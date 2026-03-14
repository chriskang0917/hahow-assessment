import { type HttpRequestHandler } from "msw";

function createProxyHandler(method: HttpRequestHandler, path: string, handler: () => void) {
  return method(`*/proxy${path}`, handler);
}

export { createProxyHandler };
