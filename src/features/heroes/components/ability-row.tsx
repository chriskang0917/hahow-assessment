import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ABILITY_LABELS } from "@/constants/hero.const";
import type { AbilityType } from "@/types/hero.type";

type AbilityRowProps = {
  abilityType: AbilityType;
  value: number;
  canIncrement: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
};

export const AbilityRow = ({
  abilityType,
  value,
  canIncrement,
  onIncrement,
  onDecrement,
}: AbilityRowProps) => (
  <div className="flex items-center gap-3">
    <span className="w-12 font-mono font-semibold">{ABILITY_LABELS[abilityType]}</span>
    <Button
      variant="outline"
      size="icon"
      onClick={onIncrement}
      disabled={!canIncrement}
      aria-label={`增加 ${ABILITY_LABELS[abilityType]}`}
    >
      <Plus className="h-4 w-4" />
    </Button>
    <span className="w-8 text-center font-mono text-lg">{value}</span>
    <Button
      variant="outline"
      size="icon"
      onClick={onDecrement}
      disabled={value <= 0}
      aria-label={`減少 ${ABILITY_LABELS[abilityType]}`}
    >
      <Minus className="h-4 w-4" />
    </Button>
  </div>
);
