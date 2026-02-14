import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayerCreature, EnemyCreature, StatusEffect, CreatureAction } from '../../../types/creature';
import { PLAYER_START_POSITIONS, ENEMY_START_POSITIONS } from '../../../Layers/01_Fight/gridConstants';

export interface BattleCreaturesState {
  playerCreatures: PlayerCreature[];
  enemyCreatures: EnemyCreature[];
}

const initState: BattleCreaturesState = {
  playerCreatures: [],
  enemyCreatures: [],
};

// Helper to find a creature in either array and apply a mutation
function findAndMutate(
  state: BattleCreaturesState,
  creatureId: string,
  mutate: (creature: PlayerCreature | EnemyCreature) => void
) {
  const pc = state.playerCreatures.find(c => c.id === creatureId);
  if (pc) { mutate(pc); return; }
  const ec = state.enemyCreatures.find(c => c.id === creatureId);
  if (ec) { mutate(ec); }
}

export const battleCreaturesSlice = createSlice({
  name: 'battleCreatures',
  initialState: initState,
  reducers: {
    loadPlayerCreatures: (state, action: PayloadAction<PlayerCreature[]>) => {
      state.playerCreatures = action.payload.map((c, index) => ({
        ...c,
        currentAction: { ...c.defaultAction },
        gridPosition: PLAYER_START_POSITIONS[index] ?? { col: 2, row: 3 + index },
      }));
    },
    loadEnemyCreatures: (state, action: PayloadAction<EnemyCreature[]>) => {
      state.enemyCreatures = action.payload.map((c, index) => ({
        ...c,
        gridPosition: ENEMY_START_POSITIONS[index] ?? { col: 7, row: 3 + index },
      }));
    },
    clearBattleCreatures: (state) => {
      state.playerCreatures = [];
      state.enemyCreatures = [];
    },

    // === Generic creature operations ===

    damageCreature: (state, action: PayloadAction<{ creatureId: string; amount: number }>) => {
      findAndMutate(state, action.payload.creatureId, (creature) => {
        let remaining = action.payload.amount;
        // Block absorbs damage first
        if (creature.block > 0) {
          const blocked = Math.min(creature.block, remaining);
          creature.block -= blocked;
          remaining -= blocked;
        }
        creature.currentHp = Math.max(0, creature.currentHp - remaining);
        if (creature.currentHp <= 0) {
          creature.isAlive = false;
        }
      });
    },
    healCreature: (state, action: PayloadAction<{ creatureId: string; amount: number }>) => {
      findAndMutate(state, action.payload.creatureId, (creature) => {
        creature.currentHp = Math.min(creature.maxHp, creature.currentHp + action.payload.amount);
      });
    },
    addBlock: (state, action: PayloadAction<{ creatureId: string; amount: number }>) => {
      findAndMutate(state, action.payload.creatureId, (creature) => {
        creature.block += action.payload.amount;
      });
    },
    resetAllBlock: (state) => {
      for (const c of state.playerCreatures) c.block = 0;
      for (const c of state.enemyCreatures) c.block = 0;
    },

    // === Player creature action management ===

    setCreatureAction: (state, action: PayloadAction<{ creatureId: string; action: CreatureAction }>) => {
      const creature = state.playerCreatures.find(c => c.id === action.payload.creatureId);
      if (creature) {
        creature.currentAction = action.payload.action;
      }
    },
    resetAllCreatureActions: (state) => {
      for (const creature of state.playerCreatures) {
        creature.currentAction = { ...creature.defaultAction };
      }
    },

    // === Enemy pattern ===

    advanceEnemyPattern: (state, action: PayloadAction<string>) => {
      const enemy = state.enemyCreatures.find(c => c.id === action.payload);
      if (enemy) {
        enemy.patternIndex = (enemy.patternIndex + 1) % enemy.pattern.length;
      }
    },

    // === Status effects (stubbed for later implementation) ===

    applyStatusEffect: (state, action: PayloadAction<{ creatureId: string; effect: StatusEffect }>) => {
      findAndMutate(state, action.payload.creatureId, (creature) => {
        const effect = action.payload.effect;
        // Determine if buff or debuff by type
        const debuffTypes = ['weakness', 'vulnerability', 'poison', 'slow', 'stun'];
        if (debuffTypes.includes(effect.type)) {
          creature.debuffs.push(effect);
        } else {
          creature.buffs.push(effect);
        }
      });
    },
    removeStatusEffect: (state, action: PayloadAction<{ creatureId: string; effectId: string }>) => {
      findAndMutate(state, action.payload.creatureId, (creature) => {
        creature.buffs = creature.buffs.filter(b => b.id !== action.payload.effectId);
        creature.debuffs = creature.debuffs.filter(d => d.id !== action.payload.effectId);
      });
    },
    tickAllStatusEffects: (state) => {
      const tickCreature = (creature: PlayerCreature | EnemyCreature) => {
        creature.buffs = creature.buffs
          .map(b => ({ ...b, duration: b.duration === -1 ? -1 : b.duration - 1 }))
          .filter(b => b.duration !== 0);
        creature.debuffs = creature.debuffs
          .map(d => ({ ...d, duration: d.duration === -1 ? -1 : d.duration - 1 }))
          .filter(d => d.duration !== 0);
      };
      for (const c of state.playerCreatures) tickCreature(c);
      for (const c of state.enemyCreatures) tickCreature(c);
    },
  },
});

export const battleCreaturesState = battleCreaturesSlice.actions;

export default battleCreaturesSlice.reducer;
