import  PlayerHand  from "./Deck/PlayerHand"
import cricket from '../../assets/Cricket_R.png'
import sun from '../../assets/Sun_R.png'
import { useEffect, useState} from "react"
import { useAppDispatch, useAppSelector } from "././../../redux/hooks";
import { battleState, playerState, enemyState, selectBattleState, selectEnemyState, selectPlayerState } from "../../redux";
import { handleBattlePhase } from "./HandleBattlePhase"

interface LayerContext {
  layerContext: string;
  setLayerContext: (value: string) => void;
}


const FightLayer= ({layerContext, setLayerContext}: LayerContext) => {

  const dispatch = useAppDispatch();
  const { phase, useCard, activeCard } = useAppSelector(selectBattleState);
  const playerSelector = useAppSelector(selectPlayerState);
  const enemySelector = useAppSelector(selectEnemyState)

  const [currentMana, setMana] = useState(0)

  useEffect(() => {
    dispatch(handleBattlePhase());
    if (phase === "player_active") {
      setMana(playerSelector.mana)
    }
  }, [dispatch, phase, playerSelector.mana]);

  const handleEndTurn = () => {
    dispatch(battleState.nextBattlePhase());
  };

  useEffect(() => {
   // Maybe turn this 'useCard' into its own 'handleBattlePhase' thunk
   if (useCard) {
     // Make sure a card is active if useCard()
     // Ensure activeCard exists
     if (!activeCard) {
       console.error('No active card found');
       dispatch(battleState.useCard(false));
       return;
     }
     // Below loops
     const cardEffects = activeCard.effect
     for (const [key, value] of Object.entries(cardEffects)) {
      console.log(key, value)
       switch (key) {
         case 'damage':
           console.log('damage: ', value ) 
           dispatch(enemyState.decrease({state: 'health', amount: value as number}))
           break;
         case 'heal':
          dispatch(playerState.increase({state: 'health', amount: value as number}))
           console.log('heal: ', value);
           // Apply healing logic here
           break;
         // Add more cases for other effect types
         default:
           console.log(`Unknown effect type: ${key}`);
       }
     }
    //  dispatch(playerSelector.decrease())
      setMana(currentMana => currentMana - activeCard.manaCost)
      dispatch(playerState.discardSpecificCard(activeCard.id))
      dispatch(battleState.setActiveCard("none"))
      // Loop through Card Effect and Do stuff
      dispatch(battleState.useCard(false))
   }
  }, [activeCard, dispatch, useCard])
  

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
          <div className={`unit ${playerSelector.health <= 0 ? 'dead': ''}`}>
            <img width="500" className="unit-img"  src={cricket} />
            <div className="unit-health">{playerSelector.health}</div>
          </div>
        </div>
        <div className="station-enemy">
          <div className={`unit ${enemySelector.health <= 0 ? 'dead': ''}`}>
            <img width="500" className="unit-img flipped-horizontal" src={sun} />
            
            <div className="unit-health">{enemySelector.health}</div>
          </div>
        </div>
      </div>
      <div className="card-area">
        <div className="draw-and-mana">
          <div className="mana">{ currentMana }</div>
          <div className="draw">{ playerSelector.draw.length + "/" + playerSelector.deck.length }</div>
      </div>
        <PlayerHand hand={playerSelector.hand} mana={currentMana}/>
        <button disabled={activeCard != null ? false : true} className='play-card-button' onClick={() => dispatch(battleState.useCard(true))} > use card?</button>
        
        <div className="discard-and-endTurn">
          <div className="discard-container">{playerSelector.discard.length}</div>
          <button className="end-turn-button" onClick={() => handleEndTurn()}> End Turn </button>
        </div>
      </div>
    </div>
  )
}

export default FightLayer
