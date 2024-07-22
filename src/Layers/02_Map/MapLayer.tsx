
import cricket from '../../assets/Cricket_R.png'
import sun from '../../assets/Sun_R.png'

interface LayerContext {
  layerContext: string;
  setLayerContext: (value: string) => void;
}

const MapLayer= ({layerContext, setLayerContext}: LayerContext) => {


  return (
    <div className={`layer-02-container ${layerContext !== 'Map' ? 'layer-hidden' : ''}`}>
      <div className="run-info">
        <div className="info-character">
          <div> character_Name</div>
          <div> health</div>
          <div> Gold</div>
        </div>
        <div className="info-floor"> Current Floor </div>
        <div className="info-system"> 
          <div onClick={() => setLayerContext("Fight")}> Fight </div>
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
        <div className="discard-and-endTurn">
        </div>
      </div>
    </div>
  )
}

export default MapLayer
