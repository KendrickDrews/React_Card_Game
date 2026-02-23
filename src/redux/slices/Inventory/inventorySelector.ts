import { RootState } from '../../index';

export const selectGold = (state: RootState) => state.inventory.gold;
export const selectArtifacts = (state: RootState) => state.inventory.artifacts;
export const selectNeutralCards = (state: RootState) => state.inventory.neutralCards;
export const selectSlotItems = (state: RootState) => state.inventory.slotItems;
export const selectRemovedCards = (state: RootState) => state.inventory.removedCards;
export const selectUpgradedCards = (state: RootState) => state.inventory.upgradedCards;
export const selectCardRemoveCount = (state: RootState) => state.inventory.cardRemoveCount;
export const selectCardUpgradeCount = (state: RootState) => state.inventory.cardUpgradeCount;
