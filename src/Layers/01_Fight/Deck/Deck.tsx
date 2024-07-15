import Card from "./Card";

const Deck = () => {

    const deck = ['01','02','03','04','05']

    return (
        <div className="deck">
            { deck.map((item) => ( <Card title={item} /> ))}
        </div>
    )
}

export default Deck