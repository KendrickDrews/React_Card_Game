import { PlayingCard } from '../../../types/card'
import Card from './Card'

const PlayerHand = ({hand, mana}:{hand: PlayingCard[], mana: number}) => {

    return (
        <div className="hand">
            { hand.map((card, index) => ( <Card key={card.id} card={card} mana={mana} index={index} /> ))}
        </div>
    )
}

export default PlayerHand