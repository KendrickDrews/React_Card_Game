import  PlayerHand  from "./Deck/PlayerHand"
import cricket from '../../assets/Cricket_R.png'
import sun from '../../assets/Sun_R.png'
import { useState } from "react"
import { PlayingCard } from "../../types/card";

interface LayerContext {
  layerContext: string;
  setLayerContext: (value: string) => void;
}

const FightLayer= ({layerContext, setLayerContext}: LayerContext) => {

  const phases = ["player_start","player_active","player_end","enemy_start","enemy_active","enemy_end"];
  const [activePhase, setActivePhase] = useState(phases[0]);
  const [turn, setTurn] = useState(0);

  const baseDrawAmount = 5;

  const deck = [ // Creature cards
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

  const draw: PlayingCard[] = [];
  const hand: PlayingCard[] = [];
  // const discard: unknown[] = [];

  function shuffleDeckIntoDraw() {
    const shuffledDeck = shuffleCards(deck)
    shuffledDeck.map(item => draw.push(item));
  }

  function shuffleCards(array: PlayingCard[]) {
    // Create a copy of the original array
    const shuffled = [...array];

    // Perform Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  function drawCards(drawNumber: number, modifiers = 0) {
    for (let i = 0; i < drawNumber + modifiers; i++) {
      if (draw.length - 1 < 0) {
        // shuffleDiscard()
        return
      }
      hand.push(draw[0])
      draw.shift()
    }
  }


    if (activePhase === "player_start") {
      console.log("its player Start")
      if (turn === 0) {
        shuffleDeckIntoDraw()
      }
      // set Mana to max
      // Apply Buffs
      // Remove leftover Block
      // Remove buffs that remove
      // Do on Turn Start damage
      // Draw Cards
      // shuffleDraw();
      drawCards(baseDrawAmount);
      // setActivePhase(phases[1]) // Functions are happening out of order
    }
    // Might be unnecessary since its when users do stuff
    if (activePhase === "player_active") {
      // Set things to clickable
      console.log("It's the player turn!")
    }

    if (activePhase === "player_end") {
      // Player End of Turn FX
      setActivePhase(phases[3])
    }
    if (activePhase === "enemy_start") {
      // Enemy Buffs
      // remove last turns block
      
      // decrement debuffs
      // On turn Start Damage
      setActivePhase(phases[4])
    }
    if (activePhase === "enemy_active") {
      // Enemy Attack
      setActivePhase(phases[5])
    }
    if (activePhase === "enemy_end") {
      // Enemy Debuffs
      // decrement buffs
      // 
      setTurn(turn + 1)
      setActivePhase(phases[0])
    }

    function endTurn() {
      // Make it so nothing is clickable (maybe few things clickable)
      // decrement buffs on player
      // Discard cards
      // Discard FX
      setActivePhase(phases[2])
    }


  return (
    <div className={`layer-01-container ${layerContext !== 'Fight' ? 'layer-hidden' : ''}`}>
      <div className="run-info">
        <div className="info-character">
          <div> character_Name</div>
          <div> health</div>
          <div> Gold</div>
        </div>
        <div className="info-floor"> Current Floor </div>
        <div className="info-system"> 
          <div onClick={() => setLayerContext("Map")}> Map </div>
          <div> deck</div>
          <div> controls</div>
        </div>
      </div>
      <div className="artifact-bar"></div>
      <div className="battle-stations">
        <div className="station-player">
          <div className="unit">
            <img width="500" style={{aspectRatio: "auto 150 / 108"}} src={cricket} />
          </div>
        </div>
        <div className="station-enemy">
          <div className="unit">
            <img width="500" style={{aspectRatio: "auto 150 / 108", transform: "scaleX(-1)"}} src={sun} /></div>
        </div>
      </div>
      <div className="card-area">
        <div className="draw-and-mana"></div>
        <PlayerHand hand={hand} />
        <div className="discard-and-endTurn">
          <button onClick={() => endTurn()}></button>
        </div>
      </div>
    </div>
  )
}

export default FightLayer
