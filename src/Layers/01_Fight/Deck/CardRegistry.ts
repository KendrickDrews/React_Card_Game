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

  // ── Beetle cards ──

  'beetle-bash': {
    id: 'beetle-bash',
    title: 'Beetle Bash',
    type: 'Attack',
    manaCost: 1,
    value: 3,
    description: 'A heavy headbutt. Deal 3 damage.',
    effect: { damage: 3 },
  },
  'beetle-shell': {
    id: 'beetle-shell',
    title: 'Shell Guard',
    type: 'Skill',
    manaCost: 1,
    value: 7,
    description: 'Retreat into shell. Gain 7 block.',
    effect: { addBlock: 7 },
  },
  'beetle-ram': {
    id: 'beetle-ram',
    title: 'Beetle Ram',
    type: 'Attack',
    manaCost: 2,
    value: 4,
    description: 'Charge an enemy. Deal 4 damage and push right 1.',
    effect: { damage: 4, pushDirection: 'right', pushDistance: 1 },
  },

  // ── Moth cards ──

  'moth-scales': {
    id: 'moth-scales',
    title: 'Healing Scales',
    type: 'Spell',
    manaCost: 1,
    value: 2,
    description: 'Scatter healing dust. Heal 2 HP.',
    effect: { heal: 2 },
  },
  'moth-gust': {
    id: 'moth-gust',
    title: 'Gust',
    type: 'Spell',
    manaCost: 1,
    value: 0,
    description: 'A powerful gust pushes the target right 2.',
    effect: { pushDirection: 'right', pushDistance: 2 },
  },
  'moth-veil': {
    id: 'moth-veil',
    title: 'Dust Veil',
    type: 'Skill',
    manaCost: 1,
    value: 4,
    description: 'Surround an ally in dust. Gain 4 block.',
    effect: { addBlock: 4 },
  },

  // ── Firefly cards ──

  'firefly-spark': {
    id: 'firefly-spark',
    title: 'Spark',
    type: 'Attack',
    manaCost: 1,
    value: 4,
    description: 'A focused spark. Deal 4 damage.',
    effect: { damage: 4 },
  },
  'firefly-flash': {
    id: 'firefly-flash',
    title: 'Flash',
    type: 'Spell',
    manaCost: 2,
    value: 2,
    description: 'A blinding flash. Deal 2 AOE damage in a square.',
    effect: { aoeDamage: 2, aoeShape: 'square-1' },
  },
  'firefly-bolt': {
    id: 'firefly-bolt',
    title: 'Light Bolt',
    type: 'Spell',
    manaCost: 1,
    value: 5,
    description: 'Fire a bolt down the row. Deal 5 line damage.',
    effect: { lineDamage: 5 },
  },

  // ── Toad cards ──

  'toad-spit': {
    id: 'toad-spit',
    title: 'Acid Spit',
    type: 'Attack',
    manaCost: 1,
    value: 3,
    description: 'Spit acid at an enemy. Deal 3 damage.',
    effect: { damage: 3 },
  },
  'toad-splash': {
    id: 'toad-splash',
    title: 'Splash',
    type: 'Spell',
    manaCost: 2,
    value: 2,
    description: 'Splash acid in an area. Deal 2 AOE damage.',
    effect: { aoeDamage: 2, aoeShape: '1' },
  },
  'toad-croak': {
    id: 'toad-croak',
    title: 'Croak',
    type: 'Skill',
    manaCost: 1,
    value: 3,
    description: 'A defensive croak. Gain 3 block.',
    effect: { addBlock: 3 },
  },
  'toad-tongue': {
    id: 'toad-tongue',
    title: 'Tongue Lash',
    type: 'Attack',
    manaCost: 2,
    value: 6,
    description: 'Lash out with tongue. Deal 6 damage.',
    effect: { damage: 6 },
  },

  // ── Mantis cards ──

  'mantis-strike': {
    id: 'mantis-strike',
    title: 'Mantis Strike',
    type: 'Attack',
    manaCost: 1,
    value: 5,
    description: 'A precise strike. Deal 5 damage.',
    effect: { damage: 5 },
  },
  'mantis-slice': {
    id: 'mantis-slice',
    title: 'Slice',
    type: 'Attack',
    manaCost: 1,
    value: 4,
    description: 'A quick slice. Deal 4 damage.',
    effect: { damage: 4 },
  },
  'mantis-ambush': {
    id: 'mantis-ambush',
    title: 'Ambush',
    type: 'Attack',
    manaCost: 3,
    value: 9,
    description: 'A devastating ambush. Deal 9 damage.',
    effect: { damage: 9 },
  },

  // ── Spider cards ──

  'spider-bite': {
    id: 'spider-bite',
    title: 'Spider Bite',
    type: 'Attack',
    manaCost: 1,
    value: 3,
    description: 'A venomous bite. Deal 3 damage.',
    effect: { damage: 3 },
  },
  'spider-web': {
    id: 'spider-web',
    title: 'Web Shot',
    type: 'Spell',
    manaCost: 1,
    value: 0,
    description: 'Shoot a web that yanks the target left 2.',
    effect: { pushDirection: 'left', pushDistance: 2 },
  },
  'spider-trap': {
    id: 'spider-trap',
    title: 'Web Trap',
    type: 'Spell',
    manaCost: 2,
    value: 3,
    description: 'Lay a sticky trap. Deal 3 AOE damage in a line.',
    effect: { aoeDamage: 3, aoeShape: 'line-h-1' },
  },

  // ── Dragonfly cards ──

  'dragonfly-dart': {
    id: 'dragonfly-dart',
    title: 'Dart',
    type: 'Attack',
    manaCost: 0,
    value: 2,
    description: 'A quick dart. Deal 2 damage.',
    effect: { damage: 2 },
  },
  'dragonfly-dive': {
    id: 'dragonfly-dive',
    title: 'Dive',
    type: 'Attack',
    manaCost: 1,
    value: 4,
    description: 'Dive at an enemy. Deal 4 damage.',
    effect: { damage: 4 },
  },
  'dragonfly-swoop': {
    id: 'dragonfly-swoop',
    title: 'Swoop',
    type: 'Spell',
    manaCost: 2,
    value: 6,
    description: 'Swoop across the row. Deal 6 line damage.',
    effect: { lineDamage: 6 },
  },
  'dragonfly-zip': {
    id: 'dragonfly-zip',
    title: 'Zip',
    type: 'Skill',
    manaCost: 1,
    value: 3,
    description: 'Zip away quickly. Gain 3 block.',
    effect: { addBlock: 3 },
  },

  // ── Snail cards ──

  'snail-slam': {
    id: 'snail-slam',
    title: 'Shell Slam',
    type: 'Attack',
    manaCost: 2,
    value: 4,
    description: 'Slam with the shell. Deal 4 damage.',
    effect: { damage: 4 },
  },
  'snail-shell': {
    id: 'snail-shell',
    title: 'Iron Shell',
    type: 'Skill',
    manaCost: 1,
    value: 8,
    description: 'An impenetrable defense. Gain 8 block.',
    effect: { addBlock: 8 },
  },
  'snail-slide': {
    id: 'snail-slide',
    title: 'Slime Slide',
    type: 'Spell',
    manaCost: 2,
    value: 0,
    description: 'Slide into the target, pushing them left 3.',
    effect: { pushDirection: 'left', pushDistance: 3 },
  },
};

// Instantiate a full PlayingCard[] from a creature's card ID list
export function getCardsForCreature(creature: PlayerCreature): PlayingCard[] {
  const instanceCounts: Record<string, number> = {};
  return creature.cards
    .map(cardId => {
      const template = cardTemplates[cardId];
      if (!template) {
        console.warn(`Card template not found: ${cardId}`);
        return null;
      }
      // Track instance count so duplicate cards get unique IDs
      const count = (instanceCounts[cardId] ?? 0) + 1;
      instanceCounts[cardId] = count;
      return {
        ...template,
        id: `${creature.id}-${template.id}-${count}`,
        creatureId: creature.id,
        discard: false,
      } as PlayingCard;
    })
    .filter((c): c is PlayingCard => c !== null);
}

export { cardTemplates };
