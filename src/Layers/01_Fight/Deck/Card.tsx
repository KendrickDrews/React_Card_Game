
import { PlayingCard } from "../../../types/card"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { battleState, activeCardSelector, playerState, selectBattleState, selectPlayerState } from "../../../redux"
import { selectPlayerCreatures, selectEnemyCreatures } from "../../../redux/slices/BattleCreatures/battleCreaturesSelector"
import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { getValidTargets } from "../getValidTargets"
import { AudioEngine } from "../../../audio"
import './CardAnimation.scss'
import KeywordText from '../../../components/KeywordText'

  
const Card = ({card, mana, index}:{card: PlayingCard, mana: number, index: number}) => {
  const topDefault = 65;
  
  const dispatch = useAppDispatch()
  const selectedCard = useSelector(activeCardSelector)
  const playerSelector = useSelector(selectPlayerState)

  const {useCard, activeCard } = useAppSelector(selectBattleState);
  const [animationState, setAnimationState] = useState('draw');
  const [hasAnimated, setHasAnimated] = useState(false);
  const [top, setTop] = useState(topDefault);
  const [left, setLeft] = useState(303);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (card === selectedCard) {
      setIsSelected(true) 
    }
    else { 
      setIsSelected(false) 
    }

  }, [card, selectedCard])

  const elementRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hovering, setHovering] = useState(false)

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
  const playerCreatures = useAppSelector(selectPlayerCreatures);
  const enemyCreatures = useAppSelector(selectEnemyCreatures);

  const toggleActiveOnClick = (card: PlayingCard) => {
    if (mana < card.manaCost) return
    AudioEngine.getInstance().playSfx('ui-click')
    if (selectedCard?.id === card.id) {
      // Deselect card — clear targeting
      dispatch(battleState.clearTargeting())
    } else {
      // Select card — compute targeting info
      const targeting = getValidTargets(card, playerCreatures, enemyCreatures);
      dispatch(battleState.setActiveCard(card))
      dispatch(battleState.setTargetingMode(targeting.mode))
      dispatch(battleState.setValidTargetIds(targeting.validTargetIds))

      // Auto-resolve cards that don't need targeting (e.g. addMana)
      if (targeting.mode === 'auto') {
        dispatch(battleState.useCard(true))
      }
    }
  }

  const handleMouseEnter = () => {
    setTop(topDefault - (isSelected ? 1 : 4))
    setHovering(true)
    AudioEngine.getInstance().playSfx('card-hover')
  }
  const handleMouseLeave = () => {
    setTop(topDefault)
    setHovering(false)
  }
  // UseCard
  useEffect(() => {
    if (useCard && activeCard?.id === card.id) {
      dispatch(playerState.markCardAnimatingOut(card.id));
      handleClick('useCard');
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
    const visibleHand = playerSelector.hand.filter(c => !c.isAnimatingOut);
    const myVisibleIndex = visibleHand.findIndex(c => c.id === card.id);
    if (myVisibleIndex === -1) return; // this card is animating out — keep current position
    const centerIndex = (visibleHand.length - 1) / 2;
    setLeft(myVisibleIndex - centerIndex);
  }, [playerSelector.hand, card.id]);

  
  useEffect(() => {
    const updateWidth = () => {
      if (elementRef.current) {
        const { width } = elementRef.current.getBoundingClientRect();
        setWidth(width);
      }
    };

    updateWidth(); // Initial measurement
    window.addEventListener('resize', updateWidth); // Update on window resize

    return () => window.removeEventListener('resize', updateWidth); // Cleanup
  }, []);

  // To make the hover better, give the card container a child container which moves up on hover
    const computedWidth = window.innerWidth * (hovering || isSelected ? 0.12 : 0.10);
    return (
      <div
        ref={elementRef}
        data-card-id={card.id}
        style={{
          top: `calc(${top}% - ${isSelected ? 2 : 0}%)`,
          left: `calc(50% - ${computedWidth/2}px - ${(left) * computedWidth/1.25}px)`,
          zIndex: `${(100 + (playerSelector.hand.length/2 - index) * 10) + (hovering ? 20 : 0) + (isSelected ? 10 : 0)}`
        }}
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
        onAnimationEnd={() => handleAnimationEnd()} 
        className={`card ${isSelected ? 'selected' : ''} ${hovering ? 'hovering' : ''} ${card?.manaCost > mana ? 'unplayable' : ''}
          ${animationState === 'draw' ? 'animate-draw' : ''}
          ${animationState === 'useCard' ? 'animate-use-card' : ''}
          ${animationState === 'discardCard' ? 'animate-use-card' : ''} `} 
        onClick={(e) => { e.stopPropagation(); toggleActiveOnClick(card); }}>
        <div className="card-mana-container">
          <div className="card-mana-value">{ card.manaCost }</div>
        </div>
        <div className="card-image-area" />
        <div className="card-nameplate">
          <span className="card-nameplate-text">{card.title}</span>
        </div>
        <div className="card-description-area">
          <p className="card-description-text">
            <KeywordText text={card.description ?? ''} />
          </p>
        </div>
        <div className="card-description-footer">
          <span className="card-type-label">{card.type}</span>
        </div>
      </div>
      
    )
  }
  
  export default Card
  