import type { UnlockEntry } from '../types/stats';

export type UnlockConditionType =
  | 'defeat_first_boss'
  | 'defeat_enemies'
  | 'spend_gold'
  | 'lose_run';

export interface UnlockCondition {
  type: UnlockConditionType;
  threshold?: number; // e.g. 5 for "defeat 5 enemies", 100 for "spend 100 gold"
}

export interface UnlockableCreature {
  unlock: Omit<UnlockEntry, 'unlockedAt'>;
  condition: UnlockCondition;
  conditionLabel: string; // human-readable description
  speciesId: string;
}

export const unlockableCreatures: UnlockableCreature[] = [
  {
    unlock: {
      id: 'creature:phoenix',
      category: 'creature',
      name: 'Phoenix',
      description: 'A blazing bird reborn from ash. Burns enemies and revives fallen allies.',
    },
    condition: { type: 'defeat_first_boss' },
    conditionLabel: 'Defeat the first boss',
    speciesId: 'phoenix',
  },
  {
    unlock: {
      id: 'creature:scorpion',
      category: 'creature',
      name: 'Ironclad Scorpion',
      description: 'An armored predator with a venomous stinger. Tough to kill and hits hard.',
    },
    condition: { type: 'defeat_first_boss' },
    conditionLabel: 'Defeat the first boss',
    speciesId: 'scorpion',
  },
  {
    unlock: {
      id: 'creature:centipede',
      category: 'creature',
      name: 'Centipede',
      description: 'A skittering horror that overwhelms foes with relentless multi-strikes.',
    },
    condition: { type: 'defeat_enemies', threshold: 5 },
    conditionLabel: 'Defeat 5 enemies',
    speciesId: 'centipede',
  },
  {
    unlock: {
      id: 'creature:goldWeevil',
      category: 'creature',
      name: 'Gold Weevil',
      description: 'A gilded beetle that converts riches into resilience. Wealth is armor.',
    },
    condition: { type: 'spend_gold', threshold: 100 },
    conditionLabel: 'Spend 100 gold',
    speciesId: 'goldWeevil',
  },
  {
    unlock: {
      id: 'creature:wraithMoth',
      category: 'creature',
      name: 'Wraith Moth',
      description: 'A spectral moth drawn to defeat. Feeds on death to empower itself.',
    },
    condition: { type: 'lose_run' },
    conditionLabel: 'Lose a run',
    speciesId: 'wraithMoth',
  },
];
