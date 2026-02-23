import { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { inventoryActions } from '../../redux/slices/Inventory/inventorySlice';
import { teamActions } from '../../redux/slices/Team/teamSlice';
import { statsActions } from '../../redux/slices/Stats/statsSlice';
import { selectGold, selectSlotItems, selectCardRemoveCount, selectCardUpgradeCount, selectRemovedCards, selectUpgradedCards } from '../../redux/slices/Inventory/inventorySelector';
import { selectActiveTeam } from '../../redux/slices/Team/teamSelector';
import { selectCurrentMapNumber, selectCurrentNode } from '../../redux/slices/Map/mapSelector';
import { generateShopInventory, ShopInventory } from '../../data/shopGenerator';
import { cardTemplates } from '../01_Fight/Deck/CardRegistry';
import { cardUpgrades } from '../../data/cardUpgrades';
import CardPickerModal from './CardPickerModal';
import KeywordText from '../../components/KeywordText';
import { SlotItem, SlotItemRarity } from '../../types/slotItem';
import { Artifact } from '../../types/inventory';

interface ShopScreenProps {
  onComplete: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  common: '#888',
  uncommon: '#4caf50',
  rare: '#f0c040',
};

const SELL_PRICE: Record<SlotItemRarity, number> = {
  common: 20,
  uncommon: 37,
  rare: 60,
};

function getRemoveCost(count: number): number {
  return Math.floor(50 * Math.pow(1.5, count));
}

function getUpgradeCost(count: number): number {
  return Math.floor(60 * Math.pow(1.5, count));
}

type CardPickerMode = 'remove' | 'upgrade' | null;

const ShopScreen = ({ onComplete }: ShopScreenProps) => {
  const dispatch = useAppDispatch();
  const gold = useAppSelector(selectGold);
  const inventorySlotItems = useAppSelector(selectSlotItems);
  const activeTeam = useAppSelector(selectActiveTeam);
  const currentMapNumber = useAppSelector(selectCurrentMapNumber);
  const currentNode = useAppSelector(selectCurrentNode);
  const cardRemoveCount = useAppSelector(selectCardRemoveCount);
  const cardUpgradeCount = useAppSelector(selectCardUpgradeCount);
  const removedCards = useAppSelector(selectRemovedCards);
  const upgradedCards = useAppSelector(selectUpgradedCards);

  const nodeLevel = currentNode ? parseInt(currentNode.id.split('-').pop() ?? '0', 10) : 0;

  const shop: ShopInventory = useMemo(
    () => generateShopInventory(currentMapNumber, nodeLevel),
    [currentMapNumber, nodeLevel]
  );

  const [purchasedItemIds, setPurchasedItemIds] = useState<Set<string>>(new Set());
  const [purchasedArtifactIds, setPurchasedArtifactIds] = useState<Set<string>>(new Set());
  const [removedThisVisit, setRemovedThisVisit] = useState(false);
  const [upgradedThisVisit, setUpgradedThisVisit] = useState(false);
  const [cardPickerMode, setCardPickerMode] = useState<CardPickerMode>(null);

  const removeCost = getRemoveCost(cardRemoveCount);
  const upgradeCost = getUpgradeCost(cardUpgradeCount);

  // Build list of all deck cards (creature cards + neutral)
  const allDeckCards = useMemo(() => {
    const cards: Array<{ templateId: string; title: string; manaCost: number; description: string; creatureName: string }> = [];
    for (const creature of activeTeam) {
      for (const cardId of creature.cards) {
        if (removedCards.includes(cardId)) continue;
        const template = cardTemplates[cardId];
        if (!template) continue;
        const isUpgraded = upgradedCards.includes(cardId);
        const upgrade = isUpgraded ? cardUpgrades[cardId] : undefined;
        cards.push({
          templateId: cardId,
          title: upgrade?.upgradedTitle ?? template.title,
          manaCost: upgrade?.upgradedManaCost ?? template.manaCost,
          description: upgrade?.upgradedDescription ?? template.description,
          creatureName: creature.name,
        });
      }
    }
    return cards;
  }, [activeTeam, removedCards, upgradedCards]);

  // Collect all player-owned items (inventory + equipped)
  const allPlayerItems = useMemo(() => {
    const items: Array<{ item: SlotItem; equippedBy: string | null }> = [];
    for (const item of inventorySlotItems) {
      items.push({ item, equippedBy: null });
    }
    for (const creature of activeTeam) {
      for (const item of creature.equippedSlots) {
        items.push({ item, equippedBy: creature.name });
      }
    }
    return items;
  }, [inventorySlotItems, activeTeam]);

  const handleBuyItem = (instanceId: string, price: number, item: SlotItem) => {
    if (gold < price || purchasedItemIds.has(instanceId)) return;
    dispatch(inventoryActions.spendGold(price));
    dispatch(statsActions.addGoldSpent(price));
    dispatch(inventoryActions.addSlotItem(item));
    setPurchasedItemIds(prev => new Set(prev).add(instanceId));
  };

  const handleBuyArtifact = (artifactId: string, price: number, artifact: Artifact) => {
    if (gold < price || purchasedArtifactIds.has(artifactId)) return;
    dispatch(inventoryActions.spendGold(price));
    dispatch(statsActions.addGoldSpent(price));
    dispatch(inventoryActions.addArtifact(artifact));
    setPurchasedArtifactIds(prev => new Set(prev).add(artifactId));
  };

  const handleSellItem = (item: SlotItem, equippedByCreatureId: string | null) => {
    const sellPrice = SELL_PRICE[item.rarity];
    if (equippedByCreatureId) {
      dispatch(teamActions.unequipSlotItem({ creatureId: equippedByCreatureId, instanceId: item.instanceId }));
    }
    dispatch(inventoryActions.removeSlotItem(item.instanceId));
    dispatch(inventoryActions.addGold(sellPrice));
  };

  const handleOpenRemove = () => {
    if (removedThisVisit || gold < removeCost) return;
    setCardPickerMode('remove');
  };

  const handleOpenUpgrade = () => {
    if (upgradedThisVisit || gold < upgradeCost) return;
    setCardPickerMode('upgrade');
  };

  const handlePickCardToRemove = (templateId: string) => {
    dispatch(inventoryActions.spendGold(removeCost));
    dispatch(statsActions.addGoldSpent(removeCost));
    dispatch(inventoryActions.removeCard(templateId));
    dispatch(inventoryActions.incrementRemoveCount());
    setRemovedThisVisit(true);
    setCardPickerMode(null);
  };

  const handlePickCardToUpgrade = (templateId: string) => {
    dispatch(inventoryActions.spendGold(upgradeCost));
    dispatch(statsActions.addGoldSpent(upgradeCost));
    dispatch(inventoryActions.upgradeCard(templateId));
    dispatch(inventoryActions.incrementUpgradeCount());
    setUpgradedThisVisit(true);
    setCardPickerMode(null);
  };

  // Cards shown in the picker filtered to what's valid for the current mode
  const cardPickerCards = useMemo(() => {
    if (!cardPickerMode) return [];
    if (cardPickerMode === 'upgrade') {
      return allDeckCards.filter(card => cardUpgrades[card.templateId] && !upgradedCards.includes(card.templateId));
    }
    return allDeckCards;
  }, [cardPickerMode, allDeckCards, upgradedCards]);

  // Find creature ID by name for selling equipped items
  const getCreatureIdByName = (name: string): string | null => {
    const creature = activeTeam.find(c => c.name === name);
    return creature?.id ?? null;
  };

  return (
    <div className="map-screen-overlay">
      <div className="map-screen-content shop-content">
        <div className="shop-header">
          <h2 className="map-screen-title">Shop</h2>
          <div className="shop-gold">
            <span className="gold-icon">$</span>
            <span className="gold-amount">{gold}</span>
          </div>
        </div>

        {/* Top section: wares + services */}
        <div className="shop-wares">
          <h3 className="shop-section-title">Wares</h3>
          <div className="shop-items-grid">
            {shop.slotItems.map(({ item, price }) => {
              const sold = purchasedItemIds.has(item.instanceId);
              const cantAfford = gold < price;
              return (
                <div
                  key={item.instanceId}
                  className={`shop-item-card ${sold ? 'sold' : ''} ${cantAfford && !sold ? 'cant-afford' : ''}`}
                  style={{ borderColor: RARITY_COLORS[item.rarity] }}
                >
                  <div className="shop-item-name">{item.name}</div>
                  <div className="shop-item-desc"><KeywordText text={item.description} /></div>
                  <div className="shop-item-rarity" style={{ color: RARITY_COLORS[item.rarity] }}>
                    {item.rarity}
                  </div>
                  {sold ? (
                    <div className="shop-sold-badge">SOLD</div>
                  ) : (
                    <button
                      className="shop-buy-btn"
                      disabled={cantAfford}
                      onClick={() => handleBuyItem(item.instanceId, price, item)}
                    >
                      Buy - {price}g
                    </button>
                  )}
                </div>
              );
            })}
            {shop.artifacts.map(({ artifact, price, rarity }) => {
              const sold = purchasedArtifactIds.has(artifact.id);
              const cantAfford = gold < price;
              return (
                <div
                  key={artifact.id}
                  className={`shop-item-card ${sold ? 'sold' : ''} ${cantAfford && !sold ? 'cant-afford' : ''}`}
                  style={{ borderColor: RARITY_COLORS[rarity] ?? '#888' }}
                >
                  <div className="shop-item-name">{artifact.name}</div>
                  <div className="shop-item-desc"><KeywordText text={artifact.description} /></div>
                  <div className="shop-item-rarity" style={{ color: RARITY_COLORS[rarity] ?? '#888' }}>
                    {rarity} artifact
                  </div>
                  {sold ? (
                    <div className="shop-sold-badge">SOLD</div>
                  ) : (
                    <button
                      className="shop-buy-btn"
                      disabled={cantAfford}
                      onClick={() => handleBuyArtifact(artifact.id, price, artifact)}
                    >
                      Buy - {price}g
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Card services */}
          <h3 className="shop-section-title">Services</h3>
          <div className="shop-services">
            <button
              className={`map-screen-btn shop-service-btn ${removedThisVisit ? 'disabled' : ''}`}
              disabled={removedThisVisit || gold < removeCost}
              onClick={handleOpenRemove}
            >
              Remove a Card - {removeCost}g
              {removedThisVisit && <span className="service-used"> (Used)</span>}
            </button>
            <button
              className={`map-screen-btn shop-service-btn ${upgradedThisVisit ? 'disabled' : ''}`}
              disabled={upgradedThisVisit || gold < upgradeCost}
              onClick={handleOpenUpgrade}
            >
              Upgrade a Card - {upgradeCost}g
              {upgradedThisVisit && <span className="service-used"> (Used)</span>}
            </button>
          </div>
        </div>

        {/* Bottom section: player's items */}
        <div className="shop-inventory">
          <h3 className="shop-section-title">Your Items</h3>
          {allPlayerItems.length === 0 ? (
            <div className="shop-empty-inventory">No items owned</div>
          ) : (
            <div className="shop-sell-grid">
              {allPlayerItems.map(({ item, equippedBy }) => (
                <div key={item.instanceId} className="shop-sell-item" style={{ borderColor: RARITY_COLORS[item.rarity] }}>
                  <div className="shop-sell-info">
                    <span className="shop-sell-name">{item.name}</span>
                    <span className="shop-sell-rarity" style={{ color: RARITY_COLORS[item.rarity] }}>
                      {item.rarity}
                    </span>
                    {equippedBy && <span className="shop-equipped-badge">Equipped by {equippedBy}</span>}
                  </div>
                  <button
                    className="shop-sell-btn"
                    onClick={() => handleSellItem(item, equippedBy ? getCreatureIdByName(equippedBy) : null)}
                  >
                    Sell - {SELL_PRICE[item.rarity]}g
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="map-screen-actions">
          <button className="map-screen-btn leave-btn" onClick={onComplete}>
            Leave Shop
          </button>
        </div>

        {/* Card picker modal */}
        {cardPickerMode && (
          <CardPickerModal
            title={cardPickerMode === 'remove' ? 'Choose a card to remove' : 'Choose a card to upgrade'}
            cards={cardPickerCards}
            showUpgradePreview={cardPickerMode === 'upgrade'}
            onSelect={cardPickerMode === 'remove' ? handlePickCardToRemove : handlePickCardToUpgrade}
            onClose={() => setCardPickerMode(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ShopScreen;
