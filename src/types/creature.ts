// === Status Effects (types defined, logic stubbed for later) ===

export type BuffType = 'strength' | 'defense' | 'haste' | 'regeneration' | 'thorns';
export type DebuffType = 'weakness' | 'vulnerability' | 'poison' | 'slow' | 'stun';
export type StatusEffectType = BuffType | DebuffType;

export interface StatusEffect {
  id: string;
  type: StatusEffectType;
  value: number;
  duration: number; // turns remaining, -1 = permanent
  sourceCreatureId: string;
}

// === Passive Abilities (types defined, logic stubbed for later) ===

export type PassiveTrigger =
  | 'on_turn_start'
  | 'on_turn_end'
  | 'on_take_damage'
  | 'on_deal_damage'
  | 'on_ally_death'
  | 'on_enemy_death'
  | 'on_card_played';

export interface PassiveAbilityEffect {
  damage?: number;
  heal?: number;
  addBlock?: number;
  applyBuff?: { type: BuffType; value: number; duration: number };
  applyDebuff?: { type: DebuffType; value: number; duration: number };
  drawCards?: number;
  addMana?: number;
}

export interface PassiveAbility {
  id: string;
  name: string;
  description: string;
  trigger: PassiveTrigger;
  effect: PassiveAbilityEffect;
}

// === Creature Actions ===

export type ActionTargetType =
  | 'self'
  | 'single_enemy'
  | 'all_enemies'
  | 'single_ally'
  | 'all_allies'
  | 'random_enemy';

export interface CreatureActionEffect {
  damage?: number;
  heal?: number;
  addBlock?: number;
  applyBuff?: { type: BuffType; value: number; duration: number };
  applyDebuff?: { type: DebuffType; value: number; duration: number };
}

export interface CreatureAction {
  id: string;
  name: string;
  description: string;
  targetType: ActionTargetType;
  effect: CreatureActionEffect;
}

// === Grid Position ===

export interface GridPosition {
  col: number; // 0-9, left to right
  row: number; // 0-9, top to bottom
}

// === Base Creature (shared between player and enemy) ===

export interface BaseCreature {
  id: string;
  speciesId: string;
  name: string;
  maxHp: number;
  currentHp: number;
  block: number;
  initiative: number; // higher = acts first
  passive: PassiveAbility | null;
  buffs: StatusEffect[];
  debuffs: StatusEffect[];
  isAlive: boolean;
  spriteId: string;
  gridPosition?: GridPosition; // assigned at battle load time
}

// === Player Creature ===

export interface PlayerCreature extends BaseCreature {
  side: 'player';
  cards: string[];           // card IDs this creature contributes to the deck
  defaultAction: CreatureAction;
  currentAction: CreatureAction; // starts as defaultAction, cards can modify
  level: number;
  experience: number;
  experienceToNextLevel: number;
  formationPosition: GridPosition; // position within the player zone grid, maps directly to battlefield
}

// === Enemy Creature ===

export interface EnemyPatternStep {
  action: CreatureAction;
  intentIcon: string; // UI hint for next action: 'attack', 'defend', 'buff', etc.
}

export interface EnemyCreature extends BaseCreature {
  side: 'enemy';
  pattern: EnemyPatternStep[];
  patternIndex: number;
}

// === Species Template ===

export interface CreatureSpecies {
  speciesId: string;
  name: string;
  description: string;
  maxHp: number;
  initiative: number;
  spriteId: string;
  cards: string[];
  defaultAction: CreatureAction;
  passive: PassiveAbility | null;
}

// === Union & Initiative ===

export type BattleCreature = PlayerCreature | EnemyCreature;

export interface InitiativeEntry {
  creatureId: string;
  side: 'player' | 'enemy';
  initiative: number;
  hasActed: boolean;
}
