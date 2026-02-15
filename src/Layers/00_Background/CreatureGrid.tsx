import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectDraftFormation, selectSelectedSpecies } from '../../redux/slices/Menu/menuSelector';
import { menuState } from '../../redux/slices/Menu/menuSlice';
import { allSpecies } from '../../data/creatureRegistry';

interface CreatureGridProps {
  onHover: (speciesId: string | null) => void;
  readOnly?: boolean;
}

const CreatureGrid = ({ onHover, readOnly = false }: CreatureGridProps) => {
  const dispatch = useAppDispatch();
  const draftFormation = useAppSelector(selectDraftFormation);
  const formationSpecies = new Set(Object.values(draftFormation));
  const selectedSpeciesId = useAppSelector(selectSelectedSpecies);

  const handleClick = (speciesId: string) => {
    if (readOnly) {
      // In bestiary, just select for details
      dispatch(menuState.setSelectedSpecies(selectedSpeciesId === speciesId ? null : speciesId));
      return;
    }
    dispatch(menuState.setSelectedSpecies(selectedSpeciesId === speciesId ? null : speciesId));
  };

  return (
    <div className="creature-grid">
      <h3>{readOnly ? 'Creatures' : 'Available Creatures'}</h3>
      <div className="creature-grid-cells">
        {allSpecies.map(species => {
          const inTeam = formationSpecies.has(species.speciesId);
          const isSelected = selectedSpeciesId === species.speciesId;
          return (
            <div
              key={species.speciesId}
              className={`creature-grid-cell ${isSelected ? 'selected' : ''} ${inTeam && !readOnly ? 'in-team' : ''}`}
              onClick={() => handleClick(species.speciesId)}
              onMouseEnter={() => onHover(species.speciesId)}
              onMouseLeave={() => onHover(null)}
              title={species.name}
            >
              <div className="grid-cell-sprite">
                <div className="placeholder-sprite-small">{species.name[0]}</div>
              </div>
              <div className="grid-cell-name">{species.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreatureGrid;
