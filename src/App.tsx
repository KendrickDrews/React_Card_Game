
import './styles/main.scss'
import { BackgroundLayer } from './Layers/00_Background'
import { FightLayer } from './Layers/01_Fight'
import { useState } from 'react'
import { MapLayer } from './Layers/02_Map'

function App() {

  const [layerContext, setLayerContext] = useState("Map")

  return (
    <>
      <MapLayer layerContext={layerContext} setLayerContext={setLayerContext}/>
      <FightLayer layerContext={layerContext} setLayerContext={setLayerContext}/>
      <BackgroundLayer setLayerContext={setLayerContext} />
    </>
  )
}

export default App
