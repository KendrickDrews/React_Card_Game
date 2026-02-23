import { SlotItem, SlotItemRarity } from '../types/slotItem';
import { Artifact } from '../types/inventory';
import { getRandomSlotItems } from './slotItemRegistry';
import { getRandomArtifacts, ArtifactTemplate, artifactTemplates } from './artifactRegistry';

export interface ShopSlotItem {
  item: SlotItem;
  price: number;
}

export interface ShopArtifact {
  artifact: Artifact;
  price: number;
  rarity: string;
}

export interface ShopInventory {
  slotItems: ShopSlotItem[];
  artifacts: ShopArtifact[];
}

const PRICE_BY_RARITY: Record<SlotItemRarity, number> = {
  common: 40,
  uncommon: 75,
  rare: 120,
};

const ARTIFACT_PRICE_BY_RARITY: Record<string, number> = {
  common: 50,
  uncommon: 90,
  rare: 150,
};

function getAllowedRarities(progressionScore: number): SlotItemRarity[] {
  // progressionScore ranges from 0 (map 1, node 0) to ~35 (map 3, node 8)
  if (progressionScore < 5) return ['common'];
  if (progressionScore < 12) return ['common', 'uncommon'];
  return ['common', 'uncommon', 'rare'];
}

export function generateShopInventory(mapNumber: number, nodeLevel: number): ShopInventory {
  const progressionScore = (mapNumber - 1) * 9 + nodeLevel;

  const allowedRarities = getAllowedRarities(progressionScore);

  // Generate 3-4 slot items
  const slotItemCount = 3 + (Math.random() > 0.5 ? 1 : 0);
  const slotItems = getRandomSlotItems(slotItemCount, allowedRarities);
  const shopSlotItems: ShopSlotItem[] = slotItems.map(item => ({
    item,
    price: PRICE_BY_RARITY[item.rarity],
  }));

  // Generate 1-2 artifacts
  const artifactCount = 1 + (Math.random() > 0.5 ? 1 : 0);
  const artifactRarities = allowedRarities as string[];
  const artifacts = getRandomArtifacts(artifactCount, artifactRarities);

  const shopArtifacts: ShopArtifact[] = artifacts.map(artifact => {
    // Look up rarity from template
    const template = Object.values(artifactTemplates).find(
      t => artifact.name === t.name
    ) as ArtifactTemplate | undefined;
    const rarity = template?.rarity ?? 'common';
    return {
      artifact,
      price: ARTIFACT_PRICE_BY_RARITY[rarity] ?? 50,
      rarity,
    };
  });

  return { slotItems: shopSlotItems, artifacts: shopArtifacts };
}
