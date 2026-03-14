import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(3000 * 2 ** attemptIndex, 15000),
    },
  },
});

export default queryClient;
