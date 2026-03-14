import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ABILITY_KEYS } from "@/constants/hero.const";
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
  const { data: profile, isLoading, isError } = useHeroProfile(heroId);
  const { abilities, remaining, isDirty, canSave, increment, decrement } =
    useAbilityEditor(profile);
  const { mutate: save, isPending: isSaving } = useSaveProfile(heroId);

  if (isLoading) return <HeroProfileSkeleton />;

  if (isError) {
    return (
      <div className="mt-8 rounded-xl border border-destructive/50 p-6 text-center text-destructive">
        找不到此英雄的能力值資料
      </div>
    );
  }

  if (!abilities) return null;

  const handleSave = () => {
    if (canSave) save(abilities);
  };

  return (
    <section className="mt-8 rounded-xl border p-6">
      <div className="space-y-4">
        {ABILITY_KEYS.map((key) => (
          <AbilityRow
            key={key}
            abilityKey={key}
            value={abilities[key]}
            canIncrement={remaining > 0}
            onIncrement={() => increment(key)}
            onDecrement={() => decrement(key)}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          剩餘點數: <span className="font-mono font-semibold text-foreground">{remaining}</span>
        </p>
        <Button onClick={handleSave} disabled={!canSave || isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          儲存
        </Button>
      </div>
      <UnsavedChangesBlocker isDirty={isDirty} />
    </section>
  );
};
