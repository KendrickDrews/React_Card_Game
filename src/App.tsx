
import './styles/main.scss'
import { BackgroundLayer } from './Layers/00_Background'
import { FightLayer } from './Layers/01_Fight'

function App() {
  return (
    <>
      <FightLayer />
      <BackgroundLayer />
    </>
  )
}

export default App
