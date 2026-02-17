import { PlayerCreature } from '../../types/creature';
import { SlotEffectType } from '../../types/slotItem';

export function getSlotEffectTotal(creature: PlayerCreature, effectType: SlotEffectType): number {
  let total = 0;
  for (const item of creature.equippedSlots) {
    for (const effect of item.effects) {
      if (effect.type === effectType) {
        total += effect.value;
      }
    }
  }
  return total;
}

export function hasSlotEffect(creature: PlayerCreature, effectType: SlotEffectType): boolean {
  return getSlotEffectTotal(creature, effectType) > 0;
}
