import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GridPosition, PlayerCreature } from '../../../types/creature';

export interface TeamState {
  roster: PlayerCreature[];
  activeTeam: string[]; // creature IDs in the battle party
}

const initTeamState: TeamState = {
  roster: [],
  activeTeam: [],
};

export const teamSlice = createSlice({
  name: 'team',
  initialState: initTeamState,
  reducers: {
    addCreatureToRoster: (state, action: PayloadAction<PlayerCreature>) => {
      state.roster.push(action.payload);
    },
    removeCreatureFromRoster: (state, action: PayloadAction<string>) => {
      state.roster = state.roster.filter(c => c.id !== action.payload);
      state.activeTeam = state.activeTeam.filter(id => id !== action.payload);
    },
    setActiveTeam: (state, action: PayloadAction<string[]>) => {
      state.activeTeam = action.payload;
    },
    addCreatureToActiveTeam: (state, action: PayloadAction<string>) => {
      if (!state.activeTeam.includes(action.payload)) {
        state.activeTeam.push(action.payload);
      }
    },
    removeCreatureFromActiveTeam: (state, action: PayloadAction<string>) => {
      state.activeTeam = state.activeTeam.filter(id => id !== action.payload);
    },
    gainExperience: (state, action: PayloadAction<{ creatureId: string; amount: number }>) => {
      const creature = state.roster.find(c => c.id === action.payload.creatureId);
      if (creature) {
        creature.experience += action.payload.amount;
      }
    },
    levelUp: (state, action: PayloadAction<string>) => {
      const creature = state.roster.find(c => c.id === action.payload);
      if (creature && creature.experience >= creature.experienceToNextLevel) {
        creature.experience -= creature.experienceToNextLevel;
        creature.level += 1;
        creature.experienceToNextLevel = Math.floor(creature.experienceToNextLevel * 1.5);
        creature.maxHp += 2;
        creature.currentHp = creature.maxHp;
      }
    },
    resetRoster: (state) => {
      state.roster = [];
      state.activeTeam = [];
    },
    syncFromBattle: (state, action: PayloadAction<{ id: string; currentHp: number; isAlive: boolean }[]>) => {
      for (const update of action.payload) {
        const creature = state.roster.find(c => c.id === update.id);
        if (creature) {
          creature.currentHp = update.currentHp;
          creature.isAlive = update.isAlive;
        }
      }
    },
    healTeamByPercent: (state, action: PayloadAction<number>) => {
      const percent = action.payload;
      for (const creature of state.roster) {
        if (creature.isAlive) {
          const healAmount = Math.floor(creature.maxHp * (percent / 100));
          creature.currentHp = Math.min(creature.currentHp + healAmount, creature.maxHp);
        }
      }
    },
    fullyHealTeam: (state) => {
      for (const creature of state.roster) {
        creature.currentHp = creature.maxHp;
        creature.isAlive = true;
        creature.block = 0;
        creature.buffs = [];
        creature.debuffs = [];
      }
    },
    updateFormationPosition: (state, action: PayloadAction<{ creatureId: string; formationPosition: GridPosition }>) => {
      const creature = state.roster.find(c => c.id === action.payload.creatureId);
      if (creature) {
        creature.formationPosition = action.payload.formationPosition;
      }
    },
    swapActiveCreature: (state, action: PayloadAction<{ activeId: string; reserveId: string }>) => {
      const { activeId, reserveId } = action.payload;
      const active = state.roster.find(c => c.id === activeId);
      const reserve = state.roster.find(c => c.id === reserveId);
      if (!active || !reserve) return;

      // Reserve inherits the departing creature's formation position
      reserve.formationPosition = { ...active.formationPosition };

      // Swap in active team array
      state.activeTeam = state.activeTeam.map(id => id === activeId ? reserveId : id);
    },
  },
});

export const teamActions = teamSlice.actions;

export default teamSlice.reducer;
