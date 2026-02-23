import { AppDispatch, RootState } from '../../redux/store';
import { battleCreaturesState } from '../../redux/slices/BattleCreatures/battleCreaturesSlice';
import { BattleCreature, CreatureAction, PlayerCreature } from '../../types/creature';
import { getSummonTemplate } from '../../data/summonRegistry';
import { PLAYER_ZONE, ENEMY_ZONE } from './gridConstants';
import { getCreatureBonuses } from './resolveSlotEffects';
import { createSummonedPlayerCreature, createSummonedEnemyCreature, dispatchSummon } from './summonFactory';

function findEmptyCell(
  state: ReturnType<() => RootState>['battleCreatures'],
  zone: { colMin: number; colMax: number; rowMin: number; rowMax: number }
): { col: number; row: number } | null {
  const occupied = new Set<string>();
  for (const c of [...state.playerCreatures, ...state.enemyCreatures]) {
    if (c.gridPosition) occupied.add(`${c.gridPosition.col},${c.gridPosition.row}`);
  }
  for (let col = zone.colMin; col <= zone.colMax; col++) {
    for (let row = zone.rowMin; row <= zone.rowMax; row++) {
      if (!occupied.has(`${col},${row}`)) return { col, row };
    }
  }
  return null;
}

export function resolveCreatureAction(
  dispatch: AppDispatch,
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

  // Compute slot item bonuses for player creatures
  const bonuses = isPlayerSide ? getCreatureBonuses(actingCreature as PlayerCreature) : { dmg: 0, heal: 0, block: 0 };

  // Apply effects to each target
  for (const target of targets) {
    if (action.effect.damage) {
      dispatch(battleCreaturesState.damageCreature({
        creatureId: target.id,
        amount: action.effect.damage + bonuses.dmg,
      }));
    }
    if (action.effect.heal) {
      dispatch(battleCreaturesState.healCreature({
        creatureId: target.id,
        amount: action.effect.heal + bonuses.heal,
      }));
    }
    if (action.effect.addBlock) {
      dispatch(battleCreaturesState.addBlock({
        creatureId: target.id,
        amount: action.effect.addBlock + bonuses.block,
      }));
    }
  }

  // Handle summon effect
  if (action.effect.summon) {
    const template = getSummonTemplate(action.effect.summon);
    if (template) {
      const bcState = getState().battleCreatures;
      const zone = isPlayerSide ? PLAYER_ZONE : ENEMY_ZONE;
      const cell = findEmptyCell(bcState, zone);
      if (cell) {
        if (isPlayerSide) {
          dispatchSummon(dispatch, createSummonedPlayerCreature(template, cell));
        } else {
          dispatchSummon(dispatch, createSummonedEnemyCreature(template, cell));
        }
      }
    }
  }
}
