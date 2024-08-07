import  PlayerHand  from "./Deck/PlayerHand"
import cricket from '../../assets/Cricket_R.png'
import sun from '../../assets/Sun_R.png'
import { useEffect} from "react"
import { useAppDispatch, useAppSelector } from "././../../redux/hooks";
import { playerStateSelector, battleState, selectBattleState } from "../../redux";
import { handleBattlePhase } from "./HandleBattlePhase"

interface LayerContext {
  layerContext: string;
  setLayerContext: (value: string) => void;
}


const FightLayer= ({layerContext, setLayerContext}: LayerContext) => {

  const dispatch = useAppDispatch();
  const { phase } = useAppSelector(selectBattleState);
  const playerSelector = useAppSelector(playerStateSelector);

  useEffect(() => {
    dispatch(handleBattlePhase());
  }, [dispatch, phase]);

  const handleEndTurn = () => {
    dispatch(battleState.nextBattlePhase());
  };

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
        <PlayerHand hand={playerSelector.hand}/>
        <div className="discard-and-endTurn">
          <button onClick={() => handleEndTurn()}></button>
        </div>
      </div>
    </div>
  )
}

export default FightLayer
