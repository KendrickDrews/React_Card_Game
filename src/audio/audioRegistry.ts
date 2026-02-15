import { SfxId, MusicTrackId } from './audioTypes';

export const sfxRegistry: Record<SfxId, string> = {
  'attack-hit':     '/audio/sfx/attack-hit.wav',
  'defend-block':   '/audio/sfx/defend-block.wav',
  'heal-chime':     '/audio/sfx/heal-chime.wav',
  'card-draw':      '/audio/sfx/card-draw.wav',
  'card-play':      '/audio/sfx/card-play.wav',
  'card-hover':     '/audio/sfx/card-hover.wav',
  'damage-hit':     '/audio/sfx/damage-hit.wav',
  'ui-click':       '/audio/sfx/ui-click.wav',
  'ui-hover':       '/audio/sfx/ui-hover.wav',
  'victory-jingle': '/audio/sfx/victory-jingle.wav',
  'defeat-jingle':  '/audio/sfx/defeat-jingle.wav',
  'turn-start':     '/audio/sfx/turn-start.wav',
  'shuffle':        '/audio/sfx/shuffle.wav',
};

export const musicRegistry: Record<Exclude<MusicTrackId, 'silence'>, string> = {
  'battle-theme': '/audio/music/battle-theme.wav',
  'map-theme':    '/audio/music/map-theme.wav',
};

/** Maps animation names (from setActiveAnimation) to SFX */
export const animationSfxMap: Record<string, SfxId> = {
  'attack':  'attack-hit',
  'defend':  'defend-block',
  'heal':    'heal-chime',
};

/** Maps layer context name to background music track */
export const layerMusicMap: Record<string, MusicTrackId> = {
  'Fight': 'battle-theme',
  'Map':   'map-theme',
  'Menu':  'map-theme',
};
