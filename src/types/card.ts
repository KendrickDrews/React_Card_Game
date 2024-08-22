export interface PlayingCard {
    id: number;
    title: string;
    type?: string;
    manaCost: number;
    value?: number;
    description?: string;
    effect: CardEffects;
    discard: boolean;
  }
  
export type EffectKey = 'damage' | 'heal' | 'haste' | 'defender' | 'addMana' | 'anyColor' | string;

export type EffectValue = number | boolean | string;

export interface CardEffects {
  [key: EffectKey]: EffectValue;
}