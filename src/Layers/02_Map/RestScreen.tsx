import { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { teamActions } from '../../redux/slices/Team/teamSlice';
import { inventoryActions } from '../../redux/slices/Inventory/inventorySlice';
import { selectRemovedCards, selectUpgradedCards } from '../../redux/slices/Inventory/inventorySelector';
import { selectActiveTeam } from '../../redux/slices/Team/teamSelector';
import { cardTemplates } from '../01_Fight/Deck/CardRegistry';
import { cardUpgrades } from '../../data/cardUpgrades';
import CardPickerModal from './CardPickerModal';

interface RestScreenProps {
  onComplete: () => void;
}

const RestScreen = ({ onComplete }: RestScreenProps) => {
  const dispatch = useAppDispatch();
  const [choiceMade, setChoiceMade] = useState(false);
  const [showCardPicker, setShowCardPicker] = useState(false);

  const activeTeam = useAppSelector(selectActiveTeam);
  const removedCards = useAppSelector(selectRemovedCards);
  const upgradedCards = useAppSelector(selectUpgradedCards);

  const upgradeableDeckCards = useMemo(() => {
    const cards: Array<{ templateId: string; title: string; manaCost: number; description: string; creatureName: string }> = [];
    for (const creature of activeTeam) {
      for (const cardId of creature.cards) {
        if (removedCards.includes(cardId)) continue;
        if (upgradedCards.includes(cardId)) continue;
        if (!cardUpgrades[cardId]) continue;
        const template = cardTemplates[cardId];
        if (!template) continue;
        cards.push({
          templateId: cardId,
          title: template.title,
          manaCost: template.manaCost,
          description: template.description,
          creatureName: creature.name,
        });
      }
    }
    return cards;
  }, [activeTeam, removedCards, upgradedCards]);

  const handleHeal = () => {
    dispatch(teamActions.healTeamByPercent(25));
    setChoiceMade(true);
  };

  const handleStatIncrease = () => {
    // Placeholder — future implementation
    setChoiceMade(true);
  };

  const handleOpenUpgrade = () => {
    if (choiceMade || upgradeableDeckCards.length === 0) return;
    setShowCardPicker(true);
  };

  const handlePickCardToUpgrade = (templateId: string) => {
    dispatch(inventoryActions.upgradeCard(templateId));
    dispatch(inventoryActions.incrementUpgradeCount());
    setShowCardPicker(false);
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
            className={`map-screen-btn rest-btn ${choiceMade || upgradeableDeckCards.length === 0 ? 'disabled' : ''}`}
            disabled={choiceMade || upgradeableDeckCards.length === 0}
            onClick={handleOpenUpgrade}
          >
            Upgrade Card {upgradeableDeckCards.length === 0 ? '(No cards)' : ''}
          </button>
          <button className="map-screen-btn leave-btn" onClick={onComplete}>
            Leave Rest Area
          </button>
        </div>

        {showCardPicker && (
          <CardPickerModal
            title="Choose a card to upgrade"
            cards={upgradeableDeckCards}
            showUpgradePreview
            onSelect={handlePickCardToUpgrade}
            onClose={() => setShowCardPicker(false)}
          />
        )}
      </div>
    </div>
  );
};

export default RestScreen;
