import { RootState } from '../../redux/store';
import { battleCreaturesState } from '../../redux/slices/BattleCreatures/battleCreaturesSlice';
import { BattleCreature, CreatureAction, PlayerCreature, EnemyCreature } from '../../types/creature';
import { getSummonTemplate } from '../../data/summonRegistry';
import { PLAYER_ZONE, ENEMY_ZONE } from './gridConstants';
import { battleState } from '../../redux/slices/Battle/battleSlice';
import { getSlotEffectTotal } from './resolveSlotEffects';

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

  // Compute slot item bonuses for player creatures
  const dmgBonus = isPlayerSide ? getSlotEffectTotal(actingCreature as PlayerCreature, 'flat_damage_bonus') : 0;
  const healBonus = isPlayerSide ? getSlotEffectTotal(actingCreature as PlayerCreature, 'flat_heal_bonus') : 0;
  const blockBonus = isPlayerSide ? getSlotEffectTotal(actingCreature as PlayerCreature, 'flat_block_bonus') : 0;

  // Apply effects to each target
  for (const target of targets) {
    if (action.effect.damage) {
      dispatch(battleCreaturesState.damageCreature({
        creatureId: target.id,
        amount: action.effect.damage + dmgBonus,
      }));
    }
    if (action.effect.heal) {
      dispatch(battleCreaturesState.healCreature({
        creatureId: target.id,
        amount: action.effect.heal + healBonus,
      }));
    }
    if (action.effect.addBlock) {
      dispatch(battleCreaturesState.addBlock({
        creatureId: target.id,
        amount: action.effect.addBlock + blockBonus,
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
        const id = `summon-${template.id}-${Date.now()}`;
        if (isPlayerSide) {
          const summoned: PlayerCreature = {
            id,
            speciesId: template.id,
            name: template.name,
            side: 'player',
            maxHp: template.maxHp,
            currentHp: template.maxHp,
            block: 0,
            initiative: template.initiative,
            passive: null,
            buffs: [],
            debuffs: [],
            isAlive: true,
            isSummoned: true,
            spriteId: template.spriteId,
            gridPosition: cell,
            cards: [],
            defaultAction: { ...template.action },
            currentAction: { ...template.action },
            level: 1,
            experience: 0,
            experienceToNextLevel: 0,
            formationPosition: { col: 0, row: 0 },
            equippedSlots: [],
          };
          dispatch(battleCreaturesState.addPlayerCreature(summoned));
          dispatch(battleState.addToInitiativeQueue({
            creatureId: id,
            side: 'player',
            initiative: template.initiative,
            hasActed: false,
          }));
        } else {
          const summoned: EnemyCreature = {
            id,
            speciesId: template.id,
            name: template.name,
            side: 'enemy',
            maxHp: template.maxHp,
            currentHp: template.maxHp,
            block: 0,
            initiative: template.initiative,
            passive: null,
            buffs: [],
            debuffs: [],
            isAlive: true,
            isSummoned: true,
            spriteId: template.spriteId,
            gridPosition: cell,
            pattern: [
              { action: { ...template.action }, intentIcon: 'attack' },
            ],
            patternIndex: 0,
          };
          dispatch(battleCreaturesState.addEnemyCreature(summoned));
          dispatch(battleState.addToInitiativeQueue({
            creatureId: id,
            side: 'enemy',
            initiative: template.initiative,
            hasActed: false,
          }));
        }
      }
    }
  }
}
