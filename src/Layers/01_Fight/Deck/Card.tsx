
import { PlayingCard } from "../../../types/card"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { battleState, activeCardSelector, playerState, selectBattleState } from "../../../redux"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import './CardAnimation.scss'

  
const Card = ({card, mana}:{card: PlayingCard, mana: number}) => {
  
  const dispatch = useAppDispatch()
  const selectedCard = useSelector(activeCardSelector)

  const {useCard, activeCard } = useAppSelector(selectBattleState);
  
  const [animationState, setAnimationState] = useState('initial');
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleClick = (animation: string) => {
    setAnimationState(animation);
  };

  const handleAnimationEnd = () => {
    switch (animationState) {
      case 'draw':
        setAnimationState('initial');
        break;
      case 'useCard':
        setAnimationState('initial');
        dispatch(playerState.discardSpecificCard(card.id))
        break;
      case 'discardCard':
        setAnimationState('initial');
        dispatch(playerState.toggleCardDiscardProperty({id: card.id, discard: false}))
        dispatch(playerState.discardSpecificCard(card.id))
        break;
      default:
        break;
    }
  };
  const toggleActiveOnClick = (card: PlayingCard) => {
    if (mana < card.manaCost) return
    if (selectedCard?.id === card.id) {
      dispatch(battleState.setActiveCard("none"))
    } else {
      dispatch(battleState.setActiveCard(card))
    }
  }

  // UseCard
  useEffect(() => {
    if (useCard) {
      if (activeCard?.id === card.id) {
        handleClick('useCard')
      }
    }

  }, [useCard, activeCard, card])

  // Animate when Added to player Hand
  useEffect(() => {
    if (!hasAnimated) {
      setAnimationState('draw');
      setHasAnimated(true);
    }
  }, [hasAnimated]);

  // End of turn whole hand discard
  useEffect(() => {
    if (card.discard) {
      setAnimationState('discardCard');
    }
  }, [card.discard]);


    return (
      <div 
        onAnimationEnd={() => handleAnimationEnd()} 
        className={`card ${card === selectedCard ? 'selected' : ''} ${card.manaCost > mana ? 'unplayable' : ''}
          ${animationState === 'draw' ? 'animate-draw' : ''}
          ${animationState === 'useCard' ? 'animate-use-card' : ''}
          ${animationState === 'discardCard' ? 'animate-use-card' : ''} `} 
        onClick={() =>toggleActiveOnClick(card)}>
        <div className="card-mana-container">
          <div className="card-mana-value">
            { card.manaCost }
          </div>
        </div>
        <div>title: {card.title}</div>

        <div>description: {card.description}</div>

        
        <div>type: {card.type}</div>
        <style>{`
        
      `}</style>
      </div>
      
    )
  }
  
  export default Card
  