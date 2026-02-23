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

/** Returns the three most common combat bonuses for a creature in one call. */
export function getCreatureBonuses(creature: PlayerCreature) {
  return {
    dmg: getSlotEffectTotal(creature, 'flat_damage_bonus'),
    heal: getSlotEffectTotal(creature, 'flat_heal_bonus'),
    block: getSlotEffectTotal(creature, 'flat_block_bonus'),
  };
}
