import type { HttpHandler } from "msw";
import { setupWorker } from "msw/browser";
import { handlers } from "../features/auth/mocks/auth-handlers";
import mockConfig from "./mock-config";

const getAllowedUrls = (config: Record<string, unknown>): string[] => {
  const urls: string[] = [];

  const extractUrls = (obj: Record<string, unknown>) => {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        const url = `${import.meta.env.VITE_PROXY_BASE_URL}${obj[key]}`;
        urls.push(url);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        extractUrls(obj[key] as Record<string, unknown>);
      }
    }
  };

  extractUrls(config);
  return urls;
};

const filterHandlers = (handlers: HttpHandler[], allowedUrls: string[]) => {
  return handlers.filter((handler) => {
    const url = handler.info.path.toString();
    return allowedUrls.includes(url);
  });
};

const allowedUrls = getAllowedUrls(mockConfig);

export const worker = setupWorker(...filterHandlers(handlers, allowedUrls));
