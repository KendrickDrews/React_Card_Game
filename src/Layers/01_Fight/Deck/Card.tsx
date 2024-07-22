interface CardProps {
  title: string;
}
  
const Card = ({title}: CardProps) => {

    return (
      <div className="card">
        {title ?? 'no title'}
      </div>
    )
  }
  
  export default Card
  