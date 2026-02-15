export interface AudioSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  masterMuted: boolean;
  sfxMuted: boolean;
  musicMuted: boolean;
}

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  masterVolume: 0.7,
  sfxVolume: 0.8,
  musicVolume: 0.5,
  masterMuted: false,
  sfxMuted: false,
  musicMuted: false,
};

export type SfxId =
  | 'attack-hit'
  | 'defend-block'
  | 'heal-chime'
  | 'card-draw'
  | 'card-play'
  | 'card-hover'
  | 'damage-hit'
  | 'ui-click'
  | 'ui-hover'
  | 'victory-jingle'
  | 'defeat-jingle'
  | 'turn-start'
  | 'shuffle';

export type MusicTrackId = 'battle-theme' | 'map-theme' | 'silence';
