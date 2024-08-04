import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../index'

export const selectFightState = (state: RootState) => state.fight

export const playerFightStateSelector = createSelector(selectFightState, (fightState) => fightState.player, )
export const playerHandSelector = createSelector( playerFightStateSelector, (player) => player.hand)