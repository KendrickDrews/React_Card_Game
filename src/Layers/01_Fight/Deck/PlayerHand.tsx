import { PlayingCard } from '../../../types/card'
import Card from './Card'



const PlayerHand = ({hand}:{hand: PlayingCard[]}) => {

    return (
        <div className="deck">
            { hand.map((item, index) => ( <Card key={index} title={item.title} /> ))}
        </div>
    )
}

export default PlayerHand