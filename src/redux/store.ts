import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { fightSlice } from './index'

const rootReducer = combineSlices(
  fightSlice
)
export const store = configureStore({
  reducer: rootReducer
})

export type RootState = ReturnType<typeof store.getState>