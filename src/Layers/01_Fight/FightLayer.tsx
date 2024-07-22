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
      console.log("Player Start Script")
      console.log("Sup Idiot?")
      setActivePhase(phases[1])
    }
    if (activePhase === "player_active") {
      console.log("It's the next phase!")
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
          <button onClick={() => setActivePhase(phases[0])}></button>
        </div>
      </div>
    </div>
  )
}

export default FightLayer
