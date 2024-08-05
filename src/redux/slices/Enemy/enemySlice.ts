import { createSlice } from '@reduxjs/toolkit';
// import { PayloadAction } from '@reduxjs/toolkit';

export interface EnemyState {
  
}


const enemyState: EnemyState = {
  enemy: {

  }
}



export const enemySlice = createSlice({
  name: 'enemy',
  initialState: enemyState,
  reducers: {
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