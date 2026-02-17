import PlayerHand from "./Deck/PlayerHand"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "././../../redux/hooks";
import { battleState, playerState, selectBattleState, selectPlayerState } from "../../redux";
import { selectPlayerCreatures, selectEnemyCreatures } from "../../redux/slices/BattleCreatures/battleCreaturesSelector";
import { selectBattleResult, selectTargetingMode, selectValidTargetIds } from "../../redux/slices/Battle/battleSelector";
import { selectCurrentNode } from "../../redux/slices/Map/mapSelector";
import { handleBattlePhase } from "./HandleBattlePhase"
import { resolveCardEffect } from "./resolveCardEffect";
import { store } from "../../redux/store";
import { isInZone, PLAYER_ZONE, ENEMY_ZONE } from "./gridConstants";
import { getAoeCells, parseAoeShape } from "./battleHelpers";
import InitiativeBar from "./InitiativeBar/InitiativeBar";
import CreatureUnit from "../../components/CreatureUnit";
import TargetingOverlay from "./TargetingOverlay";
import { BattleCreature, EnemyCreature } from "../../types/creature";
import { mapActions } from "../../redux/slices/Map/mapSlice";
import { teamActions } from "../../redux/slices/Team/teamSlice";
import { battleCreaturesState } from "../../redux/slices/BattleCreatures/battleCreaturesSlice";
import { menuState } from "../../redux/slices/Menu/menuSlice";
import { inventoryActions } from "../../redux/slices/Inventory/inventorySlice";
import { AudioEngine } from "../../audio";
import { statsActions } from "../../redux/slices/Stats/statsSlice";
import { unlockableCreatures } from "../../data/unlockableCreatures";
import RewardScreen from "./RewardScreen/RewardScreen";

interface LayerContext {
  layerContext: string;
  setLayerContext: (value: string) => void;
  onOpenInventory: () => void;
}

