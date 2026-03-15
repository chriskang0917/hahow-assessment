import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const MAX_RETRY_COUNT = 3;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (isAxiosError(error) && error.response && error.response.status >= 400 && error.response.status < 500) {
          return false;
        }
        return failureCount < MAX_RETRY_COUNT;
      },
      retryDelay: (attemptIndex) => Math.min(3000 * 2 ** attemptIndex, 15000),
    },
  },
});

export default queryClient;
