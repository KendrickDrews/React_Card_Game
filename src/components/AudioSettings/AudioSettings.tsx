import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { audioState } from '../../redux/slices/Audio/audioSlice';
import {
  selectMasterVolume, selectSfxVolume, selectMusicVolume,
  selectMasterMuted, selectSfxMuted, selectMusicMuted,
} from '../../redux/slices/Audio/audioSelector';
import './AudioSettings.scss';

interface AudioSettingsProps {
  onClose: () => void;
}

const AudioSettings = ({ onClose }: AudioSettingsProps) => {
  const dispatch = useAppDispatch();

  const masterVolume = useAppSelector(selectMasterVolume);
  const sfxVolume = useAppSelector(selectSfxVolume);
  const musicVolume = useAppSelector(selectMusicVolume);
  const masterMuted = useAppSelector(selectMasterMuted);
  const sfxMuted = useAppSelector(selectSfxMuted);
  const musicMuted = useAppSelector(selectMusicMuted);

  return (
    <>
      <div className="audio-settings-overlay" onClick={onClose} />
      <div className="audio-settings-panel">
        <div className="audio-settings-title">Audio</div>

        <div className="audio-settings-row">
          <span className="audio-label">Master</span>
          <input
            className="audio-slider"
            type="range"
            min={0} max={1} step={0.05}
            value={masterVolume}
            onChange={e => dispatch(audioState.setMasterVolume(Number(e.target.value)))}
          />
          <button
            className={`audio-mute-btn ${masterMuted ? 'muted' : ''}`}
            onClick={() => dispatch(audioState.toggleMasterMute())}
          >
            {masterMuted ? '\u2215' : '\u266B'}
          </button>
        </div>

        <div className="audio-settings-row">
          <span className="audio-label">SFX</span>
          <input
            className="audio-slider"
            type="range"
            min={0} max={1} step={0.05}
            value={sfxVolume}
            onChange={e => dispatch(audioState.setSfxVolume(Number(e.target.value)))}
          />
          <button
            className={`audio-mute-btn ${sfxMuted ? 'muted' : ''}`}
            onClick={() => dispatch(audioState.toggleSfxMute())}
          >
            {sfxMuted ? '\u2215' : '\u266B'}
          </button>
        </div>

        <div className="audio-settings-row">
          <span className="audio-label">Music</span>
          <input
            className="audio-slider"
            type="range"
            min={0} max={1} step={0.05}
            value={musicVolume}
            onChange={e => dispatch(audioState.setMusicVolume(Number(e.target.value)))}
          />
          <button
            className={`audio-mute-btn ${musicMuted ? 'muted' : ''}`}
            onClick={() => dispatch(audioState.toggleMusicMute())}
          >
            {musicMuted ? '\u2215' : '\u266B'}
          </button>
        </div>
      </div>
    </>
  );
};

export default AudioSettings;
