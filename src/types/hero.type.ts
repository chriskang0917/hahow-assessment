export interface Hero {
  id: string;
  name: string;
  image: string;
}

export interface HeroProfile {
  str: number;
  int: number;
  agi: number;
  luk: number;
}

/** Keys of HeroProfile — used for iterating ability rows */
export type AbilityKey = keyof HeroProfile;
