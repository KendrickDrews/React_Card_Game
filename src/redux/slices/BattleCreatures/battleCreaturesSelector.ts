import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../index';

export const selectBattleCreatures = (state: RootState) => state.battleCreatures;

export const selectPlayerCreatures = createSelector(
  selectBattleCreatures,
  (s) => s.playerCreatures
);

export const selectEnemyCreatures = createSelector(
  selectBattleCreatures,
  (s) => s.enemyCreatures
);

export const selectAlivePlayerCreatures = createSelector(
  selectPlayerCreatures,
  (creatures) => creatures.filter(c => c.isAlive)
);

export const selectAliveEnemyCreatures = createSelector(
  selectEnemyCreatures,
  (creatures) => creatures.filter(c => c.isAlive)
);

export const selectAllAliveCreatures = createSelector(
  selectAlivePlayerCreatures,
  selectAliveEnemyCreatures,
  (player, enemy) => [...player, ...enemy]
);

export const selectCreatureById = (id: string) => createSelector(
  selectBattleCreatures,
  (s) => [...s.playerCreatures, ...s.enemyCreatures].find(c => c.id === id)
);
