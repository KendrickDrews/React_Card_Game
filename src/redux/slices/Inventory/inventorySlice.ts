import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Artifact } from '../../../types/inventory';
import { SlotItem } from '../../../types/slotItem';

export interface InventoryState {
  gold: number;
  artifacts: Artifact[];
  neutralCards: string[];
  slotItems: SlotItem[];
}

const initInventoryState: InventoryState = {
  gold: 0,
  artifacts: [],
  neutralCards: [],
  slotItems: [],
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState: initInventoryState,
  reducers: {
    addGold: (state, action: PayloadAction<number>) => {
      state.gold += action.payload;
    },
    spendGold: (state, action: PayloadAction<number>) => {
      state.gold = Math.max(0, state.gold - action.payload);
    },
    addArtifact: (state, action: PayloadAction<Artifact>) => {
      state.artifacts.push(action.payload);
    },
    removeArtifact: (state, action: PayloadAction<string>) => {
      state.artifacts = state.artifacts.filter(a => a.id !== action.payload);
    },
    addNeutralCard: (state, action: PayloadAction<string>) => {
      state.neutralCards.push(action.payload);
    },
    removeNeutralCard: (state, action: PayloadAction<string>) => {
      const idx = state.neutralCards.indexOf(action.payload);
      if (idx !== -1) state.neutralCards.splice(idx, 1);
    },
    addSlotItem: (state, action: PayloadAction<SlotItem>) => {
      state.slotItems.push(action.payload);
    },
    removeSlotItem: (state, action: PayloadAction<string>) => {
      state.slotItems = state.slotItems.filter(i => i.instanceId !== action.payload);
    },
    resetInventory: () => initInventoryState,
  },
});

export const inventoryActions = inventorySlice.actions;

export default inventorySlice.reducer;
