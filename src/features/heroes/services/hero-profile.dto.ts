import type { z } from "zod";
import type { heroProfileSchema } from "./hero-profile.schema";

export type HeroProfileDto = z.infer<typeof heroProfileSchema>;
