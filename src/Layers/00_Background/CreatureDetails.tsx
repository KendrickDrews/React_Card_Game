import { useAppSelector } from '../../redux/hooks';
import { selectSelectedSpecies } from '../../redux/slices/Menu/menuSelector';
import { selectAllUnlocks } from '../../redux/slices/Stats/statsSelector';
import { creatureSpecies } from '../../data/creatureRegistry';
import { cardTemplates } from '../01_Fight/Deck/CardRegistry';
import { unlockableCreatures } from '../../data/unlockableCreatures';

const unlockBySpecies = new Map(
  unlockableCreatures.map(u => [u.speciesId, u])
);

interface CreatureDetailsProps {
  hoveredSpeciesId: string | null;
}

const CreatureDetails = ({ hoveredSpeciesId }: CreatureDetailsProps) => {
  const selectedSpeciesId = useAppSelector(selectSelectedSpecies);
  const unlocks = useAppSelector(selectAllUnlocks);

  // Hovered takes priority over selected
  const displayId = hoveredSpeciesId ?? selectedSpeciesId;
  const species = displayId ? creatureSpecies[displayId] : null;

  if (!species) {
    return (
      <div className="creature-details empty">
        <p>Hover or select a creature to see details</p>
      </div>
    );
  }

  // Check if this creature is locked
  const lockEntry = unlockBySpecies.get(species.speciesId);
  const isLocked = lockEntry !== undefined &&
    (unlocks[lockEntry.unlock.id] === undefined || unlocks[lockEntry.unlock.id].unlockedAt === null);

  if (isLocked) {
    return (
      <div className="creature-details locked">
        <h3>???</h3>
        <p className="creature-description">This creature has not been unlocked yet.</p>
        <div className="unlock-condition">
          <strong>Unlock:</strong> {lockEntry!.conditionLabel}
        </div>
      </div>
    );
  }

  // Deduplicate cards for display
  const cardCounts: Record<string, number> = {};
  for (const cardId of species.cards) {
    cardCounts[cardId] = (cardCounts[cardId] ?? 0) + 1;
  }

  return (
    <div className="creature-details">
      <h3>{species.name}</h3>
      <p className="creature-description">{species.description}</p>
      <div className="creature-stats">
        <span>HP: {species.maxHp}</span>
        <span>Initiative: {species.initiative}</span>
      </div>
      <div className="creature-action">
        <strong>Default Action:</strong> {species.defaultAction.name} - {species.defaultAction.description}
      </div>
      <div className="creature-cards">
        <strong>Cards:</strong>
        <ul>
          {Object.entries(cardCounts).map(([cardId, count]) => {
            const template = cardTemplates[cardId];
            if (!template) return null;
            return (
              <li key={cardId}>
                {template.title} {count > 1 ? `x${count}` : ''} <span className="card-cost">({template.manaCost} mana)</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CreatureDetails;
