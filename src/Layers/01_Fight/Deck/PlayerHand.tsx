import { PlayingCard } from '../../../types/card'
import Card from './Card'



const PlayerHand = ({hand}:{hand: PlayingCard[]}) => {

    return (
        <div className="deck">
            { hand.map((card, index) => ( <Card key={index} card={card} /> ))}
        </div>
    )
}

export default PlayerHand