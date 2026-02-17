import { SlotItem } from '../types/slotItem';
import { getRandomSlotItems } from './slotItemRegistry';

export interface BattleRewards {
  gold: number;
  cardChoices: string[] | null;
  slotItemDrop: SlotItem | null;
  bossSlotChoices: SlotItem[] | null;
}

const NEUTRAL_CARD_POOL = ['guard', 'mana-crystal'];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateRewards(nodeType: 'fight' | 'elite' | 'boss'): BattleRewards {
  // Gold
  let gold: number;
  switch (nodeType) {
    case 'fight': gold = randInt(10, 20); break;
    case 'elite': gold = randInt(20, 35); break;
    case 'boss':  gold = randInt(30, 50); break;
  }

  // Card choices: 60% chance, pick 3 from neutral pool
  const cardChoices = Math.random() < 0.6
    ? pickRandom(NEUTRAL_CARD_POOL, Math.min(3, NEUTRAL_CARD_POOL.length))
    : null;

  // Elite slot drop: 40% chance, common + uncommon pool
  let slotItemDrop: SlotItem | null = null;
  if (nodeType === 'elite' && Math.random() < 0.4) {
    const items = getRandomSlotItems(1, ['common', 'uncommon']);
    slotItemDrop = items[0] ?? null;
  }

  // Boss slot choice: always 3 items, uncommon + rare pool
  let bossSlotChoices: SlotItem[] | null = null;
  if (nodeType === 'boss') {
    bossSlotChoices = getRandomSlotItems(3, ['uncommon', 'rare']);
  }

  return { gold, cardChoices, slotItemDrop, bossSlotChoices };
}
