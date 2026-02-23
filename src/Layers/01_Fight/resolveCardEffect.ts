import { AppDispatch, RootState } from '../../redux/store';
import { PlayingCard } from '../../types/card';
import { battleCreaturesState } from '../../redux/slices/BattleCreatures/battleCreaturesSlice';
import { playerState } from '../../redux/slices/Player/playerSlice';
import { scanRowForTarget, getCreaturesInAoe, executePush, parseAoeShape } from './battleHelpers';
import { getSummonTemplate } from '../../data/summonRegistry';
import { getCreatureBonuses } from './resolveSlotEffects';
import { createSummonedPlayerCreature, dispatchSummon } from './summonFactory';

export function resolveCardEffect(
  dispatch: AppDispatch,
  card: PlayingCard,
  targetCreatureId: string | null,
  getState: () => RootState
) {
  const effects = card.effect;
  const state = getState();

  // Compute slot item bonuses for the creature that owns this card
  let dmgBonus = 0;
  let healBonus = 0;
  let blockBonus = 0;
  if (card.creatureId !== 'neutral') {
    const ownerCreature = state.battleCreatures.playerCreatures.find(c => c.id === card.creatureId);
    if (ownerCreature) {
      const bonuses = getCreatureBonuses(ownerCreature);
      dmgBonus = bonuses.dmg;
      healBonus = bonuses.heal;
      blockBonus = bonuses.block;
    }
  }

  // Processing order: damage → heal → addMana → addBlock → aoeDamage → lineDamage → pushDistance

  // ── damage ──
  if (effects.damage !== undefined) {
    const target = targetCreatureId
      ?? state.battleCreatures.enemyCreatures.find(c => c.isAlive)?.id;
    if (target) {
      dispatch(battleCreaturesState.damageCreature({
        creatureId: target,
        amount: effects.damage + dmgBonus,
      }));
    }
  }

  // ── heal ──
  if (effects.heal !== undefined) {
    // If the card also deals damage, the clicked target is an enemy — heal the card's owner instead
    const healTarget = (effects.damage === undefined ? targetCreatureId : null)
      ?? state.battleCreatures.playerCreatures.find(c => c.id === card.creatureId && c.isAlive)?.id
      ?? state.battleCreatures.playerCreatures.find(c => c.isAlive)?.id;
    if (healTarget) {
      dispatch(battleCreaturesState.healCreature({
        creatureId: healTarget,
        amount: effects.heal + healBonus,
      }));
    }
  }

  // ── addMana ──
  if (effects.addMana !== undefined) {
    dispatch(playerState.increase({ state: 'mana', amount: effects.addMana }));
  }

  // ── addBlock ──
  if (effects.addBlock !== undefined) {
    const blockTarget = targetCreatureId
      ?? state.battleCreatures.playerCreatures.find(c => c.id === card.creatureId && c.isAlive)?.id
      ?? state.battleCreatures.playerCreatures.find(c => c.isAlive)?.id;
    if (blockTarget) {
      dispatch(battleCreaturesState.addBlock({
        creatureId: blockTarget,
        amount: effects.addBlock + blockBonus,
      }));
    }
  }

  // ── aoeDamage (paired with aoeShape) ──
  if (effects.aoeDamage !== undefined && effects.aoeShape !== undefined) {
    const shape = parseAoeShape(effects.aoeShape);
    // Use targeted cell position, fall back to creature position for backwards compat
    const allCreatures = [...state.battleCreatures.playerCreatures, ...state.battleCreatures.enemyCreatures];
    const targetPos = state.battle.targetPosition
      ?? (targetCreatureId ? allCreatures.find(c => c.id === targetCreatureId)?.gridPosition : undefined);

    if (targetPos) {
      const hitCreatures = getCreaturesInAoe(
        state.battleCreatures,
        targetPos,
        shape
      );
      for (const creature of hitCreatures) {
        if (creature.isAlive) {
          dispatch(battleCreaturesState.damageCreature({
            creatureId: creature.id,
            amount: effects.aoeDamage + dmgBonus,
          }));
        }
      }
    }
  }

  // ── lineDamage ──
  if (effects.lineDamage !== undefined) {
    const targetRow = state.battle.targetPosition?.row;
    if (targetRow !== undefined) {
      // Find first alive enemy in the targeted row (leftmost col = closest to player)
      const enemy = state.battleCreatures.enemyCreatures
        .filter(c => c.isAlive && c.gridPosition?.row === targetRow)
        .sort((a, b) => (a.gridPosition?.col ?? 0) - (b.gridPosition?.col ?? 0))[0];
      if (enemy) {
        dispatch(battleCreaturesState.damageCreature({
          creatureId: enemy.id,
          amount: effects.lineDamage + dmgBonus,
        }));
      }
    } else {
      // Fall back to row scan from source creature
      const hit = scanRowForTarget(state.battleCreatures, card.creatureId);
      if (hit && hit.creature.isAlive) {
        dispatch(battleCreaturesState.damageCreature({
          creatureId: hit.creature.id,
          amount: effects.lineDamage + dmgBonus,
        }));
      }
    }
  }

  // ── pushDistance (paired with pushDirection) — push last so damage resolves first ──
  if (effects.pushDistance !== undefined && effects.pushDirection !== undefined) {
    const pushTarget = targetCreatureId
      ?? state.battleCreatures.enemyCreatures.find(c => c.isAlive)?.id;
    if (pushTarget) {
      executePush(
        dispatch,
        getState,
        pushTarget,
        effects.pushDirection,
        effects.pushDistance
      );
    }
  }

  // Handle modifyAction if present
  if (card.modifyAction) {
    dispatch(battleCreaturesState.setCreatureAction({
      creatureId: card.modifyAction.creatureId,
      action: card.modifyAction.action,
    }));
  }

  // ── summon ──
  if (effects.summon !== undefined) {
    const template = getSummonTemplate(effects.summon as string);
    const targetPos = state.battle.targetPosition;
    if (template && targetPos) {
      // Verify cell is unoccupied
      const allCreatures = [...state.battleCreatures.playerCreatures, ...state.battleCreatures.enemyCreatures];
      const occupied = allCreatures.some(
        c => c.gridPosition && c.gridPosition.col === targetPos.col && c.gridPosition.row === targetPos.row
      );
      if (!occupied) {
        dispatchSummon(dispatch, createSummonedPlayerCreature(template, targetPos));
      }
    }
  }
}
