import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("請輸入電子郵件地址"),
  password: z.string().min(1, "請輸入密碼"),
});
