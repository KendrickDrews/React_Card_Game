export interface PlayingCard {
    title: string;
    type?: string;
    manaCost?: number;
    value?: number;
    description?: string;
    effect: CardEffects;
  }
  
export type EffectKey = 'damage' | 'heal' | 'haste' | 'defender' | 'addMana' | 'anyColor' | string;

export type EffectValue = number | boolean | string;

export interface CardEffects {
  [key: EffectKey]: EffectValue;
}