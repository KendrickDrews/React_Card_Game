import { CreatureSpecies, PlayerCreature } from '../types/creature';

let creatureCounter = 0;

export const creatureSpecies: Record<string, CreatureSpecies> = {
  cricket: {
    speciesId: 'cricket',
    name: 'Cricket',
    description: 'A nimble insect fighter with quick slashes and high initiative.',
    maxHp: 15,
    initiative: 7,
    spriteId: 'cricket',
    cards: ['cricket-slash', 'cricket-slash', 'cricket-chirp', 'cricket-leap', 'mana-crystal'],
    defaultAction: {
      id: 'cricket-auto-slash',
      name: 'Auto Slash',
      description: 'Cricket slashes the nearest enemy for 2 damage.',
      targetType: 'single_enemy',
      effect: { damage: 2 },
    },
    passive: null,
  },
  sun: {
    speciesId: 'sun',
    name: 'Sun Spirit',
    description: 'A radiant spirit that heals allies and burns foes with solar energy.',
    maxHp: 10,
    initiative: 4,
    spriteId: 'sun',
    cards: ['sun-flare', 'sun-heal', 'sun-radiance', 'guard'],
    defaultAction: {
      id: 'sun-auto-heal',
      name: 'Warm Glow',
      description: 'Sun Spirit heals the weakest ally for 2 HP.',
      targetType: 'single_ally',
      effect: { heal: 2 },
    },
    passive: null,
  },
};

export const allSpecies: CreatureSpecies[] = Object.values(creatureSpecies);

export function instantiateCreature(speciesId: string, formationPosition: { col: number; row: number }): PlayerCreature {
  const species = creatureSpecies[speciesId];
  if (!species) {
    throw new Error(`Unknown species: ${speciesId}`);
  }
  creatureCounter++;
  const uniqueId = `player-${speciesId}-${creatureCounter}-${Date.now()}`;
  return {
    id: uniqueId,
    speciesId: species.speciesId,
    name: species.name,
    side: 'player',
    maxHp: species.maxHp,
    currentHp: species.maxHp,
    block: 0,
    initiative: species.initiative,
    passive: species.passive,
    buffs: [],
    debuffs: [],
    isAlive: true,
    spriteId: species.spriteId,
    cards: [...species.cards],
    defaultAction: { ...species.defaultAction },
    currentAction: { ...species.defaultAction },
    level: 1,
    experience: 0,
    experienceToNextLevel: 10,
    formationPosition,
  };
}
