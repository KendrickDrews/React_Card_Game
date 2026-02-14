import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayingCard } from '../../../types/card';

export interface PlayerState {
  deck: PlayingCard[];
  draw: PlayingCard[];
  hand: PlayingCard[];
  discard: PlayingCard[];
  exhaust: PlayingCard[];
  mana: number;
  maxMana: number;
  drawCount: number;
}

type PlayerStateKey = 'deck' | 'draw' | 'hand' | 'discard' | 'exhaust';
type IncrementalPlayerStates = 'mana' | 'drawCount';

export interface IncrementPlayerAction {
  state: IncrementalPlayerStates;
  amount: number;
}

function shuffleCards(array: PlayingCard[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const initPlayerState: PlayerState = {
  deck: [],
  draw: [],
  hand: [],
  discard: [],
  exhaust: [],
  mana: 3,
  maxMana: 3,
  drawCount: 5,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState: initPlayerState,
  reducers: {
    loadDeck: (state, action: PayloadAction<PlayingCard[]>) => {
      state.deck = [...action.payload];
    },
    drawCard: (state) => {
      const drawnCard = state.draw.shift();
      if (drawnCard) {
        state.hand.push(drawnCard);
      }
    },
    discardCard: (state) => {
      const handCard = state.hand.shift();
      if (handCard) {
        state.discard.push(handCard);
      }
    },
    toggleCardDiscardProperty: (state, action: PayloadAction<{ id: string; discard: boolean }>) => {
      const cardIndex = state.hand.findIndex(card => card.id === action.payload.id);
      if (cardIndex !== -1) {
        state.hand[cardIndex].discard = action.payload.discard;
      }
    },
    discardSpecificCard: (state, action: PayloadAction<string>) => {
      const cardIndex = state.hand.findIndex(card => card.id === action.payload);
      if (cardIndex !== -1) {
        const [discardedCard] = state.hand.splice(cardIndex, 1);
        state.discard.push(discardedCard);
      }
    },
    shuffleDeckToDraw: (state) => {
      state.draw.push(...state.deck);
      state.draw = shuffleCards(state.draw);
    },
    shuffleDiscardToDraw: (state) => {
      while (state.discard.length > 0) {
        const card = state.discard.pop()!;
        state.draw.unshift(card);
      }
      state.draw = shuffleCards(state.draw);
    },
    shufflePlayerCards: (state, action: PayloadAction<PlayerStateKey>) => {
      state[action.payload] = shuffleCards(state[action.payload]);
    },
    addCardToDeck: (state, action: PayloadAction<PlayingCard>) => {
      state.deck.push(action.payload);
    },
    resetMana: (state) => {
      state.mana = state.maxMana;
    },
    increase: (state, action: PayloadAction<IncrementPlayerAction>) => {
      state[action.payload.state] += action.payload.amount;
    },
    decrease: (state, action: PayloadAction<IncrementPlayerAction>) => {
      state[action.payload.state] -= action.payload.amount;
    },
    resetAllPiles: (state) => {
      state.deck = [];
      state.draw = [];
      state.hand = [];
      state.discard = [];
      state.exhaust = [];
    },
  },
});

export const playerState = playerSlice.actions;

export default playerSlice.reducer;
