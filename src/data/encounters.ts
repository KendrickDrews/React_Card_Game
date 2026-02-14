import { EnemyCreature } from '../types/creature';

export interface EncounterDefinition {
  id: string;
  name: string;
  enemies: EnemyCreature[];
}

export const grasslandsEncounter: EnemyCreature[] = [
  {
    id: 'enemy-goblin-1',
    speciesId: 'goblin',
    name: 'Goblin Scout',
    side: 'enemy',
    maxHp: 12,
    currentHp: 12,
    block: 0,
    initiative: 5,
    passive: null,
    buffs: [],
    debuffs: [],
    isAlive: true,
    spriteId: 'goblin-scout',
    patternIndex: 0,
    pattern: [
      {
        action: {
          id: 'goblin-stab',
          name: 'Stab',
          description: 'Deals 3 damage.',
          targetType: 'single_enemy',
          effect: { damage: 3 },
        },
        intentIcon: 'attack',
      },
      {
        action: {
          id: 'goblin-brace',
          name: 'Brace',
          description: 'Gains 4 block.',
          targetType: 'self',
          effect: { addBlock: 4 },
        },
        intentIcon: 'defend',
      },
    ],
  },
  {
    id: 'enemy-slime-1',
    speciesId: 'slime',
    name: 'Green Slime',
    side: 'enemy',
    maxHp: 8,
    currentHp: 8,
    block: 0,
    initiative: 3,
    passive: null,
    buffs: [],
    debuffs: [],
    isAlive: true,
    spriteId: 'green-slime',
    patternIndex: 0,
    pattern: [
      {
        action: {
          id: 'slime-tackle',
          name: 'Tackle',
          description: 'Deals 2 damage.',
          targetType: 'single_enemy',
          effect: { damage: 2 },
        },
        intentIcon: 'attack',
      },
      {
        action: {
          id: 'slime-tackle',
          name: 'Tackle',
          description: 'Deals 2 damage.',
          targetType: 'single_enemy',
          effect: { damage: 2 },
        },
        intentIcon: 'attack',
      },
      {
        action: {
          id: 'slime-rest',
          name: 'Rest',
          description: 'Heals 2 HP.',
          targetType: 'self',
          effect: { heal: 2 },
        },
        intentIcon: 'buff',
      },
    ],
  },
];

// Encounter pools by difficulty tier
export const fightEncounters: EncounterDefinition[] = [
  { id: 'grasslands-1', name: 'Goblin Ambush', enemies: grasslandsEncounter },
];

export const eliteEncounters: EncounterDefinition[] = [
  { id: 'elite-grasslands-1', name: 'Goblin Warband', enemies: grasslandsEncounter },
];

export const bossEncounters: EncounterDefinition[] = [
  { id: 'boss-forest-king', name: 'Forest King', enemies: grasslandsEncounter },
];

function deepCopyEnemies(enemies: EnemyCreature[]): EnemyCreature[] {
  return enemies.map(e => ({
    ...e,
    id: `${e.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    buffs: [...e.buffs],
    debuffs: [...e.debuffs],
    pattern: e.pattern.map(p => ({ ...p, action: { ...p.action, effect: { ...p.action.effect } } })),
  }));
}

export function getEncounterForNode(
  nodeType: 'fight' | 'elite' | 'boss',
  encounterId?: string
): EnemyCreature[] {
  const pool = nodeType === 'fight' ? fightEncounters
             : nodeType === 'elite' ? eliteEncounters
             : bossEncounters;

  if (encounterId) {
    const found = pool.find(e => e.id === encounterId);
    if (found) return deepCopyEnemies(found.enemies);
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return deepCopyEnemies(chosen.enemies);
}
