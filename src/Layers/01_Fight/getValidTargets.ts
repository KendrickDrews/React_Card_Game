import { PlayingCard } from '../../types/card';
import { PlayerCreature, EnemyCreature } from '../../types/creature';
import { TargetingMode } from '../../redux/slices/Battle/battleSlice';

export interface TargetingInfo {
  mode: TargetingMode;
  validTargetIds: string[];
}

export function getValidTargets(
  card: PlayingCard,
  playerCreatures: PlayerCreature[],
  enemyCreatures: EnemyCreature[]
): TargetingInfo {
  const effects = card.effect;
  const alivePlayerIds = playerCreatures.filter(c => c.isAlive).map(c => c.id);
  const aliveEnemyIds = enemyCreatures.filter(c => c.isAlive).map(c => c.id);

  // Cards that modify an action target a specific creature
  if (card.modifyAction) {
    return {
      mode: 'ally',
      validTargetIds: [card.modifyAction.creatureId],
    };
  }

  // Damage cards target enemies
  if (effects.damage) {
    return {
      mode: 'enemy',
      validTargetIds: aliveEnemyIds,
    };
  }

  // Heal and addBlock cards target allies
  if (effects.heal || effects.addBlock) {
    return {
      mode: 'ally',
      validTargetIds: alivePlayerIds,
    };
  }

  // addMana cards auto-resolve (no targeting needed)
  if (effects.addMana) {
    return {
      mode: 'auto',
      validTargetIds: [],
    };
  }

  // Fallback: no targeting
  return {
    mode: 'none',
    validTargetIds: [],
  };
}
