 // Adjust import path as needed
import { battleState, playerState } from '../../redux';
import { RootState } from '../../redux';
import { Action, ThunkAction } from '@reduxjs/toolkit';
import { Deck } from './Deck/Deck'
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action >;

export const handleBattlePhase = (): AppThunk => (dispatch, getState) => {
  const { battle, player } = getState();

  const drawAtStartOfBattle = () => {
      dispatch(playerState.loadDeck(Deck));
      dispatch(playerState.shuffleDeckToDraw());
      dispatch(battleState.setBattleStart(false))
  }
  const drawHand = () => {
    for (let i = 0; i < player.drawCount; i++) {
      if (player.draw.length == 0  ) {
        dispatch(playerState.shuffleDiscardToDraw())
      }
      dispatch(playerState.drawCard())
    }
    dispatch(battleState.setShouldDraw(false));
  }

  switch (battle.phase) {
    case 'player_start': 
      if (battle.battleStart) {
        drawAtStartOfBattle()
      }
      if (battle.shouldDraw) {
        drawHand()
      }
      dispatch(battleState.nextBattlePhase());
      break;
    case 'player_active':
      
      // Maybe do nothing here, as this is when the player takes actions
      dispatch(battleState.setShouldDraw(true))
      break;
    case 'player_end':
      console.log("Player End");
      if (battle.activeCard) {
        dispatch(battleState.setActiveCard("none"))
      }
      if (player.hand.length > 0) {
        for (let i =0; i < player.hand.length ; i++) {
          dispatch(playerState.discardCard())
        }
      }
      dispatch(battleState.nextBattlePhase());
      break;
    case 'enemy_start':
      console.log("Enemy Start");
      dispatch(battleState.nextBattlePhase());
      break;
    case 'enemy_active':
      console.log("Enemy Active");
      dispatch(battleState.nextBattlePhase());
      break;
    case 'enemy_end':
      console.log("Enemy End");
      dispatch(battleState.nextBattlePhase());
      break;
    // ... handle other phases
  }
};