
const BackgroundLayer = ({setLayerContext}: {setLayerContext: (value: string) => void}) => {

  return (
    <div className="layer-00-container">
      <h1>Layer 00 BACKGROUND</h1>
      <button onClick={() => setLayerContext("Fight")}>Fight</button>
      <button onClick={() => setLayerContext("Map")}>Map</button>
    </div>
  )
}

export default BackgroundLayer