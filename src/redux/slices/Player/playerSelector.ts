import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../index'

export const selectPlayerState = (state: RootState) => state.player

export const playerStateSelector = createSelector(selectPlayerState, (player) => player.player)
