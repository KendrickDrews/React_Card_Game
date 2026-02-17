import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectDraftFormation, selectSelectedSpecies } from '../../redux/slices/Menu/menuSelector';
import { selectAllUnlocks } from '../../redux/slices/Stats/statsSelector';
import { menuState } from '../../redux/slices/Menu/menuSlice';
import { allSpecies } from '../../data/creatureRegistry';
import { unlockableCreatures } from '../../data/unlockableCreatures';

// Build a lookup: speciesId -> unlockableCreature entry
const unlockBySpecies = new Map(
  unlockableCreatures.map(u => [u.speciesId, u])
);

interface CreatureGridProps {
  onHover: (speciesId: string | null) => void;
  readOnly?: boolean;
}

const CreatureGrid = ({ onHover, readOnly = false }: CreatureGridProps) => {
  const dispatch = useAppDispatch();
  const draftFormation = useAppSelector(selectDraftFormation);
  const formationSpecies = new Set(Object.values(draftFormation));
  const selectedSpeciesId = useAppSelector(selectSelectedSpecies);
  const unlocks = useAppSelector(selectAllUnlocks);

  const isUnlocked = (speciesId: string) => {
    const entry = unlockBySpecies.get(speciesId);
    if (!entry) return true; // not in unlock list = always available
    return unlocks[entry.unlock.id]?.unlockedAt !== null && unlocks[entry.unlock.id] !== undefined;
  };

  const handleClick = (speciesId: string) => {
    if (!isUnlocked(speciesId)) return; // locked creatures can't be selected
    if (readOnly) {
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
          const locked = !isUnlocked(species.speciesId);
          const lockInfo = unlockBySpecies.get(species.speciesId);
          return (
            <div
              key={species.speciesId}
              className={`creature-grid-cell ${isSelected ? 'selected' : ''} ${inTeam && !readOnly ? 'in-team' : ''} ${locked ? 'locked' : ''}`}
              onClick={() => handleClick(species.speciesId)}
              onMouseEnter={() => onHover(species.speciesId)}
              onMouseLeave={() => onHover(null)}
              title={locked ? `Locked: ${lockInfo?.conditionLabel}` : species.name}
            >
              <div className="grid-cell-sprite">
                <div className="placeholder-sprite-small">{locked ? '?' : species.name[0]}</div>
              </div>
              <div className="grid-cell-name">{locked ? '???' : species.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreatureGrid;
