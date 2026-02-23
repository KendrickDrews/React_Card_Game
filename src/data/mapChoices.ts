import { MapChoice } from '../types/map';

const mapThemes: MapChoice[] = [
  { id: 'dark-forest', label: 'The Dark Forest', description: 'Twisted trees and lurking shadows.' },
  { id: 'crystal-caves', label: 'Crystal Caves', description: 'Shimmering tunnels filled with strange light.' },
  { id: 'scorched-plains', label: 'Scorched Plains', description: 'Sun-baked earth and relentless heat.' },
  { id: 'frozen-peaks', label: 'Frozen Peaks', description: 'Ice-covered mountains and howling winds.' },
  { id: 'sunken-ruins', label: 'Sunken Ruins', description: 'Ancient stone halls half-claimed by the sea.' },
  { id: 'fungal-depths', label: 'Fungal Depths', description: 'Bioluminescent spores drift through vast caverns.' },
];

export function generateMapChoices(_upcomingMapNumber: number): MapChoice[] {
  const shuffled = [...mapThemes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}
