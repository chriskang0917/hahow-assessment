import type { Role } from "@/types/auth.type";

export interface MeResponse {
  id: number;
  name: string;
  email: string;
  role: Role;
}
