import { EnemyCreature } from '../types/creature';

export interface EncounterDefinition {
  id: string;
  name: string;
  enemies: EnemyCreature[];
}

// ── Existing enemies ──

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

// ── New enemy templates ──

const fireAnt: EnemyCreature = {
  id: 'enemy-fire-ant',
  speciesId: 'fire-ant',
  name: 'Fire Ant',
  side: 'enemy',
  maxHp: 6,
  currentHp: 6,
  block: 0,
  initiative: 6,
  passive: null,
  buffs: [],
  debuffs: [],
  isAlive: true,
  spriteId: 'fire-ant',
  patternIndex: 0,
  pattern: [
    {
      action: { id: 'ant-bite-1', name: 'Bite', description: 'Deals 4 damage.', targetType: 'single_enemy', effect: { damage: 4 } },
      intentIcon: 'attack',
    },
    {
      action: { id: 'ant-bite-2', name: 'Bite', description: 'Deals 4 damage.', targetType: 'single_enemy', effect: { damage: 4 } },
      intentIcon: 'attack',
    },
    {
      action: { id: 'ant-burrow', name: 'Burrow', description: 'Gains 3 block.', targetType: 'self', effect: { addBlock: 3 } },
      intentIcon: 'defend',
    },
  ],
};

const mushroomSpore: EnemyCreature = {
  id: 'enemy-mushroom-spore',
  speciesId: 'mushroom-spore',
  name: 'Mushroom Spore',
  side: 'enemy',
  maxHp: 10,
  currentHp: 10,
  block: 0,
  initiative: 2,
  passive: null,
  buffs: [],
  debuffs: [],
  isAlive: true,
  spriteId: 'mushroom-spore',
  patternIndex: 0,
  pattern: [
    {
      action: { id: 'spore-cloud-1', name: 'Spore Cloud', description: 'Deals 1 damage to all enemies.', targetType: 'all_enemies', effect: { damage: 1 } },
      intentIcon: 'attack',
    },
    {
      action: { id: 'spore-grow', name: 'Grow', description: 'Heals 3 HP.', targetType: 'self', effect: { heal: 3 } },
      intentIcon: 'buff',
    },
    {
      action: { id: 'spore-cloud-2', name: 'Spore Cloud', description: 'Deals 1 damage to all enemies.', targetType: 'all_enemies', effect: { damage: 1 } },
      intentIcon: 'attack',
    },
  ],
};

const shadowRat: EnemyCreature = {
  id: 'enemy-shadow-rat',
  speciesId: 'shadow-rat',
  name: 'Shadow Rat',
  side: 'enemy',
  maxHp: 5,
  currentHp: 5,
  block: 0,
  initiative: 8,
  passive: null,
  buffs: [],
  debuffs: [],
  isAlive: true,
  spriteId: 'shadow-rat',
  patternIndex: 0,
  pattern: [
    {
      action: { id: 'rat-scratch-1', name: 'Scratch', description: 'Deals 2 damage.', targetType: 'single_enemy', effect: { damage: 2 } },
      intentIcon: 'attack',
    },
    {
      action: { id: 'rat-scratch-2', name: 'Scratch', description: 'Deals 2 damage.', targetType: 'single_enemy', effect: { damage: 2 } },
      intentIcon: 'attack',
    },
    {
      action: { id: 'rat-flee', name: 'Flee', description: 'Gains 5 block.', targetType: 'self', effect: { addBlock: 5 } },
      intentIcon: 'defend',
    },
  ],
};

const thornVine: EnemyCreature = {
  id: 'enemy-thorn-vine',
  speciesId: 'thorn-vine',
  name: 'Thorn Vine',
  side: 'enemy',
  maxHp: 15,
  currentHp: 15,
  block: 0,
  initiative: 1,
  passive: null,
  buffs: [],
  debuffs: [],
  isAlive: true,
  spriteId: 'thorn-vine',
  patternIndex: 0,
  pattern: [
    {
      action: { id: 'vine-whip', name: 'Whip', description: 'Deals 2 damage.', targetType: 'single_enemy', effect: { damage: 2 } },
      intentIcon: 'attack',
    },
    {
      action: { id: 'vine-entangle', name: 'Entangle', description: 'Gains 4 block.', targetType: 'self', effect: { addBlock: 4 } },
      intentIcon: 'defend',
    },
    {
      action: { id: 'vine-burst', name: 'Burst', description: 'Deals 3 damage to all enemies.', targetType: 'all_enemies', effect: { damage: 3 } },
      intentIcon: 'attack',
    },
  ],
};

const stoneGolem: EnemyCreature = {
  id: 'enemy-stone-golem',
  speciesId: 'stone-golem',
  name: 'Stone Golem',
  side: 'enemy',
  maxHp: 30,
  currentHp: 30,
  block: 0,
  initiative: 2,
  passive: null,
  buffs: [],
  debuffs: [],
  isAlive: true,
  spriteId: 'stone-golem',
  patternIndex: 0,
  pattern: [
    {
      action: { id: 'golem-smash-1', name: 'Smash', description: 'Deals 6 damage.', targetType: 'single_enemy', effect: { damage: 6 } },
      intentIcon: 'attack',
    },
    {
      action: { id: 'golem-harden', name: 'Harden', description: 'Gains 8 block.', targetType: 'self', effect: { addBlock: 8 } },
      intentIcon: 'defend',
    },
    {
      action: { id: 'golem-smash-2', name: 'Smash', description: 'Deals 6 damage.', targetType: 'single_enemy', effect: { damage: 6 } },
      intentIcon: 'attack',
    },
    {
      action: { id: 'golem-quake', name: 'Quake', description: 'Deals 4 damage to all enemies.', targetType: 'all_enemies', effect: { damage: 4 } },
      intentIcon: 'attack',
    },
  ],
};

