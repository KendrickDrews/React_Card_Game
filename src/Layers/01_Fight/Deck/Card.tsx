interface CardProps {
    title: string;
  }
  
const Card: React.FC<CardProps> = ({title}) => {

    return (
      <div className="card">
        {title ?? 'no title'}
      </div>
    )
  }
  
  export default Card
  