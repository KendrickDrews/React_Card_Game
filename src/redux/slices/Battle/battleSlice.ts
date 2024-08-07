import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';
import { PlayingCard } from '../../../types/card';

const battlePhases = [
  "player_start",
  "player_active",
  "player_end",
  "enemy_start",
  "enemy_active",
  "enemy_end"
] as const;

type BattlePhase = typeof battlePhases[number];

export interface BattleState {
  phase: "player_start" | "player_active" | "player_end" | "enemy_start" | "enemy_active" | "enemy_end";
  turn: number;
  battleStart: boolean;
  shouldDraw: boolean;
  activeCard: PlayingCard | null;
  useCard: boolean;

}

const initBattleState: BattleState = {
    phase: "player_start",
    turn: 0,
    battleStart: true,
    shouldDraw: true,
    activeCard: null,
    useCard: false,
}

export const battleSlice = createSlice({
  name: 'battle',
  initialState: initBattleState,
  reducers: {
    setBattleStart: (state, action: PayloadAction<boolean>) => {
      state.battleStart = action.payload
    },
    nextBattlePhase: (state) => {
      const currentPhaseIndex = battlePhases.indexOf(state.phase);
      const nextPhaseIndex = (currentPhaseIndex + 1) % battlePhases.length;
      state.phase = battlePhases[nextPhaseIndex];
    },

    // Optionally, you might want a reducer to set a specific phase
    setBattlePhase: (state, action: PayloadAction<BattlePhase>) => {
      state.phase = action.payload;
    },
    setShouldDraw: (state, action: PayloadAction<boolean>) => {
      state.shouldDraw = action.payload;
    },
    setActiveCard: (state, action: PayloadAction<PlayingCard | null>) => {
      state.activeCard = action.payload
    },
    useCard: (state, action: PayloadAction<boolean>) => {
      state.useCard = action.payload
    }
  }
})

export const battleState = battleSlice.actions

export default battleSlice.reducer
