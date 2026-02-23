import { GameEvent } from '../types/event';

const eventRegistry: Record<string, GameEvent> = {
  'mysterious-chest': {
    id: 'mysterious-chest',
    title: 'Mysterious Chest',
    startStepId: 'intro',
    steps: {
      intro: {
        id: 'intro',
        text: 'You stumble upon an ornate chest half-buried in the dirt. Strange runes pulse faintly along its edges.',
        choices: [
          { label: 'Open carefully', description: 'Take your time with the lock.', nextStepId: 'careful' },
          { label: 'Force it open', description: 'Smash the lock. What could go wrong?', nextStepId: 'force' },
          { label: 'Leave it alone', nextStepId: 'leave' },
        ],
      },
      careful: {
        id: 'careful',
        text: 'You carefully work the lock. Inside you find a stash of gold coins!',
        effects: [{ goldRange: [15, 30] }],
        isTerminal: true,
      },
      force: {
        id: 'force',
        text: 'You smash the chest open! A burst of cursed energy singes your team, but among the wreckage you find a powerful artifact.',
        effects: [{ damagePercent: 10 }, { addArtifact: 'war-drum' }],
        isTerminal: true,
      },
      leave: {
        id: 'leave',
        text: 'You decide not to risk it and walk away. Sometimes discretion is the better part of valor.',
        isTerminal: true,
      },
    },
  },

  'wandering-merchant': {
    id: 'wandering-merchant',
    title: 'Wandering Merchant',
    startStepId: 'intro',
    steps: {
      intro: {
        id: 'intro',
        text: 'A cloaked figure steps out from behind a tree. "Psst... interested in something special?" They open their coat to reveal an array of cards.',
        choices: [
          {
            label: 'Buy a card',
            description: 'Pay 30 gold for a rare card.',
            nextStepId: 'buy',
            condition: { minGold: 30 },
          },
          { label: 'Decline politely', nextStepId: 'decline' },
          { label: 'Walk away', nextStepId: 'leave' },
        ],
      },
      buy: {
        id: 'buy',
        text: 'You hand over 30 gold. The merchant grins and offers you a powerful Guard card.',
        effects: [{ goldChange: -30 }, { addCard: 'guard' }],
        isTerminal: true,
      },
      decline: {
        id: 'decline',
        text: '"No worries, friend. Safe travels!" The merchant tips their hat and disappears into the shadows.',
        isTerminal: true,
      },
      leave: {
        id: 'leave',
        text: 'You hurry past without a word. The merchant shrugs and vanishes.',
        isTerminal: true,
      },
    },
  },

  'healing-spring': {
    id: 'healing-spring',
    title: 'Healing Spring',
    startStepId: 'intro',
    steps: {
      intro: {
        id: 'intro',
        text: 'A gentle spring bubbles up from between mossy rocks. The water glows with a soft blue light, and you can feel its restorative energy from here.',
        choices: [
          { label: 'Drink deeply', description: 'Restore your team\'s health.', nextStepId: 'drink' },
          { label: 'Bottle the water', description: 'Take some for later.', nextStepId: 'bottle' },
          {
            label: 'Toss in a coin',
            description: 'Make a wish. (Costs 5 gold)',
            nextStepId: 'coin',
            condition: { minGold: 5 },
          },
        ],
      },
      drink: {
        id: 'drink',
        text: 'Your team drinks from the spring. A warm glow spreads through everyone — wounds close and fatigue fades.',
        effects: [{ healPercent: 30 }],
        isTerminal: true,
      },
      bottle: {
        id: 'bottle',
        text: 'You carefully fill a vial with the glowing water. It might come in handy later.',
        effects: [{ addArtifact: 'lucky-coin' }],
        isTerminal: true,
      },
      coin: {
        id: 'coin',
        text: 'You toss a gold coin into the spring. The water flashes brightly, and a pile of coins materializes at your feet!',
        effects: [{ goldChange: -5 }, { goldRange: [20, 40] }],
        isTerminal: true,
      },
    },
  },

  'abandoned-campfire': {
    id: 'abandoned-campfire',
    title: 'Abandoned Campfire',
    startStepId: 'intro',
    steps: {
      intro: {
        id: 'intro',
        text: 'You come across the remains of a campfire. The embers are still warm. Someone left in a hurry — a pack lies open nearby.',
        choices: [
          { label: 'Search the pack', description: 'See what was left behind.', nextStepId: 'search' },
          { label: 'Rest by the fire', description: 'Take a moment to recover.', nextStepId: 'rest' },
          { label: 'Move on', nextStepId: 'leave' },
        ],
      },
      search: {
        id: 'search',
        text: 'Inside the pack you find some gold and a card inscribed with a Mana Crystal technique!',
        effects: [{ goldRange: [10, 20] }, { addCard: 'mana-crystal' }],
        isTerminal: true,
      },
      rest: {
        id: 'rest',
        text: 'Your team rests by the dying fire. The warmth soothes aching muscles and mends minor wounds.',
        effects: [{ healPercent: 15 }],
        isTerminal: true,
      },
      leave: {
        id: 'leave',
        text: 'You decide not to linger. Whoever left this camp might come back, and you\'d rather not find out why they fled.',
        isTerminal: true,
      },
    },
  },
};

const eventIds = Object.keys(eventRegistry);

export function getRandomEvent(): GameEvent {
  const id = eventIds[Math.floor(Math.random() * eventIds.length)];
  return eventRegistry[id];
}

export { eventRegistry };
