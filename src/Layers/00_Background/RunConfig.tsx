import TeamSlotPanel from './TeamSlotPanel';
import CreatureGrid from './CreatureGrid';
import CreatureDetails from './CreatureDetails';
import RunOptions from './RunOptions';
import { useState } from 'react';

interface RunConfigProps {
  onStartRun: () => void;
  onBack: () => void;
}

const RunConfig = ({ onStartRun, onBack }: RunConfigProps) => {
  const [hoveredSpeciesId, setHoveredSpeciesId] = useState<string | null>(null);

  return (
    <div className="run-config">
      <div className="run-config-header">
        <button className="menu-button menu-button-small" onClick={onBack}>Back</button>
        <h2>Build Your Team</h2>
      </div>
      <div className="run-config-body">
        <div className="run-config-left">
          <TeamSlotPanel />
        </div>
        <div className="run-config-right">
          <CreatureGrid
            onHover={setHoveredSpeciesId}
          />
          <CreatureDetails hoveredSpeciesId={hoveredSpeciesId} />
          <RunOptions onStartRun={onStartRun} />
        </div>
      </div>
    </div>
  );
};

export default RunConfig;
