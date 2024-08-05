import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../index'

export const selectFightState = (state: RootState) => state.enemy

export const playerFightStateSelector = createSelector(selectFightState, (fightState) => fightState.player)

export const battleStateSelector = createSelector(selectFightState, (fightState) => fightState.battle, )

export const playerHandSelector = createSelector( playerFightStateSelector, (player) => player.hand)