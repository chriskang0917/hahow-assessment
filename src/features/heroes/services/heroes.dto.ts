import type { z } from "zod";
import type { heroSchema } from "./heroes.schema";

export type HeroDto = z.infer<typeof heroSchema>;
