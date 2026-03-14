import { tokenManager } from "@/features/auth/utils/token-manager";
import { create, createSelectors, resetAllStores } from "@/lib/store";
import type { Role, User } from "@/types/auth.type";

export interface Auth extends Omit<User, "role"> {
  isLogin: boolean;
  role: Role | null;
}

interface AuthStoreActions {
  initialize: () => void;
  setMe: (me: User) => void;
  login: () => void;
  logout: () => void;
}

const initialState: Auth = {
  id: "",
  email: "",
  role: null,
  isLogin: false,
};

const useAuthStoreBase = create<Auth & AuthStoreActions>((set, get) => ({
  ...initialState,

  initialize: () => {
    if (!tokenManager.hasRefreshToken || tokenManager.isRefreshTokenExpired) {
      get().logout();
      return;
    }

    set({ isLogin: true });
  },

  setMe: (me: User) => set({ ...me }),

  login: () => set({ isLogin: true }),

  logout: () => {
    tokenManager.deleteTokens();
    resetAllStores();
    set(initialState);
  },
}));

export const useAuthStore = createSelectors(useAuthStoreBase);
