
import './styles/main.scss'
import { BackgroundLayer } from './Layers/00_Background'
import { FightLayer } from './Layers/01_Fight'
import { useEffect, useState } from 'react'
import { MapLayer } from './Layers/02_Map'
import { AudioEngine } from './audio'
import { layerMusicMap } from './audio/audioRegistry'
import AudioSettings from './components/AudioSettings/AudioSettings'
import InventoryOverlay from './components/InventoryOverlay/InventoryOverlay'

function App() {

  const [layerContext, setLayerContext] = useState("Menu")
  const [showAudioSettings, setShowAudioSettings] = useState(false)
  const [showInventory, setShowInventory] = useState(false)

  // Background music follows active layer
  useEffect(() => {
    const trackId = layerMusicMap[layerContext];
    if (trackId) {
      AudioEngine.getInstance().playMusic(trackId);
    }
  }, [layerContext]);

  return (
    <>
      <MapLayer layerContext={layerContext} setLayerContext={setLayerContext} onOpenInventory={() => setShowInventory(true)}/>
      <FightLayer layerContext={layerContext} setLayerContext={setLayerContext} onOpenInventory={() => setShowInventory(true)}/>
      <BackgroundLayer layerContext={layerContext} setLayerContext={setLayerContext} />

      <button
        className="audio-settings-toggle"
        onClick={() => setShowAudioSettings(prev => !prev)}
        title="Audio Settings"
      >
        &#9834;
      </button>
      {showAudioSettings && (
        <AudioSettings onClose={() => setShowAudioSettings(false)} />
      )}
      {showInventory && (
        <InventoryOverlay onClose={() => setShowInventory(false)} isInFight={layerContext === 'Fight'} />
      )}
    </>
  )
}

export default App
