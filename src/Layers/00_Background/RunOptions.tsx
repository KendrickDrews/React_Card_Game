import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectRunConfig, selectCanStartRun } from '../../redux/slices/Menu/menuSelector';
import { menuState, Difficulty } from '../../redux/slices/Menu/menuSlice';

interface RunOptionsProps {
  onStartRun: () => void;
}

const RunOptions = ({ onStartRun }: RunOptionsProps) => {
  const dispatch = useAppDispatch();
  const runConfig = useAppSelector(selectRunConfig);
  const canStart = useAppSelector(selectCanStartRun);

  return (
    <div className="run-options">
      <div className="run-options-dropdowns">
        <label>
          Level
          <select
            value={runConfig.level}
            onChange={e => dispatch(menuState.setRunConfigLevel(Number(e.target.value)))}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          Difficulty
          <select
            value={runConfig.difficulty}
            onChange={e => dispatch(menuState.setRunConfigDifficulty(e.target.value as Difficulty))}
          >
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
            <option value="nightmare">Nightmare</option>
          </select>
        </label>
        <label>
          Ascension
          <select
            value={runConfig.ascension}
            onChange={e => dispatch(menuState.setRunConfigAscension(Number(e.target.value)))}
          >
            {Array.from({ length: 21 }, (_, i) => i).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <button
        className="menu-button start-run-button"
        disabled={!canStart}
        onClick={onStartRun}
      >
        Start Run
      </button>
      {!canStart && (
        <p className="start-run-warning">Add at least one creature to your team</p>
      )}
    </div>
  );
};

export default RunOptions;
