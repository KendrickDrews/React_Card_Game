import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MenuScreen = 'main' | 'runConfig' | 'bestiary' | 'options' | 'stats';
export type Difficulty = 'normal' | 'hard' | 'nightmare';

export interface RunConfig {
  level: number;
  difficulty: Difficulty;
  ascension: number;
}

// Formation grid: 3 cols × 5 rows (mirrors player zone on battlefield)
// Key format: "col,row" where col 0-2, row 0-4
export const FORMATION_COLS = 3;
export const FORMATION_ROWS = 5;
export const MAX_TEAM_SIZE = 4;

export interface MenuState {
  screen: MenuScreen;
  runConfig: RunConfig;
  draftFormation: Record<string, string>; // "col,row" -> speciesId
  selectedSpeciesId: string | null;
}

const initMenuState: MenuState = {
  screen: 'main',
  runConfig: { level: 1, difficulty: 'normal', ascension: 0 },
  draftFormation: {},
  selectedSpeciesId: null,
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState: initMenuState,
  reducers: {
    setScreen: (state, action: PayloadAction<MenuScreen>) => {
      state.screen = action.payload;
    },
    setSelectedSpecies: (state, action: PayloadAction<string | null>) => {
      state.selectedSpeciesId = action.payload;
    },
    assignSpeciesToCell: (state, action: PayloadAction<{ col: number; row: number; speciesId: string }>) => {
      const { col, row, speciesId } = action.payload;
      const key = `${col},${row}`;
      // Remove species from any other cell (no duplicates)
      for (const [k, v] of Object.entries(state.draftFormation)) {
        if (v === speciesId) delete state.draftFormation[k];
      }
      state.draftFormation[key] = speciesId;
    },
    removeFromCell: (state, action: PayloadAction<{ col: number; row: number }>) => {
      const key = `${action.payload.col},${action.payload.row}`;
      delete state.draftFormation[key];
    },
    swapCells: (state, action: PayloadAction<{ from: { col: number; row: number }; to: { col: number; row: number } }>) => {
      const fromKey = `${action.payload.from.col},${action.payload.from.row}`;
      const toKey = `${action.payload.to.col},${action.payload.to.row}`;
      const fromSpecies = state.draftFormation[fromKey] ?? null;
      const toSpecies = state.draftFormation[toKey] ?? null;
      if (fromSpecies) {
        state.draftFormation[toKey] = fromSpecies;
      } else {
        delete state.draftFormation[toKey];
      }
      if (toSpecies) {
        state.draftFormation[fromKey] = toSpecies;
      } else {
        delete state.draftFormation[fromKey];
      }
    },
    clearDraftFormation: (state) => {
      state.draftFormation = {};
    },
    setRunConfigLevel: (state, action: PayloadAction<number>) => {
      state.runConfig.level = action.payload;
    },
    setRunConfigDifficulty: (state, action: PayloadAction<Difficulty>) => {
      state.runConfig.difficulty = action.payload;
    },
    setRunConfigAscension: (state, action: PayloadAction<number>) => {
      state.runConfig.ascension = action.payload;
    },
    resetMenu: (state) => {
      state.screen = 'main';
      state.runConfig = { level: 1, difficulty: 'normal', ascension: 0 };
      state.draftFormation = {};
      state.selectedSpeciesId = null;
    },
  },
});

export const menuState = menuSlice.actions;

export default menuSlice.reducer;
