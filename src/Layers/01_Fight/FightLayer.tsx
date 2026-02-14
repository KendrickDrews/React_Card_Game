import PlayerHand from "./Deck/PlayerHand"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "././../../redux/hooks";
import { battleState, playerState, selectBattleState, selectPlayerState } from "../../redux";
import { selectPlayerCreatures, selectEnemyCreatures } from "../../redux/slices/BattleCreatures/battleCreaturesSelector";
import { selectBattleResult, selectTargetingMode, selectValidTargetIds } from "../../redux/slices/Battle/battleSelector";
import { handleBattlePhase } from "./HandleBattlePhase"
import { resolveCardEffect } from "./resolveCardEffect";
import { store } from "../../redux/store";
import { isInZone, PLAYER_ZONE, ENEMY_ZONE } from "./gridConstants";
import InitiativeBar from "./InitiativeBar/InitiativeBar";
import CreatureUnit from "../../components/CreatureUnit";
import TargetingOverlay from "./TargetingOverlay";
import { BattleCreature } from "../../types/creature";
import { mapActions } from "../../redux/slices/Map/mapSlice";
import { teamActions } from "../../redux/slices/Team/teamSlice";
import { battleCreaturesState } from "../../redux/slices/BattleCreatures/battleCreaturesSlice";

interface LayerContext {
  layerContext: string;
  setLayerContext: (value: string) => void;
}

const FightLayer = ({ layerContext, setLayerContext }: LayerContext) => {
  const dispatch = useAppDispatch();
  const { phase, useCard, activeCard, targetCreatureId } = useAppSelector(selectBattleState);
  const playerSelector = useAppSelector(selectPlayerState);
  const playerCreatures = useAppSelector(selectPlayerCreatures);
  const enemyCreatures = useAppSelector(selectEnemyCreatures);
  const battleResult = useAppSelector(selectBattleResult);
  const targetingMode = useAppSelector(selectTargetingMode);
  const validTargetIds = useAppSelector(selectValidTargetIds);

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
    dispatch(battleState.setTargetCreature(creatureId));
    dispatch(battleState.useCard(true));
  };

  const isTargetingActive = targetingMode !== 'none' && targetingMode !== 'auto';

  // Build flat click-target positions from actual grid cell screen rects
  const [targetRects, setTargetRects] = useState<Map<string, DOMRect>>(new Map());

  const computeTargetRects = useCallback(() => {
    if (!isTargetingActive || !battleStationsRef.current) {
      setTargetRects(new Map());
      return;
    }
    const containerRect = battleStationsRef.current.getBoundingClientRect();
    const rects = new Map<string, DOMRect>();
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
    setTargetRects(rects);
  }, [isTargetingActive, playerCreatures, enemyCreatures, validTargetIds]);

  useEffect(() => {
    computeTargetRects();
    window.addEventListener('resize', computeTargetRects);
    return () => window.removeEventListener('resize', computeTargetRects);
  }, [computeTargetRects]);

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
          <div>deck</div>
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
                  const creature = creaturesByPosition.get(`${colIndex},${rowIndex}`);
                  const zoneClass = getZoneClass(colIndex, rowIndex);
                  const isValid = creature ? validTargetIds.includes(creature.id) : false;

                  return (
                    <div
                      id={`${colIndex},${rowIndex}`}
                      key={"grid-item-" + colIndex + "-" + rowIndex}
                      className={`grid-item ${zoneClass}`}
                    >
                      {creature && (
                        <div className="grid-creature-wrapper">
                          <CreatureUnit
                            creature={creature}
                            size={120}
                            isTargetingActive={isTargetingActive}
                            isValidTarget={isValid}
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
            {[...targetRects.entries()].map(([creatureId, rect]) => (
              <div
                key={creatureId}
                className="creature-click-target"
                style={{
                  left: rect.x,
                  top: rect.y,
                  width: rect.width,
                  height: rect.height,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTargetClick(creatureId);
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
              <div className="rewards-placeholder">
                <p>Rewards go here (placeholder)</p>
                <button
                  className="battle-result-button"
                  onClick={() => {
                    dispatch(mapActions.completeCurrentNode());
                    dispatch(battleCreaturesState.clearBattleCreatures());
                    dispatch(playerState.resetAllPiles());
                    dispatch(battleState.clearTargeting());
                    dispatch(battleState.setBattleResult('ongoing'));
                    setLayerContext('Map');
                  }}
                >
                  Continue to Map
                </button>
              </div>
            )}
            {battleResult === 'defeat' && (
              <div className="defeat-options">
                <button
                  className="battle-result-button"
                  onClick={() => {
                    dispatch(mapActions.clearMap());
                    dispatch(battleCreaturesState.clearBattleCreatures());
                    dispatch(playerState.resetAllPiles());
                    dispatch(battleState.clearTargeting());
                    dispatch(battleState.setBattleResult('ongoing'));
                    dispatch(teamActions.fullyHealTeam());
                    setLayerContext('Map');
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
            <button className="end-turn-button" onClick={() => handleEndTurn()}>End Turn</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FightLayer
