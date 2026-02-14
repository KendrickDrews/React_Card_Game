import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { battleSlice, playerSlice, teamSlice, battleCreaturesSlice, mapSlice } from './index'
import { createLogger } from 'redux-logger'

const rootReducer = combineSlices(battleSlice, playerSlice, teamSlice, battleCreaturesSlice, mapSlice)

const logger = createLogger({
  collapsed: true,
})

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
