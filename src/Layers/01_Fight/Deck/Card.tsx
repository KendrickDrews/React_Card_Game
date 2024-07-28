import { PlayingCard } from "../../../types/card"

  
const Card = ({title}: PlayingCard) => {

    return (
      <div className="card">
        {title ?? 'no title'}
      </div>
    )
  }
  
  export default Card
  