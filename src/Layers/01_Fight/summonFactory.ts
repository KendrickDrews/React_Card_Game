import { PlayerCreature, EnemyCreature, GridPosition } from '../../types/creature';
import { SummonTemplate } from '../../types/summon';
import { AppDispatch } from '../../redux/store';
import { battleCreaturesState } from '../../redux/slices/BattleCreatures/battleCreaturesSlice';
import { battleState } from '../../redux/slices/Battle/battleSlice';

export function createSummonedPlayerCreature(
  template: SummonTemplate,
  gridPosition: GridPosition
): PlayerCreature {
  return {
    id: `summon-${template.id}-${Date.now()}`,
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
    gridPosition,
    cards: [],
    defaultAction: { ...template.action },
    currentAction: { ...template.action },
    level: 1,
    experience: 0,
    experienceToNextLevel: 0,
    formationPosition: { col: 0, row: 0 },
    equippedSlots: [],
  };
}

/** Dispatches the add-creature and add-to-initiative-queue actions for a summoned creature. */
export function dispatchSummon(dispatch: AppDispatch, summoned: PlayerCreature | EnemyCreature) {
  if (summoned.side === 'player') {
    dispatch(battleCreaturesState.addPlayerCreature(summoned as PlayerCreature));
  } else {
    dispatch(battleCreaturesState.addEnemyCreature(summoned as EnemyCreature));
  }
  dispatch(battleState.addToInitiativeQueue({
    creatureId: summoned.id,
    side: summoned.side,
    initiative: summoned.initiative,
    hasActed: false,
  }));
}

export function createSummonedEnemyCreature(
  template: SummonTemplate,
  gridPosition: GridPosition
): EnemyCreature {
  return {
    id: `summon-${template.id}-${Date.now()}`,
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
    gridPosition,
    pattern: [
      { action: { ...template.action }, intentIcon: 'attack' },
    ],
    patternIndex: 0,
  };
}
