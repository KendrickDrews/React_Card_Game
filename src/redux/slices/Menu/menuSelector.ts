import { RootState } from '../../store';
import { creatureSpecies } from '../../../data/creatureRegistry';
import { CreatureSpecies } from '../../../types/creature';

export const selectMenuScreen = (state: RootState) => state.menu.screen;
export const selectRunConfig = (state: RootState) => state.menu.runConfig;
export const selectDraftFormation = (state: RootState) => state.menu.draftFormation;
export const selectSelectedSpecies = (state: RootState) => state.menu.selectedSpeciesId;

export const selectDraftFormationFull = (state: RootState): Record<string, CreatureSpecies> => {
  const result: Record<string, CreatureSpecies> = {};
  for (const [key, speciesId] of Object.entries(state.menu.draftFormation)) {
    const species = creatureSpecies[speciesId];
    if (species) result[key] = species;
  }
  return result;
};

export const selectDraftTeamCount = (state: RootState): number =>
  Object.keys(state.menu.draftFormation).length;

export const selectCanStartRun = (state: RootState): boolean =>
  Object.keys(state.menu.draftFormation).length > 0;
