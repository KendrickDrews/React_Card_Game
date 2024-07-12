
const FightLayer = () => {

  return (
    <div className="layer-01-container">
      <div className="run-info">
        <div>
          <div> character_Name</div>
          <div> health</div>
          <div> Gold</div>
        </div>
        <div> Current Floor </div>
        <div> 
          <div> Map </div>
          <div> deck</div>
          <div> controls</div>
        </div>
      </div>
      <div className="artifact-bar"></div>
      <div className="battle-stations"></div>
      <div className="card-area">
        <div className="draw-and-mana"></div>
        <div className="deck">
          <div className="card">01</div>
          <div className="card">02</div>
          <div className="card">03</div>
          <div className="card">04</div>
          <div className="card">05</div>
        </div>
        <div className="discard-and-endTurn"></div>
      </div>
      
      <h1>Layer 01 FIGHT</h1>
    </div>
  )
}

export default FightLayer
