import  PlayerHand  from "./Deck/PlayerHand"
import cricket from '../../assets/Cricket_R.png'
import sun from '../../assets/Sun_R.png'
import { useEffect, useState } from "react"
import { Deck } from './Deck/Deck'
import { useDispatch, useSelector } from "react-redux";
import {playerFightStateSelector, playerHandSelector} from "../../redux/slices/01_Fight/fightSelector";
import { loadDeck, shuffleDeckToDraw, shuffleDiscardToDraw, drawCard } from "../../redux";

interface LayerContext {
  layerContext: string;
  setLayerContext: (value: string) => void;
}

let battleStart = true;
// let shouldDraw = true;

const FightLayer= ({layerContext, setLayerContext}: LayerContext) => {

  const dispatch = useDispatch()

  const playerState = useSelector(playerFightStateSelector);
  const handState = useSelector(playerHandSelector)

  console.log(playerState)

  const phases = ["player_start","player_active","player_end","enemy_start","enemy_active","enemy_end"];
  // const [activePhase, setActivePhase] = useState(phases[0]);
  // const [battleStart, setBattleStart] = useState(true)
  const [shouldDraw, setShouldDraw] = useState(true)
  let activePhase = phases[0]
  const [turn, setTurn] = useState(0);

  const baseDrawAmount = 5;

  const deck = Deck

  // const discard: unknown[] = [];

  function drawCards(drawNumber: number, modifiers = 0) {
    for (let i = 0; i < drawNumber + modifiers; i++) {
      console.log(i)
      if (playerState.draw.length - 1 < 0) {
          dispatch(shuffleDiscardToDraw())
        return
      }
      dispatch(drawCard())
    }
    setShouldDraw(false)
  }

  const setNextPhase = (i: number) => {
    activePhase = phases[i]
  }
  

// Fight Phases
    if (activePhase === "player_start") {
      console.log("its player Start")
      console.log("player State:", playerState)
      console.log("hand:", handState)
      console.log(battleStart)
      // set Mana to max
      // Apply Buffs
      // Remove leftover Block
      // Remove buffs that remove
      // Do on Turn Start damage
      // Draw Cards
      // 
      shouldDraw ? (drawCards(baseDrawAmount)) : null
      
      setNextPhase(1)
      // setActivePhase(phases[1]) // Functions are happening out of order
    }
    // Might be unnecessary since its when users do stuff
    if (activePhase === "player_active") {
      // setShouldDraw(true)
      // Set things to clickable
      console.log("It's the player turn!")
    }

    if (activePhase === "player_end") {
      // Player End of Turn FX
      setNextPhase(3)
    }
    if (activePhase === "enemy_start") {
      // Enemy Buffs
      // remove last turns block
      
      // decrement debuffs
      // On turn Start Damage
      setNextPhase(4)
    }
    if (activePhase === "enemy_active") {
      // Enemy Attack
      setNextPhase(5)
    }
    if (activePhase === "enemy_end") {
      // Enemy Debuffs
      // decrement buffs
      // 
      setTurn(turn + 1)
      setNextPhase(0)
    }

    function endTurn() {
      // Make it so nothing is clickable (maybe few things clickable)
      // decrement buffs on player
      // Discard cards
      // Discard FX
      // setActivePhase(phases[2])
      setNextPhase(2)
    }
    useEffect(() => {
      if (battleStart) {
        dispatch(loadDeck(deck));
        dispatch(shuffleDeckToDraw());
      }
        battleStart = false
        // setBattleStart(false);
    },[])

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
        <PlayerHand />
        <div className="discard-and-endTurn">
          <button onClick={() => endTurn()}></button>
        </div>
      </div>
    </div>
  )
}

export default FightLayer
