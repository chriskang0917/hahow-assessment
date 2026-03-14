import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AbilityKey } from "@/types/hero.type";
import { ABILITY_LABELS } from "@/constants/hero.const";

type AbilityRowProps = {
  abilityKey: AbilityKey;
  value: number;
  canIncrement: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
};

export const AbilityRow = ({
  abilityKey,
  value,
  canIncrement,
  onIncrement,
  onDecrement,
}: AbilityRowProps) => (
  <div className="flex items-center gap-3">
    <span className="w-12 font-mono font-semibold">{ABILITY_LABELS[abilityKey]}</span>
    <Button
      variant="outline"
      size="icon"
      onClick={onIncrement}
      disabled={!canIncrement}
      aria-label={`增加 ${ABILITY_LABELS[abilityKey]}`}
    >
      <Plus className="h-4 w-4" />
    </Button>
    <span className="w-8 text-center font-mono text-lg">{value}</span>
    <Button
      variant="outline"
      size="icon"
      onClick={onDecrement}
      disabled={value <= 0}
      aria-label={`減少 ${ABILITY_LABELS[abilityKey]}`}
    >
      <Minus className="h-4 w-4" />
    </Button>
  </div>
);
