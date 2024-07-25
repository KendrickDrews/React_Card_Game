import  Deck  from "./Deck/Deck"
import cricket from '../../assets/Cricket_R.png'
import sun from '../../assets/Sun_R.png'
import { useState } from "react"

interface LayerContext {
  layerContext: string;
  setLayerContext: (value: string) => void;
}

const FightLayer= ({layerContext, setLayerContext}: LayerContext) => {

  const phases = ["player_start","player_active","player_end","enemy_start","enemy_active","enemy_end"];
  const [activePhase, setActivePhase] = useState(phases[0]);


    if (activePhase === "player_start") {
      // set Mana to max
      // Apply Buffs
      // Remove leftover Block
      // Remove buffs that remove
      // Do on Turn Start damage
      // Draw Cards
      
      setActivePhase(phases[1])
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
        <Deck />
        <div className="discard-and-endTurn">
          <button onClick={() => endTurn()}></button>
        </div>
      </div>
    </div>
  )
}

export default FightLayer
