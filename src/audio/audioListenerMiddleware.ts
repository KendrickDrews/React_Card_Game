import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { battleState } from '../redux/slices/Battle/battleSlice';
import { playerState } from '../redux/slices/Player/playerSlice';
import { battleCreaturesState } from '../redux/slices/BattleCreatures/battleCreaturesSlice';
import { audioState } from '../redux/slices/Audio/audioSlice';
import { animationSfxMap } from './audioRegistry';
import AudioEngine from './AudioEngine';
import type { SfxId } from './audioTypes';

export const audioListenerMiddleware = createListenerMiddleware();

const engine = () => AudioEngine.getInstance();

// Creature animations → mapped SFX
audioListenerMiddleware.startListening({
  actionCreator: battleState.setActiveAnimation,
  effect: (action) => {
    const sfxId = animationSfxMap[action.payload.animationName];
    if (sfxId) engine().playSfx(sfxId);
  },
});

// Damage dealt
audioListenerMiddleware.startListening({
  actionCreator: battleCreaturesState.damageCreature,
  effect: () => { engine().playSfx('damage-hit'); },
});

// Healing
audioListenerMiddleware.startListening({
  actionCreator: battleCreaturesState.healCreature,
  effect: () => { engine().playSfx('heal-chime'); },
});

// Block gained
audioListenerMiddleware.startListening({
  actionCreator: battleCreaturesState.addBlock,
  effect: () => { engine().playSfx('defend-block'); },
});

// Card drawn
audioListenerMiddleware.startListening({
  actionCreator: playerState.drawCard,
  effect: () => { engine().playSfx('card-draw'); },
});

// Card played (discarded from hand after use)
audioListenerMiddleware.startListening({
  actionCreator: playerState.discardSpecificCard,
  effect: () => { engine().playSfx('card-play'); },
});

// Shuffle discard into draw
audioListenerMiddleware.startListening({
  actionCreator: playerState.shuffleDiscardToDraw,
  effect: () => { engine().playSfx('shuffle'); },
});

// Battle result: victory or defeat
audioListenerMiddleware.startListening({
  actionCreator: battleState.setBattleResult,
  effect: (action) => {
    if (action.payload === 'victory') {
      engine().playMusic('silence');
      engine().playSfx('victory-jingle');
    } else if (action.payload === 'defeat') {
      engine().playMusic('silence');
      engine().playSfx('defeat-jingle');
    }
  },
});

// Turn start
audioListenerMiddleware.startListening({
  actionCreator: battleState.setBattlePhase,
  effect: (action) => {
    if (action.payload === 'turn_start') {
      engine().playSfx('turn-start');
    }
  },
});

// Sync Redux audio settings → AudioEngine
audioListenerMiddleware.startListening({
  matcher: isAnyOf(
    audioState.setMasterVolume,
    audioState.setSfxVolume,
    audioState.setMusicVolume,
    audioState.toggleMasterMute,
    audioState.toggleSfxMute,
    audioState.toggleMusicMute,
  ),
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as { audio: import('./audioTypes').AudioSettings };
    engine().updateSettings(state.audio);
  },
});
