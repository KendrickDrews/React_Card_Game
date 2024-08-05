 // Adjust import path as needed
import { battleState, playerState } from '../../redux';
import { RootState } from '../../redux';
import { Action, ThunkAction } from '@reduxjs/toolkit';
import { Deck } from './Deck/Deck'
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, null, Action<string> >;

export const handleBattlePhase = (): AppThunk => (dispatch, getState) => {
  const { battle } = getState().battle;
  console.log("Yoyoyo")

  const defaultDrawAmount = 5

  switch (battle.phase) {
    case 'player_start':
      if (battle.battleStart) {
        dispatch(playerState.loadDeck(Deck));
        dispatch(playerState.shuffleDeckToDraw());
      }
        dispatch(battleState.setBattleStart(false))
      if (battle.shouldDraw) {
        for (let i = 0; i < defaultDrawAmount; i++) {
          dispatch(playerState.drawCard())
        }
        dispatch(battleState.setShouldDraw(false));
      }
      dispatch(battleState.nextBattlePhase());
      break;
    case 'player_active':
      // Maybe do nothing here, as this is when the player takes actions
      dispatch(battleState.setShouldDraw(true))
      break;
    case 'player_end':
      dispatch(battleState.nextBattlePhase());
      break;
    // ... handle other phases
  }
};