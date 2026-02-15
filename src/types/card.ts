import { CreatureAction } from './creature';

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
  targetMode?: 'creature' | 'cell';
}

export type EffectKey = 'damage' | 'heal' | 'haste' | 'defender' | 'addMana' | 'addBlock' | 'anyColor' | string;

export type EffectValue = number | boolean | string;

export interface CardEffects {
  [key: EffectKey]: EffectValue;
}
