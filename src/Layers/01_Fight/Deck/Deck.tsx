export const Deck = [ // Creature cards
    {
      title: "Goblin Scout",
      type: "Creature",
      manaCost: 1,
      value: 1,
      description: "Haste: This creature can attack immediately."
    },
    {
      title: "Elven Archer",
      type: "Creature",
      manaCost: 2,
      value: 2,
      description: "When this creature enters the battlefield, deal 1 damage to target creature."
    },
    {
      title: "Stone Golem",
      type: "Creature",
      manaCost: 4,
      value: 4,
      description: "Defender: This creature can't attack."
    },
    
    // Spell cards
    {
      title: "Fireball",
      type: "Spell",
      manaCost: 3,
      description: "Deal 3 damage to any target."
    },
    {
      title: "Healing Light",
      type: "Spell",
      manaCost: 2,
      description: "Gain 4 life."
    },
    
    // Enchantment cards
    {
      title: "Nature's Blessing",
      type: "Enchantment",
      manaCost: 3,
      description: "At the beginning of your upkeep, gain 1 life."
    },
    
    // Artifact cards
    {
      title: "Mana Crystal",
      type: "Artifact",
      manaCost: 2,
      description: "Tap: Add one mana of any color to your mana pool."
    },
    
    // Land cards (typically don't have mana cost)
    {
      title: "Forest",
      type: "Land",
      description: "Tap: Add one green mana to your mana pool."
    },
    
    // Cards without all properties filled
    {
      title: "Mysterious Mist",
      type: "Spell",
      description: "The effects of this spell are unknown until cast."
    },
    {
      title: "Shapeshifter",
      type: "Creature",
      manaCost: 3,
    }];