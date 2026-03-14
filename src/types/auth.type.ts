import type { ROLE_LIST } from "@/constants/global";

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  role: Role;
}

export type Role = (typeof ROLE_LIST)[number];
