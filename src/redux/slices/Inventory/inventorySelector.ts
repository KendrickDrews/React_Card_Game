import { RootState } from '../../index';

export const selectGold = (state: RootState) => state.inventory.gold;
export const selectArtifacts = (state: RootState) => state.inventory.artifacts;
export const selectNeutralCards = (state: RootState) => state.inventory.neutralCards;
