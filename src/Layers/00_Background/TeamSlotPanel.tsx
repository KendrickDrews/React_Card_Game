import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectDraftFormation, selectDraftFormationFull, selectSelectedSpecies, selectDraftTeamCount } from '../../redux/slices/Menu/menuSelector';
import { selectAllUnlocks } from '../../redux/slices/Stats/statsSelector';
import { menuState, FORMATION_COLS, FORMATION_ROWS, MAX_TEAM_SIZE } from '../../redux/slices/Menu/menuSlice';
import { unlockableCreatures } from '../../data/unlockableCreatures';

const unlockBySpecies = new Map(
  unlockableCreatures.map(u => [u.speciesId, u])
);

const TeamSlotPanel = () => {
  const dispatch = useAppDispatch();
  const draftFormation = useAppSelector(selectDraftFormation);
  const formationFull = useAppSelector(selectDraftFormationFull);
  const selectedSpeciesId = useAppSelector(selectSelectedSpecies);
  const teamCount = useAppSelector(selectDraftTeamCount);
  const unlocks = useAppSelector(selectAllUnlocks);

  const isSpeciesUnlocked = (speciesId: string) => {
    const entry = unlockBySpecies.get(speciesId);
    if (!entry) return true;
    return unlocks[entry.unlock.id]?.unlockedAt !== null && unlocks[entry.unlock.id] !== undefined;
  };
  const [swapSource, setSwapSource] = useState<{ col: number; row: number } | null>(null);

  const handleCellClick = (col: number, row: number) => {
    const key = `${col},${row}`;
    const cellSpecies = draftFormation[key] ?? null;

    // If we have a swap source, perform swap
    if (swapSource !== null) {
      if (swapSource.col === col && swapSource.row === row) {
        setSwapSource(null);
      } else {
        dispatch(menuState.swapCells({ from: swapSource, to: { col, row } }));
        setSwapSource(null);
      }
      return;
    }

    // If cell is occupied, start swap mode
    if (cellSpecies !== null) {
      setSwapSource({ col, row });
      return;
    }

    // If cell is empty and a species is selected, assign it (if under max and unlocked)
    if (selectedSpeciesId && teamCount < MAX_TEAM_SIZE && isSpeciesUnlocked(selectedSpeciesId)) {
      dispatch(menuState.assignSpeciesToCell({ col, row, speciesId: selectedSpeciesId }));
    }
  };

  const handleRemove = (e: React.MouseEvent, col: number, row: number) => {
    e.stopPropagation();
    dispatch(menuState.removeFromCell({ col, row }));
    if (swapSource?.col === col && swapSource?.row === row) setSwapSource(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setSwapSource(null);
  };

  const canAssign = selectedSpeciesId !== null && teamCount < MAX_TEAM_SIZE;

  return (
    <div className="team-slot-panel" onKeyDown={handleKeyDown} tabIndex={0}>
      <h3>Formation <span className="team-count">{teamCount}/{MAX_TEAM_SIZE}</span></h3>
      <div className="formation-col-labels">
        <span>Back</span>
        <span></span>
        <span>Front</span>
      </div>
      <div
        className="formation-grid"
        style={{
          gridTemplateColumns: `repeat(${FORMATION_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${FORMATION_ROWS}, 1fr)`,
        }}
      >
        {Array.from({ length: FORMATION_ROWS }, (_, row) =>
          Array.from({ length: FORMATION_COLS }, (_, col) => {
            const key = `${col},${row}`;
            const species = formationFull[key] ?? null;
            const isSwapSource = swapSource?.col === col && swapSource?.row === row;

            return (
              <div
                key={key}
                className={`formation-cell ${species ? 'occupied' : 'empty'} ${isSwapSource ? 'swap-active' : ''} ${!species && canAssign ? 'assignable' : ''} ${!species && swapSource ? 'swap-target' : ''}`}
                onClick={() => handleCellClick(col, row)}
              >
                {species ? (
                  <>
                    <div className="cell-sprite">
                      <div className="placeholder-sprite-small">{species.name[0]}</div>
                    </div>
                    <div className="cell-name">{species.name}</div>
                    <button className="cell-remove" onClick={(e) => handleRemove(e, col, row)}>X</button>
                  </>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TeamSlotPanel;
