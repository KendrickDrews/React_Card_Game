import { combineSlices, configureStore } from '@reduxjs/toolkit'
import {counterSlice} from './index'

const rootReducer = combineSlices(
  counterSlice
)
export const store = configureStore({
  reducer: rootReducer
})

export type RootState = ReturnType<typeof store.getState>