 // Adjust import path as needed
import { battleState, playerState } from '../../redux';
import { RootState } from '../../redux';
import { Action, ThunkAction } from '@reduxjs/toolkit';
import { Deck } from './Deck/Deck'
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action >;

export const handleBattlePhase = (): AppThunk => async (dispatch, getState) => {
  
  const { battle, player } = getState();
  // Utility for waiting by MS
  const delay = (seconds: number) => new Promise(resolve => setTimeout(resolve, (seconds * 1000)));

  const drawAtStartOfBattle = () => {
      dispatch(playerState.loadDeck(Deck));
      dispatch(playerState.shuffleDeckToDraw());
      dispatch(battleState.setBattleStart(false))
  }

  const drawHand = async () => {
    for (let i = 0; i < player.drawCount; i++) {
      if (player.draw.length === 0) {
        dispatch(playerState.shuffleDiscardToDraw());
        // Optional: Add a delay after shuffling
        // await delay(.25);
      }
      dispatch(playerState.drawCard());
      // Wait for 1 second before the next iteration
      await delay(.5);
    }
    dispatch(battleState.setShouldDraw(false));
  };
  const discardhand = async () => {
    for (let i = player.hand.length - 1; i >= 0; i--) {
      dispatch(playerState.toggleCardDiscardProperty({id: player.hand[i].id, discard: true}))
      await delay(.25)
    }
  }

  switch (battle.phase) {
    case 'player_start': 
      if (battle.battleStart) {
        drawAtStartOfBattle()
      }
      if (battle.shouldDraw) {
        await drawHand()
      }
      dispatch(battleState.nextBattlePhase());
      break;
    case 'player_active':
      // Maybe do nothing here, as this is when the player takes actions
      
      
      break;
    case 'player_end':

      console.log("Player End");
      dispatch(battleState.setShouldDraw(true))

      if (battle.activeCard) {
        dispatch(battleState.setActiveCard("none"))
      }
      if (player.hand.length > 0) {
        await discardhand()
      }
      
      dispatch(battleState.nextBattlePhase());
      break;
    case 'enemy_start':
      console.log("Enemy Start");
      dispatch(battleState.nextBattlePhase());
      break;
    case 'enemy_active':
      console.log("Enemy Active");
      dispatch(playerState.decrease({state: "health", amount: 1}))
      dispatch(battleState.nextBattlePhase());
      break;
    case 'enemy_end':
      console.log("Enemy End");
      dispatch(battleState.increaseTurn())
      dispatch(battleState.nextBattlePhase());
      break;
    // ... handle other phases
  }
};