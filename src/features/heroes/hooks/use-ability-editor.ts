import { useMemo, useRef, useState } from "react";
import type { AbilityType, HeroProfile } from "@/types/hero.type";

export const useAbilityEditor = (initialProfile: HeroProfile | undefined) => {
  const [abilities, setAbilities] = useState<HeroProfile | undefined>(initialProfile);
  const prevProfileRef = useRef(initialProfile);

  if (initialProfile !== prevProfileRef.current) {
    prevProfileRef.current = initialProfile;
    setAbilities(initialProfile);
  }

  const totalPoints = useMemo(() => {
    if (!initialProfile) return 0;
    return Object.values(initialProfile).reduce((sum, current) => sum + current, 0);
  }, [initialProfile]);

  const currentTotal = useMemo(() => {
    if (!abilities) return 0;
    return Object.values(abilities).reduce((sum, current) => sum + current, 0);
  }, [abilities]);

  const remaining = totalPoints - currentTotal;

  const isDirty = useMemo(() => {
    if (!abilities || !initialProfile) return false;
    return (Object.keys(abilities) as AbilityType[]).some(
      (key) => abilities[key] !== initialProfile[key],
    );
  }, [abilities, initialProfile]);

  const canSave = remaining === 0 && isDirty;

  const increment = (type: AbilityType) => {
    if (remaining <= 0 || !abilities) return;
    setAbilities((prev) => (prev ? { ...prev, [type]: prev[type] + 1 } : prev));
  };

  const decrement = (type: AbilityType) => {
    if (!abilities || abilities[type] <= 0) return;
    setAbilities((prev) => (prev ? { ...prev, [type]: prev[type] - 1 } : prev));
  };

  return { abilities, remaining, isDirty, canSave, increment, decrement };
};
