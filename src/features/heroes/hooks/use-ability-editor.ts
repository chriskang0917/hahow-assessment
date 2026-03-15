import { useEffect, useMemo, useState } from "react";
import type { AbilityKey, HeroProfile } from "@/types/hero.type";

export const useAbilityEditor = (initialProfile: HeroProfile | undefined) => {
  const [abilities, setAbilities] = useState<HeroProfile | undefined>(initialProfile);
  const serializedProfile = JSON.stringify(initialProfile);

  const totalPoints = useMemo(() => {
    if (!initialProfile) return 0;
    return Object.values(initialProfile).reduce((sum, v) => sum + v, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedProfile]);

  const currentTotal = useMemo(() => {
    if (!abilities) return 0;
    return Object.values(abilities).reduce((sum, v) => sum + v, 0);
  }, [abilities]);

  const remaining = totalPoints - currentTotal;

  const isDirty = useMemo(() => {
    if (!abilities || !initialProfile) return false;
    return (Object.keys(abilities) as AbilityKey[]).some(
      (key) => abilities[key] !== initialProfile[key],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abilities, serializedProfile]);

  const canSave = remaining === 0 && isDirty;

  const increment = (key: AbilityKey) => {
    if (remaining <= 0 || !abilities) return;
    setAbilities((prev) => (prev ? { ...prev, [key]: prev[key] + 1 } : prev));
  };

  const decrement = (key: AbilityKey) => {
    if (!abilities || abilities[key] <= 0) return;
    setAbilities((prev) => (prev ? { ...prev, [key]: prev[key] - 1 } : prev));
  };

  useEffect(() => {
    setAbilities(initialProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedProfile]);

  return { abilities, remaining, isDirty, canSave, increment, decrement };
};
