import { CardEffects, PlayingCard } from '../types/card';

export interface CardUpgrade {
  upgradedTitle: string;
  upgradedDescription: string;
  upgradedEffect: CardEffects;
  upgradedManaCost?: number;
}

/** Applies an upgrade to an existing PlayingCard in place. */
export function applyCardUpgrade(card: PlayingCard, upgrade: CardUpgrade): void {
  card.title = upgrade.upgradedTitle;
  card.description = upgrade.upgradedDescription;
  card.effect = upgrade.upgradedEffect;
  if (upgrade.upgradedManaCost !== undefined) {
    card.manaCost = upgrade.upgradedManaCost;
  }
  card.upgraded = true;
}

export const cardUpgrades: Record<string, CardUpgrade> = {
  'cricket-slash': {
    upgradedTitle: 'Cricket Slash+',
    upgradedDescription: 'A fierce slash. Deal 5 damage.',
    upgradedEffect: { damage: 5 },
  },
  'cricket-chirp': {
    upgradedTitle: 'Chirp+',
    upgradedDescription: 'Gain 7 block.',
    upgradedEffect: { addBlock: 7 },
  },
  'cricket-leap': {
    upgradedTitle: 'Leap Strike+',
    upgradedDescription: 'Jump at an enemy. Deal 8 damage.',
    upgradedEffect: { damage: 8 },
  },
  'sun-flare': {
    upgradedTitle: 'Solar Flare+',
    upgradedDescription: 'A burst of solar energy. Deal 6 damage.',
    upgradedEffect: { damage: 6 },
  },
  'sun-heal': {
    upgradedTitle: 'Sunlight+',
    upgradedDescription: 'Warm healing light. Heal 5 HP.',
    upgradedEffect: { heal: 5 },
  },
  'guard': {
    upgradedTitle: 'Guard+',
    upgradedDescription: 'Brace for impact. Gain 8 block.',
    upgradedEffect: { addBlock: 8 },
  },
  'mana-crystal': {
    upgradedTitle: 'Mana Crystal+',
    upgradedDescription: 'A pulsing crystal. Gain 2 mana.',
    upgradedEffect: { addMana: 2 },
  },
  'beetle-bash': {
    upgradedTitle: 'Beetle Bash+',
    upgradedDescription: 'A devastating headbutt. Deal 5 damage.',
    upgradedEffect: { damage: 5 },
  },
  'beetle-shell': {
    upgradedTitle: 'Shell Guard+',
    upgradedDescription: 'Retreat into shell. Gain 10 block.',
    upgradedEffect: { addBlock: 10 },
  },
  'moth-scales': {
    upgradedTitle: 'Healing Scales+',
    upgradedDescription: 'Scatter healing dust. Heal 4 HP.',
    upgradedEffect: { heal: 4 },
  },
};
