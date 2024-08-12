
import { PlayingCard } from "../../../types/card"
import { useAppDispatch } from "../../../redux/hooks"
import { battleState, activeCardSelector } from "../../../redux"
import { useSelector } from "react-redux"

  
const Card = ({card, mana}:{card: PlayingCard, mana: number}) => {
  const dispatch = useAppDispatch()
  const selectedCard = useSelector(activeCardSelector)

  const toggleActiveOnClick = (card: PlayingCard) => {
    if (mana < card.manaCost) return
    if (selectedCard?.id === card.id) {
      dispatch(battleState.setActiveCard("none"))
    } else {
      
      dispatch(battleState.setActiveCard(card))
    }
  }

    return (
      <div className={`card ${card === selectedCard ? 'selected' : ''} ${card.manaCost > mana ? 'unplayable' : ''} `} onClick={() =>toggleActiveOnClick(card)}>
        <div>title: {card.title}</div>
        <div>type: {card.type}</div>
        <div>mana cost: {card.manaCost}</div>
        <div>value: {card.value}</div>
        <div>description: {card.description}</div>
        
      </div>
    )
  }
  
  export default Card
  