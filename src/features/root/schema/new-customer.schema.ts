import { z } from "zod/v4";

export const taxIdSchema = z
  .string()
  .min(1, "請輸入統編")
  .regex(/^\d{8}$/, "統編必須為8位數字")
  .transform((val) => Number(val));

export const companyNameSchema = z.string().min(1, "請輸入公司名稱");

export const customerTypeSchema = z.enum(["factory", "supplier"], {
  message: "請選擇客戶類型",
});

export const newCustomerSchema = z.object({
  taxId: taxIdSchema,
  companyName: companyNameSchema,
  customerType: customerTypeSchema,
});

export type NewCustomerFormData = z.infer<typeof newCustomerSchema>;