const FightLayer = ({ layerContext, setLayerContext, onOpenInventory }: LayerContext) => {
  const dispatch = useAppDispatch();
  const { phase, useCard, activeCard, targetCreatureId } = useAppSelector(selectBattleState);
  const playerSelector = useAppSelector(selectPlayerState);
  const playerCreatures = useAppSelector(selectPlayerCreatures);
  const enemyCreatures = useAppSelector(selectEnemyCreatures);
  const battleResult = useAppSelector(selectBattleResult);
  const targetingMode = useAppSelector(selectTargetingMode);
  const validTargetIds = useAppSelector(selectValidTargetIds);

  const currentNode = useAppSelector(selectCurrentNode);

  const nodeType = useMemo<'fight' | 'elite' | 'boss'>(() => {
    if (currentNode?.type === 'elite') return 'elite';
    if (currentNode?.type === 'boss') return 'boss';
    return 'fight';
  }, [currentNode]);

  const handleVictoryContinue = useCallback(() => {
    // Record battle stats
    dispatch(statsActions.recordBattleWon());

    // Record defeated enemies
    const deadEnemySpecies = enemyCreatures
      .filter(c => !c.isAlive)
      .map(c => c.speciesId);
    if (deadEnemySpecies.length > 0) {
      dispatch(statsActions.recordEnemyDefeatBatch(deadEnemySpecies));
    }

    // Check if this was a boss node → unlock boss-gated creatures
    if (currentNode?.type === 'boss') {
      const bossUnlocks = unlockableCreatures
        .filter(u => u.condition.type === 'defeat_first_boss')
        .map(u => u.unlock);
      if (bossUnlocks.length > 0) {
        dispatch(statsActions.grantUnlockBatch(bossUnlocks));
      }
    }

    // Sync surviving creature HP back to persistent roster
    const hpSync = playerCreatures.map(c => ({
      id: c.id,
      currentHp: c.currentHp,
      isAlive: c.isAlive,
    }));
    dispatch(teamActions.syncFromBattle(hpSync));

    dispatch(mapActions.completeCurrentNode());
    dispatch(battleCreaturesState.clearBattleCreatures());
    dispatch(playerState.resetAllPiles());
    dispatch(battleState.clearTargeting());
    dispatch(battleState.setBattleResult('ongoing'));
    setLayerContext('Map');
  }, [dispatch, enemyCreatures, playerCreatures, currentNode, setLayerContext]);

  const battleStationsRef = useRef<HTMLDivElement>(null);

  // Build position lookup: "col,row" -> creature
  const creaturesByPosition = useMemo(() => {
    const map = new Map<string, BattleCreature>();
    for (const c of playerCreatures) {
      if (c.gridPosition) {
        map.set(`${c.gridPosition.col},${c.gridPosition.row}`, c);
      }
    }
    for (const c of enemyCreatures) {
      if (c.gridPosition) {
        map.set(`${c.gridPosition.col},${c.gridPosition.row}`, c);
      }
    }
    return map;
  }, [playerCreatures, enemyCreatures]);

  useEffect(() => {
    dispatch(handleBattlePhase());
  }, [dispatch, phase]);

  const handleEndTurn = () => {
    AudioEngine.getInstance().playSfx('ui-click');
    dispatch(battleState.nextBattlePhase());
  };

  // Card effect resolution
  useEffect(() => {
    if (useCard) {
      if (!activeCard) {
        dispatch(battleState.useCard(false));
        return;
      }

      resolveCardEffect(dispatch, activeCard, targetCreatureId, store.getState);

      // Track card played
      dispatch(statsActions.incrementCardsPlayed());

      // Deduct mana
      dispatch(playerState.decrease({ state: 'mana', amount: activeCard.manaCost }));
      dispatch(battleState.clearTargeting());
      dispatch(battleState.useCard(false));
    }
  }, [activeCard, dispatch, useCard, targetCreatureId]);

  // Handle Escape key to cancel targeting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && targetingMode !== 'none') {
        dispatch(battleState.clearTargeting());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, targetingMode]);

  // Click on empty grid to cancel targeting
  const handleGridBackgroundClick = () => {
    if (targetingMode !== 'none') {
      dispatch(battleState.clearTargeting());
    }
  };

  // Click on a valid target creature
  const handleTargetClick = (creatureId: string) => {
    const creature = [...playerCreatures, ...enemyCreatures].find(c => c.id === creatureId);
    dispatch(battleState.setTargetCreature(creatureId));
    if (creature?.gridPosition) {
      dispatch(battleState.setTargetPosition(creature.gridPosition));
    }
    dispatch(battleState.useCard(true));
  };

  // Click on a cell (for cell-based targeting)
  const handleCellTargetClick = (col: number, row: number) => {
    dispatch(battleState.setTargetPosition({ col, row }));
    // If a creature occupies this cell, also set it as target
    const occupant = creaturesByPosition.get(`${col},${row}`);
    if (occupant) {
      dispatch(battleState.setTargetCreature(occupant.id));
    }
    dispatch(battleState.useCard(true));
  };

  const isTargetingActive = targetingMode !== 'none' && targetingMode !== 'auto';

  // Build flat click-target positions from actual grid cell screen rects
  const [targetRects, setTargetRects] = useState<Map<string, DOMRect>>(new Map());

  const isCellMode = targetingMode === 'enemy_cell' || targetingMode === 'ally_cell';

  // AOE preview: track which cell the mouse is hovering over in cell mode
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // Compute AOE/line preview cells from hovered position + active card effects
  const aoePreviewCells = useMemo(() => {
    if (!isCellMode || !hoveredCell || !activeCard) return new Set<string>();
    const [col, row] = hoveredCell.split(',').map(Number);

    // lineDamage: preview the entire row across the enemy zone
    if (activeCard.effect.lineDamage) {
      const cells = new Set<string>();
      for (let c = ENEMY_ZONE.colMin; c <= ENEMY_ZONE.colMax; c++) {
        cells.add(`${c},${row}`);
      }
      return cells;
    }

    // AOE with shape
    if (activeCard.effect.aoeShape) {
      const shape = parseAoeShape(activeCard.effect.aoeShape as string);
      const cells = getAoeCells({ col, row }, shape);
      return new Set(cells.map(c => `${c.col},${c.row}`));
    }

    return new Set<string>();
  }, [isCellMode, hoveredCell, activeCard]);

  // Enemy intent hover: track which enemy is being hovered
  const [hoveredEnemyId, setHoveredEnemyId] = useState<string | null>(null);

  // Compute which creature IDs are targeted by the hovered enemy's intent
  const intentTargetIds = useMemo(() => {
    if (!hoveredEnemyId) return new Set<string>();
    const enemy = enemyCreatures.find(c => c.id === hoveredEnemyId) as EnemyCreature | undefined;
    if (!enemy || !enemy.isAlive) return new Set<string>();
    const nextIntent = enemy.pattern[enemy.patternIndex];
    if (!nextIntent) return new Set<string>();

    const ids = new Set<string>();
    switch (nextIntent.action.targetType) {
      case 'self':
        ids.add(enemy.id);
        break;
      case 'single_enemy':
      case 'random_enemy':
        // Can't know exact target — highlight all potential targets
        for (const c of playerCreatures) {
          if (c.isAlive) ids.add(c.id);
        }
        break;
      case 'all_enemies':
        for (const c of playerCreatures) {
          if (c.isAlive) ids.add(c.id);
        }
        break;
      case 'single_ally':
        for (const c of enemyCreatures) {
          if (c.isAlive && c.id !== enemy.id) ids.add(c.id);
        }
        break;
      case 'all_allies':
        for (const c of enemyCreatures) {
          if (c.isAlive) ids.add(c.id);
        }
        break;
    }
    return ids;
  }, [hoveredEnemyId, enemyCreatures, playerCreatures]);

  // Is the active card a summon card?
  const isSummonCard = !!(activeCard?.effect?.summon);

  // Clear AOE hover when targeting mode changes
  useEffect(() => {
    setHoveredCell(null);
  }, [targetingMode]);

  const computeTargetRects = useCallback(() => {
    if (!isTargetingActive || !battleStationsRef.current) {
      setTargetRects(new Map());
      return;
    }
    const containerRect = battleStationsRef.current.getBoundingClientRect();
    const rects = new Map<string, DOMRect>();

    if (isCellMode) {
      // Cell mode: iterate all cells in the appropriate zone
      const zone = targetingMode === 'enemy_cell' ? ENEMY_ZONE : PLAYER_ZONE;
      for (let col = zone.colMin; col <= zone.colMax; col++) {
        for (let row = zone.rowMin; row <= zone.rowMax; row++) {
          const key = `${col},${row}`;
          // Summon cards skip occupied cells
          if (isSummonCard && creaturesByPosition.has(key)) continue;
          const cellEl = document.getElementById(key);
          if (!cellEl) continue;
          const cellRect = cellEl.getBoundingClientRect();
          rects.set(key, new DOMRect(
            cellRect.left - containerRect.left,
            cellRect.top - containerRect.top,
            cellRect.width,
            cellRect.height,
          ));
        }
      }
    } else {
      // Creature mode: only occupied cells with valid target IDs
      const allCreatures = [...playerCreatures, ...enemyCreatures];
      for (const creature of allCreatures) {
        if (!creature.gridPosition || !validTargetIds.includes(creature.id)) continue;
        const cellEl = document.getElementById(`${creature.gridPosition.col},${creature.gridPosition.row}`);
        if (!cellEl) continue;
        const cellRect = cellEl.getBoundingClientRect();
        rects.set(creature.id, new DOMRect(
          cellRect.left - containerRect.left,
          cellRect.top - containerRect.top,
          cellRect.width,
          cellRect.height,
        ));
      }
    }

    setTargetRects(rects);
  }, [isTargetingActive, isCellMode, targetingMode, playerCreatures, enemyCreatures, validTargetIds, isSummonCard, creaturesByPosition]);

  useEffect(() => {
    computeTargetRects();
    window.addEventListener('resize', computeTargetRects);
    return () => window.removeEventListener('resize', computeTargetRects);
  }, [computeTargetRects]);

  // Compute set of targetable cell keys for visual feedback
  const targetableCells = useMemo(() => {
    if (!isCellMode) return new Set<string>();
    const zone = targetingMode === 'enemy_cell' ? ENEMY_ZONE : PLAYER_ZONE;
    const cells = new Set<string>();
    for (let col = zone.colMin; col <= zone.colMax; col++) {
      for (let row = zone.rowMin; row <= zone.rowMax; row++) {
        const key = `${col},${row}`;
        // Summon cards can only target empty cells
        if (isSummonCard && creaturesByPosition.has(key)) continue;
        cells.add(key);
      }
    }
    return cells;
  }, [isCellMode, targetingMode, isSummonCard, creaturesByPosition]);

  const getZoneClass = (col: number, row: number): string => {
    if (isInZone(col, row, PLAYER_ZONE)) return 'player-zone';
    if (isInZone(col, row, ENEMY_ZONE)) return 'enemy-zone';
    return 'neutral-zone';
  };

  return (
    <div className={`layer-01-container ${layerContext !== 'Fight' ? 'layer-hidden' : ''}`}>
      <div className="run-info">
        <div className="info-character">
          <div>Team</div>
          <div>{playerCreatures.filter(c => c.isAlive).length}/{playerCreatures.length} alive</div>
        </div>
        <div className="info-floor">Current Floor</div>
        <div className="info-system">
          <div onClick={() => setLayerContext("Map")}>Map</div>
          <div onClick={onOpenInventory} style={{ cursor: 'pointer' }}>deck</div>
          <div>controls</div>
        </div>
      </div>

      <div className="artifact-bar"></div>

      <div className="battle-stations" ref={battleStationsRef}>
        <InitiativeBar />
        {/* Battle grid with creatures placed on cells */}
        <div className="grid-perspective">
          <div className="grid" onClick={handleGridBackgroundClick}>
            {[...Array(10)].map((_x, rowIndex) => (
              <div
                key={"grid-row-" + rowIndex}
                className="grid-row"
              >
                {[...Array(10)].map((_y, colIndex) => {
                  const cellKey = `${colIndex},${rowIndex}`;
                  const creature = creaturesByPosition.get(cellKey);
                  const zoneClass = getZoneClass(colIndex, rowIndex);
                  const isValid = creature ? validTargetIds.includes(creature.id) : false;
                  const isCellTargetable = targetableCells.has(cellKey);
                  const isAoePreview = aoePreviewCells.has(cellKey);
                  const isIntentTarget = creature ? intentTargetIds.has(creature.id) : false;

                  return (
                    <div
                      id={cellKey}
                      key={"grid-item-" + colIndex + "-" + rowIndex}
                      className={`grid-item ${zoneClass} ${isCellTargetable ? 'cell-targetable' : ''} ${isAoePreview ? 'aoe-preview' : ''}`}
                    >
                      {creature && (
                        <div
                          className="grid-creature-wrapper"
                          onMouseEnter={() => creature.side === 'enemy' ? setHoveredEnemyId(creature.id) : undefined}
                          onMouseLeave={() => creature.side === 'enemy' ? setHoveredEnemyId(null) : undefined}
                        >
                          <CreatureUnit
                            creature={creature}
                            size={120}
                            isTargetingActive={isTargetingActive}
                            isValidTarget={isValid}
                            isIntentTarget={isIntentTarget}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>


        {/* Flat click-target overlay — outside 3D context, all targets equally clickable */}
        {isTargetingActive && (
          <div className="creature-click-overlay" onClick={handleGridBackgroundClick}>
            {[...targetRects.entries()].map(([key, rect]) => (
              <div
                key={key}
                className={isCellMode ? 'cell-click-target' : 'creature-click-target'}
                style={{
                  left: rect.x,
                  top: rect.y,
                  width: rect.width,
                  height: rect.height,
                }}
                onMouseEnter={isCellMode ? () => setHoveredCell(key) : undefined}
                onMouseLeave={isCellMode ? () => setHoveredCell(null) : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isCellMode) {
                    const [col, row] = key.split(',').map(Number);
                    handleCellTargetClick(col, row);
                  } else {
                    handleTargetClick(key);
                  }
                }}
              />
            ))}
          </div>
        )}

        <TargetingOverlay containerRef={battleStationsRef} />
      </div>

      {/* Battle result overlay */}
      {battleResult !== 'ongoing' && (
        <div className="battle-result-overlay">
          <div className="battle-result-content">
            <div className="battle-result-text">
              {battleResult === 'victory' ? 'Victory!' : 'Defeat'}
            </div>
            {battleResult === 'victory' && (
              <RewardScreen nodeType={nodeType} onContinue={handleVictoryContinue} />
            )}
            {battleResult === 'defeat' && (
              <div className="defeat-options">
                <button
                  className="battle-result-button"
                  onClick={() => {
                    dispatch(statsActions.recordBattleLost());
                    dispatch(statsActions.recordRunFailure());

                    dispatch(mapActions.clearMap());
                    dispatch(battleCreaturesState.clearBattleCreatures());
                    dispatch(playerState.resetAllPiles());
                    dispatch(battleState.clearTargeting());
                    dispatch(battleState.setBattleResult('ongoing'));
                    dispatch(teamActions.resetRoster());
                    dispatch(inventoryActions.resetInventory());
                    dispatch(menuState.resetMenu());
                    setLayerContext('Menu');
                  }}
                >
                  New Run
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card-area" onClick={handleGridBackgroundClick}>
        <div className="draw-and-mana">
          <div className="mana">
            <div className="mana-container">
              <div className="mana-value">
                {playerSelector.mana}
              </div>
            </div>
          </div>
          <div className="draw">
            <div className="draw-placeholder">
              {playerSelector.draw.length + "/" + playerSelector.deck.length}
            </div>
          </div>
        </div>
        <PlayerHand hand={playerSelector.hand} mana={playerSelector.mana} />

        <div className="discard-and-endTurn">
          <div className="discard-container">
            <div className="discard-placeholder">
              {playerSelector.discard.length}
            </div>
          </div>
          <div className="end-turn-container">
            <button disabled={phase !== "player_card_phase"} className="end-turn-button" onClick={() => handleEndTurn()}>End Turn</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FightLayer
