import { PlayingCard } from '../../types/card';
import { PlayerCreature, EnemyCreature } from '../../types/creature';
import { TargetingMode } from '../../redux/slices/Battle/battleSlice';
import { getSummonTemplate } from '../../data/summonRegistry';

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

  // Summon cards target an empty cell in the appropriate zone
  if (effects.summon) {
    const template = getSummonTemplate(effects.summon as string);
    if (template) {
      return {
        mode: template.zone === 'ally' ? 'ally_cell' : 'enemy_cell',
        validTargetIds: [],
      };
    }
  }

  // Cards that modify an action target a specific creature
  if (card.modifyAction) {
    return {
      mode: 'ally_creature',
      validTargetIds: [card.modifyAction.creatureId],
    };
  }

  // AOE cards always use cell targeting (auto-inferred)
  if (effects.aoeDamage) {
    return {
      mode: 'enemy_cell',
      validTargetIds: [],
    };
  }

  // Damage cards target enemy creatures
  if (effects.damage) {
    return {
      mode: 'enemy_creature',
      validTargetIds: aliveEnemyIds,
    };
  }

  // Heal and addBlock cards target ally creatures
  if (effects.heal || effects.addBlock) {
    return {
      mode: 'ally_creature',
      validTargetIds: alivePlayerIds,
    };
  }

  // Push cards target enemy creatures
  if (effects.pushDistance) {
    return {
      mode: 'enemy_creature',
      validTargetIds: aliveEnemyIds,
    };
  }

  // Line damage targets an enemy zone cell (player picks which row to fire down)
  if (effects.lineDamage) {
    return {
      mode: 'enemy_cell',
      validTargetIds: [],
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
