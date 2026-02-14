import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayingCard } from '../../../types/card';
import { InitiativeEntry } from '../../../types/creature';

const battlePhases = [
  "turn_start",
  "player_card_phase",
  "player_end",
  "initiative_phase",
  "turn_end",
] as const;

type BattlePhase = typeof battlePhases[number];

export type TargetingMode = 'none' | 'enemy' | 'ally' | 'self' | 'auto';

export interface BattleState {
  phase: BattlePhase;
  turn: number;
  battleStart: boolean;
  shouldDraw: boolean;
  activeCard: PlayingCard | null;
  useCard: boolean;

  // Initiative
  initiativeQueue: InitiativeEntry[];
  currentInitiativeIndex: number;
  isInitiativeResolving: boolean;

  // Battle result
  battleResult: 'ongoing' | 'victory' | 'defeat';

  // Card targeting
  targetCreatureId: string | null;
  targetingMode: TargetingMode;
  validTargetIds: string[];
}

const initBattleState: BattleState = {
  phase: "turn_start",
  turn: 0,
  battleStart: false,
  shouldDraw: true,
  activeCard: null,
  useCard: false,
  initiativeQueue: [],
  currentInitiativeIndex: 0,
  isInitiativeResolving: false,
  battleResult: 'ongoing',
  targetCreatureId: null,
  targetingMode: 'none',
  validTargetIds: [],
};

export const battleSlice = createSlice({
  name: 'battle',
  initialState: initBattleState,
  reducers: {
    setBattleStart: (state, action: PayloadAction<boolean>) => {
      state.battleStart = action.payload;
    },
    increaseTurn: (state) => { state.turn += 1; },
    resetTurn: (state) => { state.turn = 0; },
    nextBattlePhase: (state) => {
      const currentPhaseIndex = battlePhases.indexOf(state.phase);
      const nextPhaseIndex = (currentPhaseIndex + 1) % battlePhases.length;
      state.phase = battlePhases[nextPhaseIndex];
    },
    setBattlePhase: (state, action: PayloadAction<BattlePhase>) => {
      state.phase = action.payload;
    },
    setShouldDraw: (state, action: PayloadAction<boolean>) => {
      state.shouldDraw = action.payload;
    },
    setActiveCard: (state, action: PayloadAction<PlayingCard | "none">) => {
      if (action.payload === 'none') {
        state.activeCard = null;
      } else {
        state.activeCard = action.payload;
      }
    },
    useCard: (state, action: PayloadAction<boolean>) => {
      state.useCard = action.payload;
    },

    // Initiative
    buildInitiativeQueue: (state, action: PayloadAction<InitiativeEntry[]>) => {
      state.initiativeQueue = action.payload;
      state.currentInitiativeIndex = 0;
    },
    setCurrentInitiativeIndex: (state, action: PayloadAction<number>) => {
      state.currentInitiativeIndex = action.payload;
    },
    advanceInitiative: (state) => {
      state.currentInitiativeIndex += 1;
    },
    resetInitiative: (state) => {
      state.initiativeQueue = [];
      state.currentInitiativeIndex = 0;
      state.isInitiativeResolving = false;
    },
    setIsInitiativeResolving: (state, action: PayloadAction<boolean>) => {
      state.isInitiativeResolving = action.payload;
    },

    // Battle result
    setBattleResult: (state, action: PayloadAction<'ongoing' | 'victory' | 'defeat'>) => {
      state.battleResult = action.payload;
    },

    // Targeting
    setTargetCreature: (state, action: PayloadAction<string | null>) => {
      state.targetCreatureId = action.payload;
    },
    setTargetingMode: (state, action: PayloadAction<TargetingMode>) => {
      state.targetingMode = action.payload;
    },
    setValidTargetIds: (state, action: PayloadAction<string[]>) => {
      state.validTargetIds = action.payload;
    },
    clearTargeting: (state) => {
      state.activeCard = null;
      state.targetCreatureId = null;
      state.targetingMode = 'none';
      state.validTargetIds = [];
    },
  },
});

export const battleState = battleSlice.actions;

export default battleSlice.reducer;
