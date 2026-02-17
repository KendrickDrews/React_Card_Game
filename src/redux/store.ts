import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { battleSlice, playerSlice, teamSlice, battleCreaturesSlice, mapSlice, audioSlice, menuSlice, inventorySlice, statsSlice } from './index'
import { audioListenerMiddleware } from '../audio'
import { statsListenerMiddleware } from './statsListenerMiddleware'
import { createLogger } from 'redux-logger'

const rootReducer = combineSlices(battleSlice, playerSlice, teamSlice, battleCreaturesSlice, mapSlice, audioSlice, menuSlice, inventorySlice, statsSlice)

const logger = createLogger({
  collapsed: true,
})

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(audioListenerMiddleware.middleware, statsListenerMiddleware.middleware).concat(logger),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
