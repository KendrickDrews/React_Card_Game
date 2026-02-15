import { RootState } from '../../store';

export const selectAudioSettings = (state: RootState) => state.audio;
export const selectMasterVolume = (state: RootState) => state.audio.masterVolume;
export const selectSfxVolume = (state: RootState) => state.audio.sfxVolume;
export const selectMusicVolume = (state: RootState) => state.audio.musicVolume;
export const selectMasterMuted = (state: RootState) => state.audio.masterMuted;
export const selectSfxMuted = (state: RootState) => state.audio.sfxMuted;
export const selectMusicMuted = (state: RootState) => state.audio.musicMuted;
