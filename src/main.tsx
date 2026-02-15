// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/index.ts'
import { AudioEngine } from './audio'
import './styles/main.scss'

// Unlock AudioContext on first user gesture (mobile autoplay policy)
const unlockAudio = () => {
  const engine = AudioEngine.getInstance();
  engine.unlock();
  engine.preloadAll();
  for (const evt of ['click', 'touchstart', 'keydown'] as const) {
    document.removeEventListener(evt, unlockAudio);
  }
};
for (const evt of ['click', 'touchstart', 'keydown'] as const) {
  document.addEventListener(evt, unlockAudio, { once: false });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>
)
