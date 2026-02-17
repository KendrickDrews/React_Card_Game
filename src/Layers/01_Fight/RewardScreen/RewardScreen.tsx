import { useState, useMemo } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { inventoryActions } from '../../../redux/slices/Inventory/inventorySlice';
import { generateRewards, BattleRewards } from '../../../data/rewardGenerator';
import { cardTemplates } from '../Deck/CardRegistry';
import { SlotItem } from '../../../types/slotItem';
import './RewardScreen.scss';

interface RewardScreenProps {
  nodeType: 'fight' | 'elite' | 'boss';
  onContinue: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  common: '#888',
  uncommon: '#4caf50',
  rare: '#f0c040',
};

const RewardScreen = ({ nodeType, onContinue }: RewardScreenProps) => {
  const dispatch = useAppDispatch();

  const rewards: BattleRewards = useMemo(() => {
    const r = generateRewards(nodeType);
    // Auto-collect gold
    dispatch(inventoryActions.addGold(r.gold));
    return r;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeType]);

  const [pickedCard, setPickedCard] = useState<string | null>(null);
  const [cardSkipped, setCardSkipped] = useState(false);
  const [pickedEliteItem, setPickedEliteItem] = useState(false);
  const [eliteSkipped, setEliteSkipped] = useState(false);
  const [pickedBossItem, setPickedBossItem] = useState<string | null>(null);
  const [bossSkipped, setBossSkipped] = useState(false);

  const handlePickCard = (cardId: string) => {
    if (pickedCard || cardSkipped) return;
    setPickedCard(cardId);
    dispatch(inventoryActions.addNeutralCard(cardId));
  };

  const handleSkipCards = () => {
    if (pickedCard || cardSkipped) return;
    setCardSkipped(true);
  };

  const handleTakeEliteItem = (item: SlotItem) => {
    if (pickedEliteItem || eliteSkipped) return;
    setPickedEliteItem(true);
    dispatch(inventoryActions.addSlotItem(item));
  };

  const handleSkipEliteItem = () => {
    if (pickedEliteItem || eliteSkipped) return;
    setEliteSkipped(true);
  };

  const handlePickBossItem = (item: SlotItem) => {
    if (pickedBossItem || bossSkipped) return;
    setPickedBossItem(item.instanceId);
    dispatch(inventoryActions.addSlotItem(item));
  };

  const handleSkipBossItems = () => {
    if (pickedBossItem || bossSkipped) return;
    setBossSkipped(true);
  };

  return (
    <div className="reward-screen">
      <div className="reward-rows">
        {/* Gold row */}
        <div className="reward-row reward-collected">
          <span className="reward-label">Gold</span>
          <span className="reward-gold-value">+{rewards.gold}</span>
        </div>

        {/* Card choice row */}
        {rewards.cardChoices && (
          <div className={`reward-row ${pickedCard || cardSkipped ? 'reward-resolved' : ''}`}>
            <div className="reward-row-header">
              <span className="reward-label">Card Reward</span>
              {!pickedCard && !cardSkipped && (
                <button className="reward-skip-btn" onClick={handleSkipCards}>Skip</button>
              )}
              {cardSkipped && <span className="reward-skipped-text">Skipped</span>}
            </div>
            <div className="reward-card-choices">
              {rewards.cardChoices.map(cardId => {
                const template = cardTemplates[cardId];
                if (!template) return null;
                const isPicked = pickedCard === cardId;
                const isDisabled = (pickedCard !== null && !isPicked) || cardSkipped;
                return (
                  <div
                    key={cardId}
                    className={`reward-card-option ${isPicked ? 'picked' : ''} ${isDisabled ? 'disabled' : ''}`}
                    onClick={() => handlePickCard(cardId)}
                  >
                    <div className="reward-card-cost">{template.manaCost}</div>
                    <div className="reward-card-name">{template.title}</div>
                    <div className="reward-card-desc">{template.description}</div>
                    {isPicked && <div className="reward-picked-badge">Added</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Elite slot item drop */}
        {rewards.slotItemDrop && (
          <div className={`reward-row ${pickedEliteItem || eliteSkipped ? 'reward-resolved' : ''}`}>
            <div className="reward-row-header">
              <span className="reward-label">Slot Item</span>
              {!pickedEliteItem && !eliteSkipped && (
                <button className="reward-skip-btn" onClick={handleSkipEliteItem}>Skip</button>
              )}
              {eliteSkipped && <span className="reward-skipped-text">Skipped</span>}
            </div>
            <div className="reward-item-choices">
              <div
                className={`reward-item-option ${pickedEliteItem ? 'picked' : ''} ${eliteSkipped ? 'disabled' : ''}`}
                style={{ borderColor: RARITY_COLORS[rewards.slotItemDrop.rarity] }}
                onClick={() => handleTakeEliteItem(rewards.slotItemDrop!)}
              >
                <div className="reward-item-name">{rewards.slotItemDrop.name}</div>
                <div className="reward-item-desc">{rewards.slotItemDrop.description}</div>
                <div className="reward-item-rarity" style={{ color: RARITY_COLORS[rewards.slotItemDrop.rarity] }}>
                  {rewards.slotItemDrop.rarity}
                </div>
                {pickedEliteItem && <div className="reward-picked-badge">Taken</div>}
              </div>
            </div>
          </div>
        )}

        {/* Boss slot choices */}
        {rewards.bossSlotChoices && (
          <div className={`reward-row ${pickedBossItem || bossSkipped ? 'reward-resolved' : ''}`}>
            <div className="reward-row-header">
              <span className="reward-label">Choose a Slot Item</span>
              {!pickedBossItem && !bossSkipped && (
                <button className="reward-skip-btn" onClick={handleSkipBossItems}>Skip All</button>
              )}
              {bossSkipped && <span className="reward-skipped-text">Skipped</span>}
            </div>
            <div className="reward-item-choices">
              {rewards.bossSlotChoices.map(item => {
                const isPicked = pickedBossItem === item.instanceId;
                const isDisabled = (pickedBossItem !== null && !isPicked) || bossSkipped;
                return (
                  <div
                    key={item.instanceId}
                    className={`reward-item-option ${isPicked ? 'picked' : ''} ${isDisabled ? 'disabled' : ''}`}
                    style={{ borderColor: RARITY_COLORS[item.rarity] }}
                    onClick={() => handlePickBossItem(item)}
                  >
                    <div className="reward-item-name">{item.name}</div>
                    <div className="reward-item-desc">{item.description}</div>
                    <div className="reward-item-rarity" style={{ color: RARITY_COLORS[item.rarity] }}>
                      {item.rarity}
                    </div>
                    {isPicked && <div className="reward-picked-badge">Taken</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <button className="battle-result-button" onClick={onContinue}>
        Continue to Map
      </button>
    </div>
  );
};

export default RewardScreen;
