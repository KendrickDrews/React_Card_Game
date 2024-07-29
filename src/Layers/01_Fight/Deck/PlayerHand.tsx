
import { useEffect } from 'react'
import { PlayingCard } from '../../../types/card'
import Card from './Card'



const PlayerHand = ({hand}: {hand: PlayingCard[]}) => {

    useEffect(() => {
        console.log("hand has changed!", hand)
    },[hand])


    return (
        <div className="deck">
            { hand.map((item, index) => ( <Card key={index} title={item.title} /> ))}
        </div>
    )
}

export default PlayerHand