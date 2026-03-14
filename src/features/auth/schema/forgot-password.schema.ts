import { z } from "zod/v4";

export const forgotPasswordSchema = z.object({
  email: z.email("請輸入有效的電子郵件地址"),
});
