import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { battleSlice, playerSlice } from './index'

const rootReducer = combineSlices(
  battleSlice, playerSlice
)
export const store = configureStore({
  reducer: rootReducer
})

export type RootState = ReturnType<typeof store.getState>