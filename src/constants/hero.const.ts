import type { AbilityType } from "@/types/hero.type";

export const ABILITY_TYPES: AbilityType[] = ["str", "int", "agi", "luk"];

export const ABILITY_LABELS: Record<AbilityType, string> = {
  str: "STR",
  int: "INT",
  agi: "AGI",
  luk: "LUK",
};
