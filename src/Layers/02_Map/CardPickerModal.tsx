import { cardUpgrades } from '../../data/cardUpgrades';

export interface CardPickerItem {
  templateId: string;
  title: string;
  manaCost: number;
  description: string;
  creatureName: string;
}

interface CardPickerModalProps {
  title: string;
  cards: CardPickerItem[];
  showUpgradePreview?: boolean;
  onSelect: (templateId: string) => void;
  onClose: () => void;
}

const CardPickerModal = ({ title, cards, showUpgradePreview = false, onSelect, onClose }: CardPickerModalProps) => (
  <div className="card-picker-overlay" onClick={onClose}>
    <div className="card-picker-modal" onClick={e => e.stopPropagation()}>
      <h3 className="card-picker-title">{title}</h3>
      <div className="card-picker-list">
        {cards.map((card, idx) => {
          const upgrade = showUpgradePreview ? cardUpgrades[card.templateId] : null;
          return (
            <div
              key={`${card.templateId}-${idx}`}
              className="card-picker-card"
              onClick={() => onSelect(card.templateId)}
            >
              <div className="card-picker-cost">{card.manaCost}</div>
              <div className="card-picker-info">
                <div className="card-picker-card-name">{card.title}</div>
                <div className="card-picker-card-desc">{card.description}</div>
                {upgrade && (
                  <div className="card-picker-upgrade-preview">
                    {'->'} {upgrade.upgradedTitle}: {upgrade.upgradedDescription}
                  </div>
                )}
              </div>
              <div className="card-picker-creature">{card.creatureName}</div>
            </div>
          );
        })}
      </div>
      <button className="map-screen-btn" onClick={onClose}>
        Cancel
      </button>
    </div>
  </div>
);

export default CardPickerModal;
