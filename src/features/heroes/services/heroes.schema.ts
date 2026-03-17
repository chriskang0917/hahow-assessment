import { z } from "zod";

export const heroSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().url(),
});
