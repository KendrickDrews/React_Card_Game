import { PlayingCard } from "../../../types/card";

export const Deck = [
  {
      title: "Goblin Scout",
      type: "Creature",
      manaCost: 1,
      value: 1,
      description: "Haste: This creature can attack immediately.",
      effect: { damage: 1 }
  },
  {
      title: "Elven Archer",
      type: "Creature",
      manaCost: 2,
      value: 2,
      description: "When this creature enters the battlefield, deal 1 damage to target creature.",
      effect: { damage: 1}
  },
  {
      title: "Stone Golem",
      type: "Creature",
      manaCost: 4,
      value: 4,
      description: "Defender: This creature can't attack.",
      effect: { damage: 5 }
  },
  {
      title: "Fireball",
      type: "Spell",
      manaCost: 3,
      value: 4,
      description: "Deal 3 damage to any target.",
      effect: { damage: 3 }
  },
  {
      title: "Healing Light",
      type: "Spell",
      manaCost: 2,
      value: 4,
      description: "Gain 4 life.",
      effect: { heal: 4 }
  },
  {
      title: "Nature's Blessing",
      type: "Enchantment",
      manaCost: 3,
      value: 4,
      description: "At the beginning of your upkeep, gain 1 life.",
      effect: { heal: 1 }
  },
  {
      title: "Mana Crystal",
      type: "Artifact",
      manaCost: 2,
      value: 4,
      description: "Tap: Add one mana of any color to your mana pool.",
      effect: { addMana: 1 }
  },
  {
      title: "Forest",
      type: "Land",
      manaCost: 2,
      value: 4,
      description: "Tap: Add one green mana to your mana pool.",
      effect: { addMana: 1 }
  },
  {
      title: "Mysterious Mist",
      type: "Spell",
      manaCost: 2,
      value: 4,
      description: "The effects of this spell are unknown until cast.",
      effect: { damage: 1 }
  },
  {
      title: "Shapeshifter",
      type: "Creature",
      manaCost: 3,
      value: 4,
      description: "The effects of this spell are unknown until cast.",
      effect: { heal: 4 }
  }
] as PlayingCard[]