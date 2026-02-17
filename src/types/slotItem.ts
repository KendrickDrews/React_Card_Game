export type SlotEffectType =
  | 'flat_damage_bonus'
  | 'flat_block_bonus'
  | 'flat_heal_bonus'
  | 'initiative_bonus'
  | 'max_hp_bonus'
  | 'start_of_combat_block'
  | 'start_of_turn_heal'
  | 'start_of_turn_draw'
  | 'start_of_turn_mana'
  | 'passive_triggers_twice'
  | 'card_cost_reduction';

export interface SlotEffect {
  type: SlotEffectType;
  value: number;
}

export type SlotItemRarity = 'common' | 'uncommon' | 'rare';

export interface SlotItemTemplate {
  id: string;
  name: string;
  description: string;
  rarity: SlotItemRarity;
  effects: SlotEffect[];
  spriteId: string;
}

export interface SlotItem {
  instanceId: string;
  templateId: string;
  name: string;
  description: string;
  rarity: SlotItemRarity;
  effects: SlotEffect[];
  spriteId: string;
}
