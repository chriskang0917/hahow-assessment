import { createRootRouteWithContext, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useMeInfo } from "@/features/auth/hooks/useMeInfo";
import { type Auth, useAuthStore } from "@/features/auth/store/useAuthStore";

type RouterContext = {
  auth: Auth;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const isLogin = useAuthStore.use.isLogin();
  const setMe = useAuthStore.use.setMe();
  const { data: me, isSuccess } = useMeInfo();

  const router = useRouter();

  useEffect(() => {
    if (!isLogin || !isSuccess || !me) return;
    setMe(me);
    router.invalidate();
  }, [me, isSuccess, isLogin, router, setMe]);

  return <Outlet />;
}
