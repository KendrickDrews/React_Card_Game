import { AudioSettings, DEFAULT_AUDIO_SETTINGS, SfxId, MusicTrackId } from './audioTypes';
import { sfxRegistry, musicRegistry } from './audioRegistry';

const STORAGE_KEY = 'slay-the-browser-audio';
const CROSSFADE_DURATION = 1.5;

class AudioEngine {
  private static instance: AudioEngine;

  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  private bufferCache = new Map<string, AudioBuffer>();
  private pendingFetches = new Map<string, Promise<AudioBuffer | null>>();
  private currentMusicSource: AudioBufferSourceNode | null = null;
  private currentMusicTrack: MusicTrackId | null = null;

  private settings: AudioSettings;

  private constructor() {
    this.settings = this.loadSettings();
  }

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  /** Lazily create AudioContext and wire gain nodes */
  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();

      this.masterGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();

      this.sfxGain.connect(this.masterGain);
      this.musicGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.applyGainValues();
    }
    return this.ctx;
  }

  /** Resume suspended AudioContext (mobile autoplay policy) */
  unlock() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /** Fetch + decode audio, caching results and deduplicating concurrent fetches */
  private async loadBuffer(url: string): Promise<AudioBuffer | null> {
    if (this.bufferCache.has(url)) {
      return this.bufferCache.get(url)!;
    }

    if (this.pendingFetches.has(url)) {
      return this.pendingFetches.get(url)!;
    }

    const promise = (async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const arrayBuffer = await response.arrayBuffer();
        const ctx = this.ensureContext();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        this.bufferCache.set(url, audioBuffer);
        return audioBuffer;
      } catch {
        return null;
      } finally {
        this.pendingFetches.delete(url);
      }
    })();

    this.pendingFetches.set(url, promise);
    return promise;
  }

  /** Play a one-shot SFX */
  async playSfx(sfxId: SfxId) {
    if (this.settings.masterMuted || this.settings.sfxMuted) return;

    const url = sfxRegistry[sfxId];
    if (!url) return;

    const buffer = await this.loadBuffer(url);
    if (!buffer) return;

    const ctx = this.ensureContext();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.sfxGain!);
    source.start();
  }

  /** Play background music with crossfade */
  async playMusic(trackId: MusicTrackId) {
    if (trackId === this.currentMusicTrack) return;
    this.currentMusicTrack = trackId;

    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    // Fade out current music
    if (this.currentMusicSource) {
      const oldSource = this.currentMusicSource;
      const fadeOutGain = ctx.createGain();
      fadeOutGain.gain.setValueAtTime(1, now);
      fadeOutGain.gain.linearRampToValueAtTime(0, now + CROSSFADE_DURATION);

      oldSource.disconnect();
      oldSource.connect(fadeOutGain);
      fadeOutGain.connect(this.musicGain!);

      setTimeout(() => {
        try { oldSource.stop(); } catch { /* already stopped */ }
        fadeOutGain.disconnect();
      }, CROSSFADE_DURATION * 1000 + 100);

      this.currentMusicSource = null;
    }

    if (trackId === 'silence') return;

    const url = musicRegistry[trackId];
    if (!url) return;

    const buffer = await this.loadBuffer(url);
    if (!buffer) return;

    // Guard against race: if track changed while loading, bail
    if (this.currentMusicTrack !== trackId) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const fadeInGain = ctx.createGain();
    fadeInGain.gain.setValueAtTime(0, ctx.currentTime);
    fadeInGain.gain.linearRampToValueAtTime(1, ctx.currentTime + CROSSFADE_DURATION);

    source.connect(fadeInGain);
    fadeInGain.connect(this.musicGain!);
    source.start();

    this.currentMusicSource = source;
  }

  /** Update settings from Redux state */
  updateSettings(newSettings: Partial<AudioSettings>) {
    Object.assign(this.settings, newSettings);
    this.saveSettings();
    this.applyGainValues();
  }

  /** Eagerly fetch all audio buffers */
  async preloadAll() {
    const urls = [
      ...Object.values(sfxRegistry),
      ...Object.values(musicRegistry),
    ];
    await Promise.all(urls.map(url => this.loadBuffer(url)));
  }

  private applyGainValues() {
    if (!this.masterGain || !this.sfxGain || !this.musicGain) return;

    const masterVol = this.settings.masterMuted ? 0 : this.settings.masterVolume;
    const sfxVol = this.settings.sfxMuted ? 0 : this.settings.sfxVolume;
    const musicVol = this.settings.musicMuted ? 0 : this.settings.musicVolume;

    this.masterGain.gain.value = masterVol;
    this.sfxGain.gain.value = sfxVol;
    this.musicGain.gain.value = musicVol;
  }

  private loadSettings(): AudioSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...DEFAULT_AUDIO_SETTINGS, ...JSON.parse(stored) };
    } catch { /* ignore */ }
    return { ...DEFAULT_AUDIO_SETTINGS };
  }

  private saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch { /* ignore */ }
  }
}

export default AudioEngine;
