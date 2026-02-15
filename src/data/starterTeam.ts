import { PlayerCreature } from '../types/creature';
import { instantiateCreature } from './creatureRegistry';

export const starterTeam: PlayerCreature[] = [
  instantiateCreature('cricket', { col: 1, row: 2 }),
  instantiateCreature('sun', { col: 0, row: 2 }),
];
