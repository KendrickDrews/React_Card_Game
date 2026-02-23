import { Artifact } from '../types/inventory';

export interface ArtifactTemplate {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare';
  spriteId: string;
}

let artifactCounter = 0;

export const artifactTemplates: Record<string, ArtifactTemplate> = {
  'lucky-coin': {
    id: 'lucky-coin',
    name: 'Lucky Coin',
    description: 'Gain 15% more gold from battles.',
    rarity: 'common',
    spriteId: 'lucky-coin',
  },
  'old-map': {
    id: 'old-map',
    name: 'Old Map',
    description: 'Reveal all paths on the map.',
    rarity: 'common',
    spriteId: 'old-map',
  },
  'war-drum': {
    id: 'war-drum',
    name: 'War Drum',
    description: 'All creatures gain +1 initiative.',
    rarity: 'uncommon',
    spriteId: 'war-drum',
  },
  'crystal-ball': {
    id: 'crystal-ball',
    name: 'Crystal Ball',
    description: 'See enemy intents one turn ahead.',
    rarity: 'uncommon',
    spriteId: 'crystal-ball',
  },
  'phoenix-feather': {
    id: 'phoenix-feather',
    name: 'Phoenix Feather',
    description: 'Once per battle, revive a fallen creature with 1 HP.',
    rarity: 'rare',
    spriteId: 'phoenix-feather',
  },
};

export function instantiateArtifact(templateId: string): Artifact {
  const template = artifactTemplates[templateId];
  if (!template) throw new Error(`Unknown artifact template: ${templateId}`);
  artifactCounter++;
  return {
    id: `artifact-${templateId}-${artifactCounter}-${Date.now()}`,
    name: template.name,
    description: template.description,
    spriteId: template.spriteId,
  };
}

export function getRandomArtifacts(count: number, rarityFilter?: string[]): Artifact[] {
  const pool = Object.values(artifactTemplates).filter(
    t => !rarityFilter || rarityFilter.includes(t.rarity)
  );
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(t => instantiateArtifact(t.id));
}
