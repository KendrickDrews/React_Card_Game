import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { statsActions, STATS_STORAGE_KEY } from './slices/Stats/statsSlice';
import { battleCreaturesState } from './slices/BattleCreatures/battleCreaturesSlice';
import { inventoryActions } from './slices/Inventory/inventorySlice';
import { unlockableCreatures } from '../data/unlockableCreatures';
import type { StatsState } from '../types/stats';

interface RootStateWithStats {
  stats: StatsState;
  battleCreatures: {
    playerCreatures: { id: string }[];
    enemyCreatures: { id: string }[];
  };
}

export const statsListenerMiddleware = createListenerMiddleware();

// ── Persist stats to localStorage after any stats action ──
statsListenerMiddleware.startListening({
  matcher: isAnyOf(
    statsActions.recordRunStart,
    statsActions.recordRunSuccess,
    statsActions.recordRunFailure,
    statsActions.grantUnlock,
    statsActions.grantUnlockBatch,
    statsActions.recordEnemyDefeat,
    statsActions.recordEnemyDefeatBatch,
    statsActions.addDamageDealt,
    statsActions.addDamageReceived,
    statsActions.addHealingDone,
    statsActions.incrementCardsPlayed,
    statsActions.incrementTurnsTaken,
    statsActions.recordBattleWon,
    statsActions.recordBattleLost,
    statsActions.addGoldSpent,
    statsActions.resetStats,
  ),
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootStateWithStats;
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(state.stats));
  },
});

// ── Auto-track damage dealt / received ──
statsListenerMiddleware.startListening({
  actionCreator: battleCreaturesState.damageCreature,
  effect: (action, listenerApi) => {
    const { creatureId, amount } = action.payload;
    const state = listenerApi.getState() as RootStateWithStats;
    const isEnemy = state.battleCreatures.enemyCreatures.some(c => c.id === creatureId);
    if (isEnemy) {
      listenerApi.dispatch(statsActions.addDamageDealt(amount));
    } else {
      listenerApi.dispatch(statsActions.addDamageReceived(amount));
    }
  },
});

// ── Auto-track healing ──
statsListenerMiddleware.startListening({
  actionCreator: battleCreaturesState.healCreature,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(statsActions.addHealingDone(action.payload.amount));
  },
});

// ── Auto-track gold spent ──
statsListenerMiddleware.startListening({
  actionCreator: inventoryActions.spendGold,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(statsActions.addGoldSpent(action.payload));
  },
});

// ── Check unlock conditions after relevant stats mutations ──
statsListenerMiddleware.startListening({
  matcher: isAnyOf(
    statsActions.recordEnemyDefeat,
    statsActions.recordEnemyDefeatBatch,
    statsActions.recordRunFailure,
    statsActions.addGoldSpent,
  ),
  effect: (_action, listenerApi) => {
    const { stats } = listenerApi.getState() as RootStateWithStats;
    const totalDefeated = Object.values(stats.enemyDefeats)
      .reduce((sum, r) => sum + r.totalDefeats, 0);

    for (const entry of unlockableCreatures) {
      // Skip already unlocked
      if (stats.unlocks[entry.unlock.id]) continue;

      let met = false;
      switch (entry.condition.type) {
        case 'defeat_enemies':
          met = totalDefeated >= (entry.condition.threshold ?? 0);
          break;
        case 'spend_gold':
          met = stats.combat.totalGoldSpent >= (entry.condition.threshold ?? 0);
          break;
        case 'lose_run':
          met = stats.runs.failedRuns >= 1;
          break;
        // defeat_first_boss is handled directly at the victory site
      }

      if (met) {
        listenerApi.dispatch(statsActions.grantUnlock(entry.unlock));
      }
    }
  },
});
