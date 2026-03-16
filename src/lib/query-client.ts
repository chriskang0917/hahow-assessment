import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const MAX_RETRY_COUNT = 3;
const RETRYABLE_STATUS_CODES = new Set([408, 429]);

function shouldRetry(failureCount: number, error: Error): boolean {
  if (failureCount >= MAX_RETRY_COUNT) return false;

  if (isAxiosError(error) && error.response) {
    const { status } = error.response;
    // Don't retry 4xx errors, except timeout (408) and rate limit (429)
    if (status >= 400 && status < 500) return RETRYABLE_STATUS_CODES.has(status);
  }

  return true;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      retryDelay: (attemptIndex) => Math.min(3000 * 2 ** attemptIndex, 15000),
    },
  },
});

export default queryClient;
