import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectMenuScreen } from '../../redux/slices/Menu/menuSelector';
import { menuState } from '../../redux/slices/Menu/menuSlice';
import { teamActions } from '../../redux/slices/Team/teamSlice';
import { inventoryActions } from '../../redux/slices/Inventory/inventorySlice';
import { selectDraftFormation, selectCanStartRun } from '../../redux/slices/Menu/menuSelector';
import { instantiateCreature } from '../../data/creatureRegistry';
import MainMenu from './MainMenu';
import RunConfig from './RunConfig';
import Bestiary from './Bestiary';

interface BackgroundLayerProps {
  layerContext: string;
  setLayerContext: (value: string) => void;
}

const BackgroundLayer = ({ layerContext, setLayerContext }: BackgroundLayerProps) => {
  const dispatch = useAppDispatch();
  const screen = useAppSelector(selectMenuScreen);
  const draftFormation = useAppSelector(selectDraftFormation);
  const canStart = useAppSelector(selectCanStartRun);

  const handleStartRun = () => {
    if (!canStart) return;

    // Reset roster/inventory and populate from formation grid positions
    dispatch(teamActions.resetRoster());
    dispatch(inventoryActions.resetInventory());
    for (const [key, speciesId] of Object.entries(draftFormation)) {
      const [col, row] = key.split(',').map(Number);
      const creature = instantiateCreature(speciesId, { col, row });
      dispatch(teamActions.addCreatureToRoster(creature));
      dispatch(teamActions.addCreatureToActiveTeam(creature.id));
    }

    dispatch(menuState.resetMenu());
    setLayerContext('Map');
  };

  const handleBack = () => {
    dispatch(menuState.clearDraftFormation());
    dispatch(menuState.setSelectedSpecies(null));
    dispatch(menuState.setScreen('main'));
  };

  const renderScreen = () => {
    switch (screen) {
      case 'main':
        return <MainMenu />;
      case 'runConfig':
        return <RunConfig onStartRun={handleStartRun} onBack={handleBack} />;
      case 'bestiary':
        return <Bestiary onBack={handleBack} />;
      case 'options':
        return (
          <div className="menu-placeholder">
            <h2>Options</h2>
            <p>Coming soon</p>
            <button className="menu-button" onClick={handleBack}>Back</button>
          </div>
        );
      case 'stats':
        return (
          <div className="menu-placeholder">
            <h2>Game Stats</h2>
            <p>Coming soon</p>
            <button className="menu-button" onClick={handleBack}>Back</button>
          </div>
        );
    }
  };

  return (
    <div className={`layer-00-container ${layerContext !== 'Menu' ? 'layer-hidden' : ''}`}>
      {renderScreen()}
    </div>
  );
};

export default BackgroundLayer;
