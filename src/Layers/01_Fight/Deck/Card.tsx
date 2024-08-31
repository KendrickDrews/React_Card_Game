
import { PlayingCard } from "../../../types/card"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { battleState, activeCardSelector, playerState, selectBattleState, selectPlayerState } from "../../../redux"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import './CardAnimation.scss'

  
const Card = ({card, mana, index}:{card: PlayingCard, mana: number, index: number}) => {
  
  const dispatch = useAppDispatch()
  const selectedCard = useSelector(activeCardSelector)
  const playerSelector = useSelector(selectPlayerState)

  const {useCard, activeCard } = useAppSelector(selectBattleState);
  const [animationState, setAnimationState] = useState('initial');
  const [hasAnimated, setHasAnimated] = useState(false);
  const [top, setTop] = useState(75)
  const [left, setLeft] = useState(303)

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

  const moveUpAndLeft = () => {
    setTop(prevTop => prevTop - 4);
    setLeft(prevLeft => prevLeft + 25);

  }
  const hoverEnter = () => {
    setTop(prevTop => prevTop - 2);
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
  }, [card]);

  // Adjust Position of Elements based on Number of cards in hand
  useEffect(() => {
    setLeft(() => 303 + (index * playerSelector.hand.length * 55))
  }, [playerSelector.hand, index]);

    // To make the hover better, give the card container a child container which moves up on hover

    return (
      <div 
        style={{
          top: `${top}%`,
          left: `${left}px`,
        }}
        onMouseEnter={() => setTop(prevTop => prevTop - 2)}
        onMouseLeave={() => setTop(prevTop => prevTop + 2)}
        onAnimationEnd={() => handleAnimationEnd()} 
        className={`card ${card === selectedCard ? 'selected' : ''} ${card?.manaCost > mana ? 'unplayable' : ''}
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
        <button onClick={moveUpAndLeft}>Move Up and Left </button>
      </div>
      
    )
  }
  
  export default Card
  