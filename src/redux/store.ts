import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { battleSlice, enemySlice, playerSlice } from './index'
import { createLogger } from 'redux-logger'

const rootReducer = combineSlices( battleSlice, playerSlice, enemySlice)

const logger = createLogger({
  collapsed: true, // This ensures logs are collapsed by default
  // You can add more options here if needed
})

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch