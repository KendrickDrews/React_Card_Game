import { PlayingCard, CardEffects } from '../../../types/card';
import { PlayerCreature } from '../../../types/creature';

interface CardTemplate {
  id: string;
  title: string;
  type: string;
  manaCost: number;
  value: number;
  description: string;
  effect: CardEffects;
}

const cardTemplates: Record<string, CardTemplate> = {
  // Cricket cards
  'cricket-slash': {
    id: 'cricket-slash',
    title: 'Cricket Slash',
    type: 'Attack',
    manaCost: 1,
    value: 1,
    description: 'A quick slash. Deal 3 damage.',
    effect: { damage: 3 },
  },
  'cricket-chirp': {
    id: 'cricket-chirp',
    title: 'Chirp',
    type: 'Skill',
    manaCost: 1,
    value: 0,
    description: 'Gain 4 block.',
    effect: { addBlock: 4 },
  },
  'cricket-leap': {
    id: 'cricket-leap',
    title: 'Leap Strike',
    type: 'Attack',
    manaCost: 2,
    value: 2,
    description: 'Jump at an enemy. Deal 5 damage.',
    effect: { damage: 5 },
  },

  // Sun cards
  'sun-flare': {
    id: 'sun-flare',
    title: 'Solar Flare',
    type: 'Spell',
    manaCost: 2,
    value: 3,
    description: 'A burst of solar energy. Deal 4 damage.',
    effect: { damage: 4 },
  },
  'sun-heal': {
    id: 'sun-heal',
    title: 'Sunlight',
    type: 'Spell',
    manaCost: 1,
    value: 2,
    description: 'Warm healing light. Heal 3 HP.',
    effect: { heal: 3 },
  },
  'sun-radiance': {
    id: 'sun-radiance',
    title: 'Radiance',
    type: 'Spell',
    manaCost: 3,
    value: 4,
    description: 'Blinding radiance. Deal 2 damage to all enemies.',
    effect: { damage: 2 },
  },

  // Shared/generic cards
  'mana-crystal': {
    id: 'mana-crystal',
    title: 'Mana Crystal',
    type: 'Artifact',
    manaCost: 0,
    value: 1,
    description: 'A small crystal that pulses with energy. Gain 1 mana.',
    effect: { addMana: 1 },
  },
  'guard': {
    id: 'guard',
    title: 'Guard',
    type: 'Skill',
    manaCost: 1,
    value: 1,
    description: 'Brace for impact. Gain 5 block.',
    effect: { addBlock: 5 },
  },
};

// Instantiate a full PlayingCard[] from a creature's card ID list
export function getCardsForCreature(creature: PlayerCreature): PlayingCard[] {
  return creature.cards
    .map(cardId => {
      const template = cardTemplates[cardId];
      if (!template) {
        console.warn(`Card template not found: ${cardId}`);
        return null;
      }
      // Each card instance gets a unique ID combining creature and card template
      return {
        ...template,
        id: `${creature.id}-${template.id}`,
        creatureId: creature.id,
        discard: false,
      } as PlayingCard;
    })
    .filter((c): c is PlayingCard => c !== null);
}

export { cardTemplates };
