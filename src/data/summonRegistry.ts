import { SummonTemplate } from '../types/summon';

const summonTemplates: Record<string, SummonTemplate> = {
  'stone_wall': {
    id: 'stone_wall',
    name: 'Stone Wall',
    maxHp: 8,
    initiative: 0,
    spriteId: 'stone_wall',
    zone: 'ally',
    action: {
      id: 'stone_wall-noop',
      name: 'Stand Firm',
      description: 'The wall does nothing.',
      targetType: 'self',
      effect: {},
    },
  },
  'battle_familiar': {
    id: 'battle_familiar',
    name: 'Battle Familiar',
    maxHp: 5,
    initiative: 5,
    spriteId: 'battle_familiar',
    zone: 'ally',
    action: {
      id: 'familiar-strike',
      name: 'Familiar Strike',
      description: 'The familiar attacks an enemy for 2 damage.',
      targetType: 'single_enemy',
      effect: { damage: 2 },
    },
  },
  'spike_trap': {
    id: 'spike_trap',
    name: 'Spike Trap',
    maxHp: 3,
    initiative: 1,
    spriteId: 'spike_trap',
    zone: 'enemy',
    action: {
      id: 'spike-pulse',
      name: 'Spike Pulse',
      description: 'The trap damages all enemies for 1.',
      targetType: 'all_enemies',
      effect: { damage: 1 },
    },
  },
  'hive_drone': {
    id: 'hive_drone',
    name: 'Hive Drone',
    maxHp: 4,
    initiative: 4,
    spriteId: 'hive_drone',
    zone: 'enemy',
    action: {
      id: 'drone-sting',
      name: 'Sting',
      description: 'The drone stings an enemy for 2 damage.',
      targetType: 'single_enemy',
      effect: { damage: 2 },
    },
  },
  'spirit_wisp': {
    id: 'spirit_wisp',
    name: 'Spirit Wisp',
    maxHp: 3,
    initiative: 6,
    spriteId: 'spirit_wisp',
    zone: 'ally',
    action: {
      id: 'wisp-zap',
      name: 'Wisp Zap',
      description: 'The wisp zaps an enemy for 2 damage.',
      targetType: 'single_enemy',
      effect: { damage: 2 },
    },
  },
};

export function getSummonTemplate(id: string): SummonTemplate | undefined {
  return summonTemplates[id];
}
