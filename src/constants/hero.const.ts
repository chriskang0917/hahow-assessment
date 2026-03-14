import type { AbilityKey } from "@/types/hero.type";

export const ABILITY_KEYS: AbilityKey[] = ["str", "int", "agi", "luk"];

export const ABILITY_LABELS: Record<AbilityKey, string> = {
  str: "STR",
  int: "INT",
  agi: "AGI",
  luk: "LUK",
};
