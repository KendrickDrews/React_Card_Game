import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';

// Define the PlayingCard type if you haven't already
export interface PlayingCard {
  title: string;
  type: string;
  manaCost?: number;
  value?: number;
  description?: string;
  // Add any other properties that a PlayingCard might have
}
// Define the structure of the player state
export interface PlayerAttributes {
  deck: PlayingCard[];
  draw: PlayingCard[];
  hand: PlayingCard[];
  discard: PlayingCard[];
  exhaust: PlayingCard[];  
}

type PlayerStateKey = 'deck' | 'draw' | 'hand' | 'discard' | 'exhaust';

// Define the structure of the entire fight state
export interface PlayerState {
  player: PlayerAttributes;
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
  player: {
    deck: [],
    draw: [],
    hand: [],
    discard: [],
    exhaust: []
  }
}



export const playerSlice = createSlice({
  name: 'player',
  initialState: initPlayerState,
  reducers: {
    loadDeck: (state, action: PayloadAction<PlayingCard[]>) => {
      state.player.deck = [...action.payload]
    },
    drawCard: (state) => {
      const drawnCard = state.player.draw.shift();
      state.player.hand.push(drawnCard as PlayingCard);
    },
    discardCard: (state) => {
      const handCard = state.player.hand.shift();
      state.player.discard.push(handCard as PlayingCard);
    },
    shuffleDeckToDraw: state => {
      state.player.draw.push(...state.player.deck)
      state.player.draw = shuffleCards(state.player.draw);
    },
    shuffleDiscardToDraw: state => {
      while (state.player.discard.length > 0) {
        const card = state.player.discard.pop()!;
        state.player.draw.unshift(card);
      }
      state.player.draw = shuffleCards(state.player.draw);
    },
    shufflePlayerCards: (state, action: PayloadAction<PlayerStateKey>) => {
      const arrayToShuffle = [...state.player[action.payload]];
      
      for (let i = arrayToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayToShuffle[i], arrayToShuffle[j]] = [arrayToShuffle[j], arrayToShuffle[i]];
      }
    
      state.player[action.payload] = arrayToShuffle;
    },
    addCardToDeck: (state, action: PayloadAction<PlayingCard>) => {
      state.player.deck.push(action.payload);
    },
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