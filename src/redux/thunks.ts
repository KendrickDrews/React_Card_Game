import { AppDispatch } from './store';
import { mapActions } from './slices/Map/mapSlice';
import { battleCreaturesState } from './slices/BattleCreatures/battleCreaturesSlice';
import { playerState } from './slices/Player/playerSlice';
import { battleState } from './slices/Battle/battleSlice';
import { teamActions } from './slices/Team/teamSlice';
import { inventoryActions } from './slices/Inventory/inventorySlice';
import { menuState } from './slices/Menu/menuSlice';

/**
 * Resets all game state slices to their initial values, ready for a new run.
 * Use on defeat or after run completion before returning to the main menu.
 */
export const resetGameForNewRun = () => (dispatch: AppDispatch) => {
  dispatch(mapActions.clearMap());
  dispatch(battleCreaturesState.clearBattleCreatures());
  dispatch(playerState.resetAllPiles());
  dispatch(battleState.clearTargeting());
  dispatch(battleState.setBattleResult('ongoing'));
  dispatch(teamActions.resetRoster());
  dispatch(inventoryActions.resetInventory());
  dispatch(menuState.resetMenu());
};
