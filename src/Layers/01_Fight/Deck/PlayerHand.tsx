
import { useEffect } from 'react'
// import { PlayingCard } from '../../../types/card'
import Card from './Card'
import { useSelector } from 'react-redux'
import { playerHandSelector } from '../../../redux'



const PlayerHand = () => {

    const hand = useSelector(playerHandSelector)

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