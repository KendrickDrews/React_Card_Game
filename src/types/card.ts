import { CreatureAction } from './creature';
import { PushDirection } from './battleHelpers';

export interface ModifyActionEffect {
  creatureId: string;
  action: CreatureAction;
}

export interface PlayingCard {
  id: string;
  creatureId: string;
  title: string;
  type?: string;
  manaCost: number;
  value?: number;
  description?: string;
  effect: CardEffects;
  modifyAction?: ModifyActionEffect;
  discard: boolean;
  upgraded?: boolean;
  isAnimatingOut?: boolean;
}

export interface CardEffects {
  damage?: number;
  heal?: number;
  addMana?: number;
  addBlock?: number;
  aoeDamage?: number;
  aoeShape?: string;
  lineDamage?: number;
  pushDistance?: number;
  pushDirection?: PushDirection;
  summon?: string;
}
