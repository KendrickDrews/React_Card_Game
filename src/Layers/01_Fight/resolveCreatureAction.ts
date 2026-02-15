import { RootState } from '../../redux/store';
import { battleCreaturesState } from '../../redux/slices/BattleCreatures/battleCreaturesSlice';
import { BattleCreature, CreatureAction } from '../../types/creature';

export function resolveCreatureAction(
  dispatch: (action: any) => void,
  getState: () => RootState,
  actingCreature: BattleCreature,
  action: CreatureAction
) {
  const state = getState().battleCreatures;
  const isPlayerSide = actingCreature.side === 'player';

  // Determine targets based on targetType
  let targets: BattleCreature[] = [];

  switch (action.targetType) {
    case 'self':
      targets = [actingCreature];
      break;

    case 'single_enemy': {
      const enemies = isPlayerSide
        ? state.enemyCreatures.filter(c => c.isAlive)
        : state.playerCreatures.filter(c => c.isAlive);
      if (enemies.length > 0) targets = [enemies[Math.floor(Math.random() * enemies.length)]];
      break;
    }

    case 'all_enemies': {
      targets = isPlayerSide
        ? state.enemyCreatures.filter(c => c.isAlive)
        : state.playerCreatures.filter(c => c.isAlive);
      break;
    }

    case 'single_ally': {
      const allies = isPlayerSide
        ? state.playerCreatures.filter(c => c.isAlive && c.id !== actingCreature.id)
        : state.enemyCreatures.filter(c => c.isAlive && c.id !== actingCreature.id);
      if (allies.length > 0) targets = [allies[Math.floor(Math.random() * allies.length)]];
      break;
    }

    case 'all_allies': {
      targets = isPlayerSide
        ? state.playerCreatures.filter(c => c.isAlive)
        : state.enemyCreatures.filter(c => c.isAlive);
      break;
    }

    case 'random_enemy': {
      const enemies = isPlayerSide
        ? state.enemyCreatures.filter(c => c.isAlive)
        : state.playerCreatures.filter(c => c.isAlive);
      if (enemies.length > 0) {
        targets = [enemies[Math.floor(Math.random() * enemies.length)]];
      }
      break;
    }
  }

  // Apply effects to each target
  for (const target of targets) {
    if (action.effect.damage) {
      dispatch(battleCreaturesState.damageCreature({
        creatureId: target.id,
        amount: action.effect.damage,
      }));
    }
    if (action.effect.heal) {
      dispatch(battleCreaturesState.healCreature({
        creatureId: target.id,
        amount: action.effect.heal,
      }));
    }
    if (action.effect.addBlock) {
      dispatch(battleCreaturesState.addBlock({
        creatureId: target.id,
        amount: action.effect.addBlock,
      }));
    }
  }
}
