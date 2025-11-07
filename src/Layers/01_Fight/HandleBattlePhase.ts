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

  const startOfBattleSetup = () => {
      dispatch(playerState.loadDeck(Deck));
      dispatch(playerState.shuffleDeckToDraw());
      dispatch(battleState.setBattleStart(false))
  }

  const drawHand = async () => {
    for (let i = 0; i < player.drawCount; i++) {
      const currentState = getState();
      if (currentState.player.draw.length === 0) {
        dispatch(playerState.shuffleDiscardToDraw());
        // await delay(0.25); // Add a small delay after shuffling
      }
      if (currentState.player.hand.length >= 10) {
        return
      }
      dispatch(playerState.drawCard());
      await delay(0.5);
    }
    dispatch(battleState.setShouldDraw(false));
  };

  const discardhand = async () => {
    for (let i = player.hand.length - 1; i >= 0; i--) {
      dispatch(playerState.toggleCardDiscardProperty({id: player.hand[i].id, discard: true}))
      await delay(.5 * (1/player.hand.length))
    }
  }

  switch (battle.phase) {
    case 'player_start': 
      if (battle.battleStart) {
        startOfBattleSetup()
      }
      if (battle.shouldDraw) {
        await drawHand()
      }
      await delay(0.25)
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
      await delay(0.25)
      
      dispatch(battleState.nextBattlePhase());
      break;
    case 'enemy_start':
      console.log("Enemy Start");
      await delay(0.25)
      dispatch(battleState.nextBattlePhase());
      break;
    case 'enemy_active':
      console.log("Enemy Active");
      dispatch(playerState.decrease({state: "health", amount: 1}))
      await delay(0.25)
      dispatch(battleState.nextBattlePhase());
      break;
    case 'enemy_end':
      console.log("Enemy End");
      await delay(0.25)
      dispatch(battleState.increaseTurn())
      dispatch(battleState.nextBattlePhase());
      break;
    // ... handle other phases
  }
};