const fs = require('fs');
const path = require('path');

function makeWav(filename, freq = 440, durationMs = 200, sampleRate = 22050, volume = 0.3) {
  const numSamples = Math.floor(sampleRate * durationMs / 1000);
  const dataSize = numSamples * 2;
  const buf = Buffer.alloc(44 + dataSize);

  // RIFF header
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE', 8);
  // fmt chunk
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);   // PCM
  buf.writeUInt16LE(1, 22);   // mono
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  // data chunk
  buf.write('data', 36);
  buf.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const env = Math.min(1, i / (sampleRate * 0.01)) * Math.min(1, (numSamples - i) / (sampleRate * 0.01));
    const val = Math.round(volume * env * 32767 * Math.sin(2 * Math.PI * freq * t));
    buf.writeInt16LE(Math.max(-32768, Math.min(32767, val)), 44 + i * 2);
  }

  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, buf);
  console.log(`  Created ${filename}`);
}

console.log('Generating SFX...');
const sfx = {
  'attack-hit':     [300, 150],
  'defend-block':   [200, 200],
  'heal-chime':     [600, 300],
  'card-draw':      [500, 100],
  'card-play':      [400, 120],
  'card-hover':     [700, 50],
  'damage-hit':     [150, 200],
  'ui-click':       [800, 60],
  'ui-hover':       [900, 40],
  'victory-jingle': [550, 800],
  'defeat-jingle':  [200, 800],
  'turn-start':     [350, 250],
  'shuffle':        [250, 300],
};

for (const [name, [freq, dur]] of Object.entries(sfx)) {
  makeWav(`public/audio/sfx/${name}.wav`, freq, dur);
}

console.log('Generating music...');
makeWav('public/audio/music/battle-theme.wav', 220, 2000, 22050, 0.15);
makeWav('public/audio/music/map-theme.wav', 330, 2000, 22050, 0.15);

console.log('Done! 15 audio files generated.');