const venomDrake: EnemyCreature = {
  id: 'enemy-venom-drake',
  speciesId: 'venom-drake',
  name: 'Venom Drake',
  side: 'enemy',
  maxHp: 22,
  currentHp: 22,
  block: 0,
  initiative: 7,
  passive: null,
  buffs: [],
  debuffs: [],
  isAlive: true,
  spriteId: 'venom-drake',
  patternIndex: 0,
  pattern: [
    {
      action: { id: 'drake-fang', name: 'Fang', description: 'Deals 5 damage.', targetType: 'single_enemy', effect: { damage: 5 } },
      intentIcon: 'attack',
    },
    {
      action: { id: 'drake-acid', name: 'Acid', description: 'Deals 3 damage to all enemies.', targetType: 'all_enemies', effect: { damage: 3 } },
      intentIcon: 'attack',
    },
    {
      action: { id: 'drake-tail', name: 'Tail Swipe', description: 'Deals 4 damage.', targetType: 'single_enemy', effect: { damage: 4 } },
      intentIcon: 'attack',
    },
  ],
};

const forestKing: EnemyCreature = {
  id: 'enemy-forest-king',
  speciesId: 'forest-king',
  name: 'Forest King',
  side: 'enemy',
  maxHp: 45,
  currentHp: 45,
  block: 0,
  initiative: 5,
  passive: null,
  buffs: [],
  debuffs: [],
  isAlive: true,
  spriteId: 'forest-king',
  patternIndex: 0,
  pattern: [
    {
      action: { id: 'fk-root-slam', name: 'Root Slam', description: 'Deals 7 damage.', targetType: 'single_enemy', effect: { damage: 7 } },
      intentIcon: 'attack',
    },
    {
      action: { id: 'fk-natures-guard', name: "Nature's Guard", description: 'Gains 10 block.', targetType: 'self', effect: { addBlock: 10 } },
      intentIcon: 'defend',
    },
    {
      action: { id: 'fk-vine-storm', name: 'Vine Storm', description: 'Deals 4 damage to all enemies.', targetType: 'all_enemies', effect: { damage: 4 } },
      intentIcon: 'attack',
    },
    {
      action: { id: 'fk-consume', name: 'Consume', description: 'Heals 5 HP.', targetType: 'self', effect: { heal: 5 } },
      intentIcon: 'buff',
    },
  ],
};

const swampHydra: EnemyCreature = {
  id: 'enemy-swamp-hydra',
  speciesId: 'swamp-hydra',
  name: 'Swamp Hydra',
  side: 'enemy',
  maxHp: 50,
  currentHp: 50,
  block: 0,
  initiative: 3,
  passive: null,
  buffs: [],
  debuffs: [],
  isAlive: true,
  spriteId: 'swamp-hydra',
  patternIndex: 0,
  pattern: [
    {
      action: { id: 'hydra-head-strike', name: 'Head Strike', description: 'Deals 8 damage.', targetType: 'single_enemy', effect: { damage: 8 } },
      intentIcon: 'attack',
    },
    {
      action: { id: 'hydra-poison-breath', name: 'Poison Breath', description: 'Deals 3 damage to all enemies.', targetType: 'all_enemies', effect: { damage: 3 } },
      intentIcon: 'attack',
    },
    {
      action: { id: 'hydra-regenerate', name: 'Regenerate', description: 'Heals 6 HP.', targetType: 'self', effect: { heal: 6 } },
      intentIcon: 'buff',
    },
    {
      action: { id: 'hydra-twin-fangs', name: 'Twin Fangs', description: 'Deals 5 damage.', targetType: 'single_enemy', effect: { damage: 5 } },
      intentIcon: 'attack',
    },
  ],
};

// ── Encounter Pools ──

export const fightEncounters: EncounterDefinition[] = [
  { id: 'grasslands-1', name: 'Goblin Ambush', enemies: grasslandsEncounter },
  { id: 'fight-ant-colony', name: 'Ant Colony', enemies: [fireAnt, { ...fireAnt, id: 'enemy-fire-ant-2' }, { ...fireAnt, id: 'enemy-fire-ant-3' }] },
  { id: 'fight-dark-thicket', name: 'Dark Thicket', enemies: [shadowRat, thornVine] },
  { id: 'fight-spore-hollow', name: 'Spore Hollow', enemies: [mushroomSpore, { ...mushroomSpore, id: 'enemy-mushroom-spore-2' }, grasslandsEncounter[1]] },
];

export const eliteEncounters: EncounterDefinition[] = [
  { id: 'elite-golems-lair', name: "Golem's Lair", enemies: [stoneGolem] },
  { id: 'elite-drakes-den', name: "Drake's Den", enemies: [venomDrake, shadowRat] },
];

export const bossEncounters: EncounterDefinition[] = [
  { id: 'boss-forest-king', name: 'Forest King', enemies: [forestKing] },
  { id: 'boss-swamp-hydra', name: 'Swamp Hydra', enemies: [swampHydra] },
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
