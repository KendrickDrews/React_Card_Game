import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../index'

export const selectBattleState = (state: RootState) => state.battle
export const activeCardSelector = createSelector(selectBattleState, (battle) => battle.activeCard)
