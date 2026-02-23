import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectMapChoices, selectCurrentMapNumber, selectTotalMaps } from '../../redux/slices/Map/mapSelector';
import { mapActions } from '../../redux/slices/Map/mapSlice';
import { generateMap } from '../../data/mapGenerator';
import { MapChoice } from '../../types/map';
import { AudioEngine } from '../../audio';

const MapChoiceScreen = () => {
  const dispatch = useAppDispatch();
  const choices = useAppSelector(selectMapChoices);
  const currentMapNumber = useAppSelector(selectCurrentMapNumber);
  const totalMaps = useAppSelector(selectTotalMaps);

  const handleChoice = (_choice: MapChoice) => {
    AudioEngine.getInstance().playSfx('ui-click');
    const newMap = generateMap();
    dispatch(mapActions.advanceToNextMap(newMap));
  };

  return (
    <div className="map-screen-overlay">
      <div className="map-screen-content" style={{ minWidth: 600 }}>
        <h2 className="map-screen-title">Choose Your Path</h2>
        <p className="map-screen-description">Map {currentMapNumber} of {totalMaps} complete</p>
        <div className="map-choice-options">
          {choices.map(choice => (
            <div
              key={choice.id}
              className="map-choice-card"
              onClick={() => handleChoice(choice)}
            >
              <div className="map-choice-label">{choice.label}</div>
              <div className="map-choice-desc">{choice.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapChoiceScreen;
