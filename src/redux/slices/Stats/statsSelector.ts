import { RootState } from '../../store';
import type { UnlockCategory } from '../../../types/stats';

// Base selectors
export const selectStatsState = (state: RootState) => state.stats;
export const selectRunStats = (state: RootState) => state.stats.runs;
export const selectAllUnlocks = (state: RootState) => state.stats.unlocks;
export const selectEnemyDefeats = (state: RootState) => state.stats.enemyDefeats;
export const selectCombatStats = (state: RootState) => state.stats.combat;

// Derived: runs
export const selectRunWinRate = (state: RootState) => {
  const { totalRuns, successfulRuns } = state.stats.runs;
  return totalRuns === 0 ? 0 : successfulRuns / totalRuns;
};

// Derived: unlocks
export const selectUnlocksByCategory = (category: UnlockCategory) => (state: RootState) =>
  Object.values(state.stats.unlocks).filter(u => u.category === category);

export const selectUnlockedIds = (state: RootState) =>
  Object.keys(state.stats.unlocks).filter(id => state.stats.unlocks[id].unlockedAt !== null);

export const selectIsUnlocked = (id: string) => (state: RootState) =>
  state.stats.unlocks[id]?.unlockedAt !== null && state.stats.unlocks[id] !== undefined;

// Derived: enemy defeats
export const selectEnemyDefeatCount = (speciesId: string) => (state: RootState) =>
  state.stats.enemyDefeats[speciesId]?.totalDefeats ?? 0;

export const selectTotalEnemiesDefeated = (state: RootState) =>
  Object.values(state.stats.enemyDefeats).reduce((sum, r) => sum + r.totalDefeats, 0);

export const selectUniqueSpeciesDefeated = (state: RootState) =>
  Object.keys(state.stats.enemyDefeats).length;

export const selectTotalGoldSpent = (state: RootState) =>
  state.stats.combat.totalGoldSpent;
