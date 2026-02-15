import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudioSettings, DEFAULT_AUDIO_SETTINGS } from '../../../audio/audioTypes';

const STORAGE_KEY = 'slay-the-browser-audio';

function loadInitialState(): AudioSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_AUDIO_SETTINGS, ...JSON.parse(stored) };
  } catch { /* ignore */ }
  return { ...DEFAULT_AUDIO_SETTINGS };
}

export const audioSlice = createSlice({
  name: 'audio',
  initialState: loadInitialState(),
  reducers: {
    setMasterVolume: (state, action: PayloadAction<number>) => {
      state.masterVolume = action.payload;
    },
    setSfxVolume: (state, action: PayloadAction<number>) => {
      state.sfxVolume = action.payload;
    },
    setMusicVolume: (state, action: PayloadAction<number>) => {
      state.musicVolume = action.payload;
    },
    toggleMasterMute: (state) => {
      state.masterMuted = !state.masterMuted;
    },
    toggleSfxMute: (state) => {
      state.sfxMuted = !state.sfxMuted;
    },
    toggleMusicMute: (state) => {
      state.musicMuted = !state.musicMuted;
    },
  },
});

export const audioState = audioSlice.actions;

export default audioSlice.reducer;
