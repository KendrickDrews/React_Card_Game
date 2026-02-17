import { SlotItem, SlotItemRarity, SlotItemTemplate } from '../types/slotItem';

let slotItemCounter = 0;

export const slotItemTemplates: Record<string, SlotItemTemplate> = {
  'iron-fist': {
    id: 'iron-fist',
    name: 'Iron Fist',
    description: '+2 damage on all attacks.',
    rarity: 'common',
    effects: [{ type: 'flat_damage_bonus', value: 2 }],
    spriteId: 'iron-fist',
  },
  'sturdy-shell': {
    id: 'sturdy-shell',
    name: 'Sturdy Shell',
    description: '+2 block whenever gaining block.',
    rarity: 'common',
    effects: [{ type: 'flat_block_bonus', value: 2 }],
    spriteId: 'sturdy-shell',
  },
  'life-gem': {
    id: 'life-gem',
    name: 'Life Gem',
    description: '+5 max HP in battle.',
    rarity: 'common',
    effects: [{ type: 'max_hp_bonus', value: 5 }],
    spriteId: 'life-gem',
  },
  'swift-wing': {
    id: 'swift-wing',
    name: 'Swift Wing',
    description: '+3 initiative.',
    rarity: 'common',
    effects: [{ type: 'initiative_bonus', value: 3 }],
    spriteId: 'swift-wing',
  },
  'mana-prism': {
    id: 'mana-prism',
    name: 'Mana Prism',
    description: 'Cards from this creature cost 1 less.',
    rarity: 'uncommon',
    effects: [{ type: 'card_cost_reduction', value: 1 }],
    spriteId: 'mana-prism',
  },
  'battle-ward': {
    id: 'battle-ward',
    name: 'Battle Ward',
    description: 'Gain 5 block at the start of combat.',
    rarity: 'uncommon',
    effects: [{ type: 'start_of_combat_block', value: 5 }],
    spriteId: 'battle-ward',
  },
  'healing-moss': {
    id: 'healing-moss',
    name: 'Healing Moss',
    description: 'Heal 2 HP at the start of each turn.',
    rarity: 'uncommon',
    effects: [{ type: 'start_of_turn_heal', value: 2 }],
    spriteId: 'healing-moss',
  },
  'scholars-lens': {
    id: 'scholars-lens',
    name: "Scholar's Lens",
    description: 'Draw 1 extra card at the start of each turn.',
    rarity: 'rare',
    effects: [{ type: 'start_of_turn_draw', value: 1 }],
    spriteId: 'scholars-lens',
  },
  'wellspring-ring': {
    id: 'wellspring-ring',
    name: 'Wellspring Ring',
    description: 'Gain 1 mana at the start of each turn.',
    rarity: 'rare',
    effects: [{ type: 'start_of_turn_mana', value: 1 }],
    spriteId: 'wellspring-ring',
  },
  'echo-stone': {
    id: 'echo-stone',
    name: 'Echo Stone',
    description: 'Passive ability triggers twice.',
    rarity: 'rare',
    effects: [{ type: 'passive_triggers_twice', value: 1 }],
    spriteId: 'echo-stone',
  },
};

export function instantiateSlotItem(templateId: string): SlotItem {
  const template = slotItemTemplates[templateId];
  if (!template) throw new Error(`Unknown slot item template: ${templateId}`);
  slotItemCounter++;
  return {
    instanceId: `slot-${templateId}-${slotItemCounter}-${Date.now()}`,
    templateId: template.id,
    name: template.name,
    description: template.description,
    rarity: template.rarity,
    effects: [...template.effects],
    spriteId: template.spriteId,
  };
}

export function getRandomSlotItems(count: number, rarityFilter?: SlotItemRarity[]): SlotItem[] {
  const pool = Object.values(slotItemTemplates).filter(
    t => !rarityFilter || rarityFilter.includes(t.rarity)
  );
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(t => instantiateSlotItem(t.id));
}
