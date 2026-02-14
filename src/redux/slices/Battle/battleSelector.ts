import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../index'

export const selectBattleState = (state: RootState) => state.battle
export const activeCardSelector = createSelector(selectBattleState, (battle) => battle.activeCard)
export const selectInitiativeQueue = createSelector(selectBattleState, (battle) => battle.initiativeQueue)
export const selectCurrentInitiativeIndex = createSelector(selectBattleState, (battle) => battle.currentInitiativeIndex)
export const selectIsInitiativeResolving = createSelector(selectBattleState, (battle) => battle.isInitiativeResolving)
export const selectBattleResult = createSelector(selectBattleState, (battle) => battle.battleResult)
export const selectTargetingMode = createSelector(selectBattleState, (battle) => battle.targetingMode)
export const selectValidTargetIds = createSelector(selectBattleState, (battle) => battle.validTargetIds)
