import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';
import { PlayingCard } from '../../../types/card';

// Define the PlayingCard type if you haven't already

// Define the structure of the player state
export interface PlayerState {
  deck: PlayingCard[];
  draw: PlayingCard[];
  hand: PlayingCard[];
  discard: PlayingCard[];
  exhaust: PlayingCard[]; 
  health: number;
  mana: number; 
  drawCount: number;
}

type PlayerStateKey = 'deck' | 'draw' | 'hand' | 'discard' | 'exhaust';
type IncrementalPlayerStates = 'health' | 'mana' | 'drawCount';

export interface IncrementPlayerAction {
  state: IncrementalPlayerStates;
  amount: number;
}

function shuffleCards(array: PlayingCard[]) {
  // Create a copy of the original array
  const shuffled = [...array];

  // Perform Fisher-Yates shuffle
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
    health: 10,
    mana: 3,
    drawCount: 5,
}



export const playerSlice = createSlice({
  name: 'player',
  initialState: initPlayerState,
  reducers: {
    loadDeck: (state, action: PayloadAction<PlayingCard[]>) => {
      state.deck = [...action.payload]
    },
    drawCard: (state) => {
      const drawnCard = state.draw.shift();
      state.hand.push(drawnCard as PlayingCard);
    },
    discardCard: (state) => {
      const handCard = state.hand.shift();
      state.discard.push(handCard as PlayingCard);
    },
    shuffleDeckToDraw: state => {
      state.draw.push(...state.deck)
      state.draw = shuffleCards(state.draw);
    },
    shuffleDiscardToDraw: state => {
      while (state.discard.length > 0) {
        const card = state.discard.pop()!;
        state.draw.unshift(card);
      }
      state.draw = shuffleCards(state.draw);
    },
    shufflePlayerCards: (state, action: PayloadAction<PlayerStateKey>) => {
      const arrayToShuffle = [...state[action.payload]];
      
      for (let i = arrayToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayToShuffle[i], arrayToShuffle[j]] = [arrayToShuffle[j], arrayToShuffle[i]];
      }
    
      state[action.payload] = arrayToShuffle;
    },
    addCardToDeck: (state, action: PayloadAction<PlayingCard>) => {
      state.deck.push(action.payload);
    },
    increase: (state, action: PayloadAction<IncrementPlayerAction>) => {
      state[action.payload.state] += action.payload.amount
    },
    decrease: (state, action: PayloadAction<IncrementPlayerAction>) => {
      state[action.payload.state] -= action.payload.amount
    }
  }
})

export const playerState = playerSlice.actions

export default playerSlice.reducer


// decrement: state => {
//   state.value -= 1
// },
// incrementByAmount: (state, action) => {
//   state.value += action.payload
// }