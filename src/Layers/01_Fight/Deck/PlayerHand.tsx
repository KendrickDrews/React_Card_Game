
import { useEffect } from 'react'
// import { PlayingCard } from '../../../types/card'
import Card from './Card'
import { useSelector } from 'react-redux'
import { playerStateSelector } from '../../../redux'



const PlayerHand = ({hand}) => {

    return (
        <div className="deck">
            { hand.map((item, index) => ( <Card key={index} title={item.title} /> ))}
        </div>
    )
}

export default PlayerHand