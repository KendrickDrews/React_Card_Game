import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { battleSlice, playerSlice } from './index'
import logger from 'redux-logger'

const rootReducer = combineSlices(
  battleSlice, playerSlice
)
export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch