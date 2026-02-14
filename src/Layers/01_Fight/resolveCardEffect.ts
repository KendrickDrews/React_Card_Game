import { AppDispatch, RootState } from '../../redux/store';
import { PlayingCard } from '../../types/card';
import { battleCreaturesState } from '../../redux/slices/BattleCreatures/battleCreaturesSlice';
import { playerState } from '../../redux/slices/Player/playerSlice';

export function resolveCardEffect(
  dispatch: AppDispatch,
  card: PlayingCard,
  targetCreatureId: string | null,
  getState: () => RootState
) {
  const effects = card.effect;
  const state = getState();

  for (const [key, value] of Object.entries(effects)) {
    switch (key) {
      case 'damage': {
        // Target a specific creature or default to first alive enemy
        const target = targetCreatureId
          ?? state.battleCreatures.enemyCreatures.find(c => c.isAlive)?.id;
        if (target) {
          dispatch(battleCreaturesState.damageCreature({
            creatureId: target,
            amount: value as number,
          }));
        }
        break;
      }

      case 'heal': {
        // Use targeted creature, fallback to card owner, then first alive player creature
        const healTarget = targetCreatureId
          ?? state.battleCreatures.playerCreatures.find(c => c.id === card.creatureId && c.isAlive)?.id
          ?? state.battleCreatures.playerCreatures.find(c => c.isAlive)?.id;
        if (healTarget) {
          dispatch(battleCreaturesState.healCreature({
            creatureId: healTarget,
            amount: value as number,
          }));
        }
        break;
      }

      case 'addMana': {
        dispatch(playerState.increase({ state: 'mana', amount: value as number }));
        break;
      }

      case 'addBlock': {
        // Use targeted creature, fallback to card owner, then first alive player creature
        const blockTarget = targetCreatureId
          ?? state.battleCreatures.playerCreatures.find(c => c.id === card.creatureId && c.isAlive)?.id
          ?? state.battleCreatures.playerCreatures.find(c => c.isAlive)?.id;
        if (blockTarget) {
          dispatch(battleCreaturesState.addBlock({
            creatureId: blockTarget,
            amount: value as number,
          }));
        }
        break;
      }
    }
  }

  // Handle modifyAction if present
  if (card.modifyAction) {
    dispatch(battleCreaturesState.setCreatureAction({
      creatureId: card.modifyAction.creatureId,
      action: card.modifyAction.action,
    }));
  }
}
