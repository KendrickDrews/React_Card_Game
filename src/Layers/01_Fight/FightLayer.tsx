import  Deck  from "./Deck/Deck"

const FightLayer = () => {



  return (
    <div className="layer-01-container">
      <div className="run-info">
        <div className="info-character">
          <div> character_Name</div>
          <div> health</div>
          <div> Gold</div>
        </div>
        <div className="info-floor"> Current Floor </div>
        <div className="info-system"> 
          <div> Map </div>
          <div> deck</div>
          <div> controls</div>
        </div>
      </div>
      <div className="artifact-bar"></div>
      <div className="battle-stations">
        <div className="station-player">
          <div className="unit">Character</div>
        </div>
        <div className="station-enemy">
          <div className="unit">Monster</div>
        </div>
      </div>
      <div className="card-area">
        <div className="draw-and-mana"></div>
        <Deck />
        <div className="discard-and-endTurn"></div>
      </div>
    </div>
  )
}

export default FightLayer
