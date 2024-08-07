
import { PlayingCard } from "../../../types/card"
import { useAppDispatch } from "../../../redux/hooks"
import { battleState, activeCardSelector } from "../../../redux"
import { useSelector } from "react-redux"

  
const Card = ({card}:{card: PlayingCard}) => {
  const dispatch = useAppDispatch()
  const selectedCard = useSelector(activeCardSelector)

    return (
      <div className={`card ${card === selectedCard ? 'selected' : ''}`} onClick={() => dispatch(battleState.setActiveCard(card))}>
        <div>title: {card.title}</div>
        <div>type: {card.type}</div>
        <div>mana cost: {card.manaCost}</div>
        <div>value: {card.value}</div>
        <div>description: {card.description}</div>
        { card === selectedCard && 
          <button className='play-card-button' onClick={() => dispatch(battleState.useCard(true))} > use card?</button>
        }
      </div>
    )
  }
  
  export default Card
  