import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ABILITY_TYPES } from "@/constants/hero.const";
import { useAbilityEditor } from "@/features/heroes/hooks/use-ability-editor";
import { useHeroProfile } from "@/features/heroes/hooks/use-hero-profile";
import { useSaveProfile } from "@/features/heroes/hooks/use-save-profile";
import { AbilityRow } from "./ability-row";
import { HeroProfileSkeleton } from "./hero-profile-skeleton";
import { UnsavedChangesBlocker } from "./unsaved-changes-blocker";

type HeroProfileProps = {
  heroId: string;
};

export const HeroProfile = ({ heroId }: HeroProfileProps) => {
  const { data: profile, isLoading, isError, error } = useHeroProfile(heroId);
  const { abilities, remaining, isDirty, canSave, increment, decrement } =
    useAbilityEditor(profile);
  const { mutate: save, isPending: isSaving } = useSaveProfile(heroId);

  if (isLoading) return <HeroProfileSkeleton />;

  if (isError) {
    const is404 = error instanceof AxiosError && error.response?.status === 404;
    return (
      <div className="mt-8 rounded-xl border border-destructive/50 p-6 text-center text-destructive">
        {is404 ? "找不到此英雄" : "載入失敗，請重試"}
      </div>
    );
  }

  if (!abilities) return null;

  const handleSave = () => {
    if (canSave) save(abilities);
  };

  return (
    <section className="mt-8 rounded-xl border p-6">
      <div className="flex gap-8 justify-between flex-wrap">
        <div className="space-y-4">
          {ABILITY_TYPES.map((type) => (
            <AbilityRow
              key={type}
              abilityType={type}
              value={abilities[type]}
              canIncrement={remaining > 0}
              onIncrement={() => increment(type)}
              onDecrement={() => decrement(type)}
            />
          ))}
        </div>

        <div className="flex flex-col items-start justify-end space-y-4">
          <p className="text-sm text-muted-foreground">
            剩餘點數: <span className="font-mono font-semibold text-foreground">{remaining}</span>
          </p>
          <Button className="w-30 h-10" onClick={handleSave} disabled={!canSave || isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            儲存
          </Button>
        </div>
      </div>
      <UnsavedChangesBlocker isDirty={isDirty} />
    </section>
  );
};
