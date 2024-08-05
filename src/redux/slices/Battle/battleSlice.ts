import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';

const battlePhases = [
  "player_start",
  "player_active",
  "player_end",
  "enemy_start",
  "enemy_active",
  "enemy_end"
] as const;
type BattlePhase = typeof battlePhases[number];

export interface BattleAttributes {
  phase: "player_start" | "player_active" | "player_end" | "enemy_start" | "enemy_active" | "enemy_end";
  turn: number;
  battleStart: boolean;
  shouldDraw: boolean;

}


// Define the structure of the entire fight state
export interface BattleState {
  battle: BattleAttributes;
}

const initBattleState: BattleState = {
  battle: {
    phase: "player_start",
    turn: 0,
    battleStart: true,
    shouldDraw: true,
  }
}



export const battleSlice = createSlice({
  name: 'battle',
  initialState: initBattleState,
  reducers: {
    setBattleStart: (state, action: PayloadAction<boolean>) => {
      state.battle.battleStart = action.payload
    },
    nextBattlePhase: (state) => {
      const currentPhaseIndex = battlePhases.indexOf(state.battle.phase);
      const nextPhaseIndex = (currentPhaseIndex + 1) % battlePhases.length;
      state.battle.phase = battlePhases[nextPhaseIndex];
    },

    // Optionally, you might want a reducer to set a specific phase
    setBattlePhase: (state, action: PayloadAction<BattlePhase>) => {
      state.battle.phase = action.payload;
    },
    setShouldDraw: (state, action: PayloadAction<boolean>) => {
      state.battle.shouldDraw = action.payload;
    }
  }
})

export const battleState = battleSlice.actions

export default battleSlice.reducer


// decrement: state => {
//   state.value -= 1
// },
// incrementByAmount: (state, action) => {
//   state.value += action.payload
// }