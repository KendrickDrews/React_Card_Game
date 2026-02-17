import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { StatsState, UnlockEntry } from '../../../types/stats';

export const STATS_STORAGE_KEY = 'slay-the-browser-stats';

const DEFAULT_STATE: StatsState = {
  runs: { totalRuns: 0, successfulRuns: 0, failedRuns: 0 },
  unlocks: {},
  enemyDefeats: {},
  combat: {
    totalDamageDealt: 0,
    totalDamageReceived: 0,
    totalHealingDone: 0,
    totalCardsPlayed: 0,
    totalTurnsTaken: 0,
    totalBattlesWon: 0,
    totalBattlesLost: 0,
    totalGoldSpent: 0,
  },
};

function loadInitialState(): StatsState {
  try {
    const stored = localStorage.getItem(STATS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        runs: { ...DEFAULT_STATE.runs, ...parsed.runs },
        unlocks: { ...DEFAULT_STATE.unlocks, ...parsed.unlocks },
        enemyDefeats: { ...DEFAULT_STATE.enemyDefeats, ...parsed.enemyDefeats },
        combat: { ...DEFAULT_STATE.combat, ...parsed.combat },
      };
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_STATE };
}

export const statsSlice = createSlice({
  name: 'stats',
  initialState: loadInitialState(),
  reducers: {
    // Run actions
    recordRunStart: (state) => {
      state.runs.totalRuns += 1;
    },
    recordRunSuccess: (state) => {
      state.runs.successfulRuns += 1;
    },
    recordRunFailure: (state) => {
      state.runs.failedRuns += 1;
    },

    // Unlock actions
    grantUnlock: (state, action: PayloadAction<Omit<UnlockEntry, 'unlockedAt'>>) => {
      const { id } = action.payload;
      if (!state.unlocks[id]) {
        state.unlocks[id] = { ...action.payload, unlockedAt: Date.now() };
      }
    },
    grantUnlockBatch: (state, action: PayloadAction<Omit<UnlockEntry, 'unlockedAt'>[]>) => {
      for (const entry of action.payload) {
        if (!state.unlocks[entry.id]) {
          state.unlocks[entry.id] = { ...entry, unlockedAt: Date.now() };
        }
      }
    },

    // Enemy defeat actions
    recordEnemyDefeat: (state, action: PayloadAction<string>) => {
      const speciesId = action.payload;
      if (!state.enemyDefeats[speciesId]) {
        state.enemyDefeats[speciesId] = {
          speciesId,
          totalDefeats: 1,
          firstDefeatedAt: Date.now(),
        };
      } else {
        state.enemyDefeats[speciesId].totalDefeats += 1;
      }
    },
    recordEnemyDefeatBatch: (state, action: PayloadAction<string[]>) => {
      for (const speciesId of action.payload) {
        if (!state.enemyDefeats[speciesId]) {
          state.enemyDefeats[speciesId] = {
            speciesId,
            totalDefeats: 1,
            firstDefeatedAt: Date.now(),
          };
        } else {
          state.enemyDefeats[speciesId].totalDefeats += 1;
        }
      }
    },

    // Combat actions
    addDamageDealt: (state, action: PayloadAction<number>) => {
      state.combat.totalDamageDealt += action.payload;
    },
    addDamageReceived: (state, action: PayloadAction<number>) => {
      state.combat.totalDamageReceived += action.payload;
    },
    addHealingDone: (state, action: PayloadAction<number>) => {
      state.combat.totalHealingDone += action.payload;
    },
    incrementCardsPlayed: (state) => {
      state.combat.totalCardsPlayed += 1;
    },
    incrementTurnsTaken: (state) => {
      state.combat.totalTurnsTaken += 1;
    },
    recordBattleWon: (state) => {
      state.combat.totalBattlesWon += 1;
    },
    recordBattleLost: (state) => {
      state.combat.totalBattlesLost += 1;
    },
    addGoldSpent: (state, action: PayloadAction<number>) => {
      state.combat.totalGoldSpent += action.payload;
    },

    // Debug
    resetStats: () => ({ ...DEFAULT_STATE }),
  },
});

export const statsActions = statsSlice.actions;

export default statsSlice.reducer;
