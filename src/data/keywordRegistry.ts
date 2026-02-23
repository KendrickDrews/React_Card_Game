export interface KeywordDefinition {
  name: string;
  description: string;
}

// Keys are lowercase. Longer entries (e.g. "weakness") are matched before
// shorter ones (e.g. "weak") because KeywordText sorts by key length desc.
export const KEYWORD_REGISTRY: Record<string, KeywordDefinition> = {
  // ── Core mechanics ──
  block: {
    name: 'Block',
    description: 'Absorbs incoming damage before HP is lost. All Block is removed at the start of each turn.',
  },
  damage: {
    name: 'Damage',
    description: "Reduces a target's current HP. Block absorbs damage first.",
  },
  heal: {
    name: 'Heal',
    description: "Restores HP to the target, up to their maximum.",
  },
  hp: {
    name: 'HP',
    description: 'Hit Points. When a creature reaches 0 HP, it is defeated.',
  },
  mana: {
    name: 'Mana',
    description: 'Resource used to play cards. Fully replenishes at the start of each turn.',
  },
  initiative: {
    name: 'Initiative',
    description: 'Determines action order each turn. Higher Initiative acts earlier.',
  },

  // ── Targeting / area types ──
  aoe: {
    name: 'AOE',
    description: 'Area of Effect — hits all creatures in the target area simultaneously.',
  },
  summon: {
    name: 'Summon',
    description: 'Places a new creature on the battlefield to fight for you.',
  },

  // ── Push (multiple surface forms) ──
  pushing: {
    name: 'Push',
    description: 'Moves the target creature in the specified direction on the grid.',
  },
  pushes: {
    name: 'Push',
    description: 'Moves the target creature in the specified direction on the grid.',
  },
  push: {
    name: 'Push',
    description: 'Moves the target creature in the specified direction on the grid.',
  },

  // ── Buffs ──
  strength: {
    name: 'Strength',
    description: 'Each stack increases damage dealt by 1.',
  },
  defense: {
    name: 'Defense',
    description: 'Each stack reduces damage taken by 1.',
  },
  haste: {
    name: 'Haste',
    description: 'Increases Initiative, causing the creature to act earlier in the turn order.',
  },
  regeneration: {
    name: 'Regeneration',
    description: 'Restores HP equal to its stacks at the start of each turn.',
  },
  thorns: {
    name: 'Thorns',
    description: 'Reflects damage equal to its stacks back to attackers when this creature is hit.',
  },

  // ── Debuffs ──
  vulnerability: {
    name: 'Vulnerability',
    description: 'Target takes 50% more damage from all sources.',
  },
  weakness: {
    name: 'Weakness',
    description: 'Reduces damage dealt by the afflicted creature by 25%.',
  },
  poison: {
    name: 'Poison',
    description: 'Deals damage equal to its stacks at the start of each turn, then decreases by 1.',
  },
  slow: {
    name: 'Slow',
    description: 'Decreases Initiative, causing the creature to act later in the turn order.',
  },
  stun: {
    name: 'Stun',
    description: "Causes the target to skip their next action in the initiative phase.",
  },
};
