import { QueryClientProvider } from "@tanstack/react-query";
import { createRouteMask, createRouter, RouterProvider } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import queryClient from "@/lib/query-client";
import { routeTree } from "@/routeTree.gen";
import useAuthVerify from "./hooks/useAuthVerify";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const context = {
  auth: undefined!,
};

const factoryHomeMask = createRouteMask({
  routeTree,
  from: "/factory/home",
  to: "/",
});

const supplierHomeMask = createRouteMask({
  routeTree,
  from: "/supplier/home",
  to: "/",
});

const rootHomeMask = createRouteMask({
  routeTree,
  from: "/root/home",
  to: "/",
});

const router = createRouter({
  routeTree,
  context,
  routeMasks: [factoryHomeMask, supplierHomeMask, rootHomeMask],
});

function App() {
  const auth = useAuthStore();

  useAuthVerify();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ auth }} />
    </QueryClientProvider>
  );
}

export default App;
