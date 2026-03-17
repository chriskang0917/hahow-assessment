import { z } from "zod";

export const heroProfileSchema = z.object({
  str: z.number().int().min(0),
  int: z.number().int().min(0),
  agi: z.number().int().min(0),
  luk: z.number().int().min(0),
});
