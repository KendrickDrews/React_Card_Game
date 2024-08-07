import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { PayloadAction } from '@reduxjs/toolkit';

export interface EnemyState {
  health: number;
  block: number;
  
}
type IncrementalEnemyStates = 'health' | 'block';

export interface IncrementEnemyAction {
  state: IncrementalEnemyStates;
  amount: number;
}

const enemyState: EnemyState = {
  health: 15,
  block: 0
}



export const enemySlice = createSlice({
  name: 'enemy',
  initialState: enemyState,
  reducers: {
    increase: (state, action: PayloadAction<IncrementEnemyAction>) => {
      state[action.payload.state] += action.payload.amount
    },
    decrease: (state, action: PayloadAction<IncrementEnemyAction>) => {
      state[action.payload.state] -= action.payload.amount
    }
  }
})

export const enemy = enemySlice.actions

export default enemySlice.reducer


// decrement: state => {
//   state.value -= 1
// },
// incrementByAmount: (state, action) => {
//   state.value += action.payload
// }