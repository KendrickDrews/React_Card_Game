import { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { teamActions } from '../../redux/slices/Team/teamSlice';

interface RestScreenProps {
  onComplete: () => void;
}

const RestScreen = ({ onComplete }: RestScreenProps) => {
  const dispatch = useAppDispatch();
  const [choiceMade, setChoiceMade] = useState(false);

  const handleHeal = () => {
    dispatch(teamActions.healTeamByPercent(25));
    setChoiceMade(true);
  };

  const handleStatIncrease = () => {
    // Placeholder — future implementation
    setChoiceMade(true);
  };

  const handleUpgradeCard = () => {
    // Placeholder — future implementation
    setChoiceMade(true);
  };

  return (
    <div className="map-screen-overlay">
      <div className="map-screen-content">
        <h2 className="map-screen-title">Rest Area</h2>
        <p className="map-screen-description">Take a moment to recover before continuing.</p>
        <div className="map-screen-actions rest-options">
          <button
            className={`map-screen-btn rest-btn ${choiceMade ? 'disabled' : ''}`}
            disabled={choiceMade}
            onClick={handleHeal}
          >
            Heal (25% HP)
          </button>
          <button
            className={`map-screen-btn rest-btn ${choiceMade ? 'disabled' : ''}`}
            disabled={choiceMade}
            onClick={handleStatIncrease}
          >
            Stat Increase
          </button>
          <button
            className={`map-screen-btn rest-btn ${choiceMade ? 'disabled' : ''}`}
            disabled={choiceMade}
            onClick={handleUpgradeCard}
          >
            Upgrade Card
          </button>
          <button className="map-screen-btn leave-btn" onClick={onComplete}>
            Leave Rest Area
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestScreen;
