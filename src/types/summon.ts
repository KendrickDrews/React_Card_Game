import { CreatureAction } from './creature';

export interface SummonTemplate {
  id: string;
  name: string;
  maxHp: number;
  initiative: number;        // 0 for static objects
  spriteId: string;
  zone: 'ally' | 'enemy';   // which zone the card targets for placement
  action: CreatureAction;    // no-op action for objects
}
