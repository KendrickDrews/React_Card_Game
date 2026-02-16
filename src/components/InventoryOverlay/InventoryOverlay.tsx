import { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectTeamState } from '../../redux/slices/Team/teamSelector';
import { teamActions } from '../../redux/slices/Team/teamSlice';
import { selectGold, selectArtifacts, selectNeutralCards } from '../../redux/slices/Inventory/inventorySelector';
import { cardTemplates } from '../../Layers/01_Fight/Deck/CardRegistry';
import { PlayerCreature } from '../../types/creature';
import './InventoryOverlay.scss';

type Tab = 'party' | 'deck' | 'items';

interface InventoryOverlayProps {
  onClose: () => void;
  isInFight: boolean;
}

const InventoryOverlay = ({ onClose, isInFight }: InventoryOverlayProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('party');

  return (
    <div className="inventory-overlay" onClick={onClose}>
      <div className="inventory-panel" onClick={e => e.stopPropagation()}>
        <div className="inventory-header">
          <span className="inventory-title">Inventory</span>
          <button className="inventory-close" onClick={onClose}>X</button>
        </div>

        <div className="inventory-tabs">
          {(['party', 'deck', 'items'] as Tab[]).map(tab => (
            <button
              key={tab}
              className={`inventory-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="inventory-tab-content">
          {activeTab === 'party' && <PartyTab isInFight={isInFight} />}
          {activeTab === 'deck' && <DeckTab />}
          {activeTab === 'items' && <ItemsTab />}
        </div>
      </div>
    </div>
  );
};

// === Party Tab ===

const FORMATION_COLS = 3;
const FORMATION_ROWS = 5;

const PartyTab = ({ isInFight }: { isInFight: boolean }) => {
  const dispatch = useAppDispatch();
  const teamState = useAppSelector(selectTeamState);
  const { roster, activeTeam } = teamState;

  const activeCreatures = useMemo(
    () => roster.filter(c => activeTeam.includes(c.id)),
    [roster, activeTeam]
  );
  const reserveCreatures = useMemo(
    () => roster.filter(c => !activeTeam.includes(c.id)),
    [roster, activeTeam]
  );

  // Build grid lookup: "col,row" -> creature
  const gridMap = useMemo(() => {
    const map = new Map<string, PlayerCreature>();
    for (const c of activeCreatures) {
      map.set(`${c.formationPosition.col},${c.formationPosition.row}`, c);
    }
    return map;
  }, [activeCreatures]);

  const [swapSource, setSwapSource] = useState<{ col: number; row: number } | null>(null);
  const [selectedBench, setSelectedBench] = useState<string | null>(null);
  const [hoveredCreature, setHoveredCreature] = useState<PlayerCreature | null>(null);

  const handleSlotClick = (col: number, row: number) => {
    if (isInFight) return;
    const key = `${col},${row}`;
    const occupant = gridMap.get(key);

    // If a bench creature is selected and we click an active slot, swap them
    if (selectedBench && occupant) {
      dispatch(teamActions.swapActiveCreature({ activeId: occupant.id, reserveId: selectedBench }));
      setSelectedBench(null);
      return;
    }

    // Click-to-swap formation positions
    if (swapSource) {
      if (swapSource.col === col && swapSource.row === row) {
        setSwapSource(null);
        return;
      }
      const sourceKey = `${swapSource.col},${swapSource.row}`;
      const sourceCreature = gridMap.get(sourceKey);
      const targetCreature = gridMap.get(key);

      if (sourceCreature) {
        dispatch(teamActions.updateFormationPosition({
          creatureId: sourceCreature.id,
          formationPosition: { col, row },
        }));
      }
      if (targetCreature) {
        dispatch(teamActions.updateFormationPosition({
          creatureId: targetCreature.id,
          formationPosition: swapSource,
        }));
      }
      setSwapSource(null);
      return;
    }

    if (occupant) {
      setSwapSource({ col, row });
      setSelectedBench(null);
    }
  };

  const handleBenchClick = (creatureId: string) => {
    if (isInFight) return;
    setSelectedBench(prev => prev === creatureId ? null : creatureId);
    setSwapSource(null);
  };

  return (
    <div className={`party-layout ${isInFight ? 'inventory-disabled' : ''}`}>
      <div className="party-formation">
        <h4>Formation</h4>
        <div className="party-formation-grid">
          {Array.from({ length: FORMATION_ROWS }, (_, row) =>
            Array.from({ length: FORMATION_COLS }, (_, col) => {
              const key = `${col},${row}`;
              const creature = gridMap.get(key);
              const isSwapSource = swapSource?.col === col && swapSource?.row === row;

              return (
                <div
                  key={key}
                  className={`formation-slot ${creature ? 'occupied' : ''} ${isSwapSource ? 'swap-active' : ''}`}
                  onClick={() => handleSlotClick(col, row)}
                  onMouseEnter={() => creature && setHoveredCreature(creature)}
                  onMouseLeave={() => setHoveredCreature(null)}
                >
                  {creature && (
                    <>
                      <div className="slot-sprite">{creature.name[0]}</div>
                      <div className="slot-name">{creature.name}</div>
                      <div className="slot-hp">{creature.currentHp}/{creature.maxHp}</div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="party-bench">
        <h4>Reserve</h4>
        <div className="reserve-bench">
          {reserveCreatures.length === 0 ? (
            <div className="bench-empty">No reserve creatures</div>
          ) : (
            reserveCreatures.map(c => (
              <div
                key={c.id}
                className={`bench-creature ${selectedBench === c.id ? 'selected' : ''}`}
                onClick={() => handleBenchClick(c.id)}
                onMouseEnter={() => setHoveredCreature(c)}
                onMouseLeave={() => setHoveredCreature(null)}
              >
                <div className="bench-sprite">{c.name[0]}</div>
                <div className="bench-info">
                  <div className="bench-name">{c.name}</div>
                  <div className="bench-hp">{c.currentHp}/{c.maxHp} HP</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="party-detail">
        <h4>Details</h4>
        {hoveredCreature ? (
          <CreatureDetails creature={hoveredCreature} />
        ) : (
          <div className="detail-empty">Hover over a creature to see details</div>
        )}
      </div>
    </div>
  );
};

const CreatureDetails = ({ creature }: { creature: PlayerCreature }) => {
  const hpPercent = (creature.currentHp / creature.maxHp) * 100;
  const cards = creature.cards
    .map(id => cardTemplates[id])
    .filter(Boolean);

  return (
    <div className="creature-detail-panel">
      <div className="detail-name">{creature.name}</div>
      <div className="detail-stats">
        <span>Lv <strong>{creature.level}</strong></span>
        <span>Init <strong>{creature.initiative}</strong></span>
        <span>XP <strong>{creature.experience}/{creature.experienceToNextLevel}</strong></span>
      </div>
      <div className="detail-hp-bar">
        <div className="detail-hp-fill" style={{ width: `${hpPercent}%` }} />
      </div>
      <div className="detail-cards">
        <h5>Cards ({cards.length})</h5>
        <div className="detail-card-list">
          {cards.map(card => (
            <div key={card.id} className="detail-card-item">
              <span className="card-cost">{card.manaCost}</span>
              <span className="card-title">{card.title}</span>
              <span className="card-type-badge">{card.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// === Deck Tab ===

const DeckTab = () => {
  const teamState = useAppSelector(selectTeamState);
  const neutralCardIds = useAppSelector(selectNeutralCards);
  const { roster, activeTeam } = teamState;

  const activeCreatures = useMemo(
    () => roster.filter(c => activeTeam.includes(c.id)),
    [roster, activeTeam]
  );

  const deckEntries = useMemo(() => {
    const entries: { cardId: string; title: string; type: string; manaCost: number; description: string; ownerName: string }[] = [];

    for (const creature of activeCreatures) {
      for (const cardId of creature.cards) {
        const template = cardTemplates[cardId];
        if (template) {
          entries.push({
            cardId: `${creature.id}-${cardId}`,
            title: template.title,
            type: template.type,
            manaCost: template.manaCost,
            description: template.description,
            ownerName: creature.name,
          });
        }
      }
    }

    for (const cardId of neutralCardIds) {
      const template = cardTemplates[cardId];
      if (template) {
        entries.push({
          cardId: `neutral-${cardId}`,
          title: template.title,
          type: template.type,
          manaCost: template.manaCost,
          description: template.description,
          ownerName: 'Neutral',
        });
      }
    }

    return entries;
  }, [activeCreatures, neutralCardIds]);

  return (
    <div>
      <div className="deck-count">{deckEntries.length} cards in deck</div>
      <div className="deck-card-list">
        {deckEntries.map((entry, i) => (
          <div key={`${entry.cardId}-${i}`} className="deck-card-entry">
            <div className="deck-card-cost">{entry.manaCost}</div>
            <div className="deck-card-info">
              <div className="deck-card-title">{entry.title}</div>
              <div className="deck-card-desc">{entry.description}</div>
            </div>
            <div className="deck-card-type">{entry.type}</div>
            <div className="deck-card-owner">{entry.ownerName}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// === Items Tab ===

const ItemsTab = () => {
  const gold = useAppSelector(selectGold);
  const artifacts = useAppSelector(selectArtifacts);

  return (
    <div className="items-layout">
      <div className="items-gold">
        <span className="gold-label">Gold</span>
        <span className="gold-value">{gold}</span>
      </div>

      <div className="items-artifacts">
        <h4>Artifacts</h4>
        {artifacts.length === 0 ? (
          <div className="artifacts-empty">No artifacts collected</div>
        ) : (
          <div className="artifact-grid">
            {artifacts.map(a => (
              <div key={a.id} className="artifact-item" title={a.description}>
                {a.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryOverlay;
