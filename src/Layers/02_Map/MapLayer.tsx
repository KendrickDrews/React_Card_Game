import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectCurrentMap, selectCurrentNodeId, selectCurrentNode, selectAvailableNodes, selectCompletedNodeIds, selectIsChoosingNextMap, selectCurrentMapNumber, selectTotalMaps } from '../../redux/slices/Map/mapSelector';
import { mapActions } from '../../redux/slices/Map/mapSlice';
import { battleState } from '../../redux/slices/Battle/battleSlice';
import { playerState } from '../../redux/slices/Player/playerSlice';
import { battleCreaturesState } from '../../redux/slices/BattleCreatures/battleCreaturesSlice';
import { generateMap } from '../../data/mapGenerator';
import { MapNodeType } from '../../types/map';
import MapNodeComponent, { nodeTypeIcons, nodeTypeColors } from './MapNode';
import MapConnections from './MapConnections';
import MapPlayerToken from './MapPlayerToken';
import { AudioEngine } from '../../audio';
import EventScreen from './EventScreen';
import RestScreen from './RestScreen';
import ShopScreen from './ShopScreen';
import MapChoiceScreen from './MapChoiceScreen';

interface LayerContext {
  layerContext: string;
  setLayerContext: (value: string) => void;
  onOpenInventory: () => void;
}

const ALL_NODE_TYPES: MapNodeType[] = ['start', 'fight', 'elite', 'boss', 'rest', 'shop', 'event'];

const NODE_TYPE_LABELS: Record<MapNodeType, string> = {
  start: 'Start',
  fight: 'Fight',
  elite: 'Elite',
  boss: 'Boss',
  rest: 'Rest',
  shop: 'Shop',
  event: 'Event',
};

const smoothScrollTo = (container: HTMLElement, targetTop: number, duration: number) => {
  const startTop = container.scrollTop;
  const distance = targetTop - startTop;
  const startTime = performance.now();
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
  const tick = (now: number) => {
    const progress = Math.min((now - startTime) / duration, 1);
    container.scrollTop = startTop + distance * easeOut(progress);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const MapLayer = ({ layerContext, setLayerContext, onOpenInventory }: LayerContext) => {
  const dispatch = useAppDispatch();
  const currentMap = useAppSelector(selectCurrentMap);
  const currentNodeId = useAppSelector(selectCurrentNodeId);
  const currentNode = useAppSelector(selectCurrentNode);
  const availableNodes = useAppSelector(selectAvailableNodes);
  const completedNodeIds = useAppSelector(selectCompletedNodeIds);
  const isChoosingNextMap = useAppSelector(selectIsChoosingNextMap);
  const currentMapNumber = useAppSelector(selectCurrentMapNumber);
  const totalMaps = useAppSelector(selectTotalMaps);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const introPlayedForMap = useRef<number>(-1);
  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [introTitle, setIntroTitle] = useState<'visible' | 'fade-out' | 'hidden'>('hidden');
  const [hoveredLegendType, setHoveredLegendType] = useState<MapNodeType | null>(null);
  const [modalDelayReady, setModalDelayReady] = useState(true);

  useEffect(() => () => {
    if (delayRef.current) clearTimeout(delayRef.current);
  }, []);

  const isVisible = layerContext === 'Map';
  const isNodeInProgress = currentNodeId !== null && !completedNodeIds.includes(currentNodeId);
  const currentNodeType = currentNode?.type ?? null;

  // Generate map if none exists when layer becomes visible
  useEffect(() => {
    if (isVisible && !currentMap && !isChoosingNextMap) {
      const map = generateMap();
      dispatch(mapActions.setMap(map));
    }
  }, [isVisible, currentMap, isChoosingNextMap, dispatch]);

  // Auto-scroll to current node + intro animation on first map entry
  useEffect(() => {
    if (!isVisible || !currentMap || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;

    if (introPlayedForMap.current !== currentMapNumber) {
      introPlayedForMap.current = currentMapNumber;

      container.scrollTo({ top: 0, behavior: 'instant' });
      setIntroTitle('visible');

      const fadeTimer = setTimeout(() => setIntroTitle('fade-out'), 1500);

      const scrollTimer = setTimeout(() => {
        const startEl = document.getElementById('map-node-0-0');
        if (startEl) {
          const nodeRect = startEl.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const scrollTop = container.scrollTop + (nodeRect.top - containerRect.top)
            - (containerRect.height / 2) + (nodeRect.height / 2);
          smoothScrollTo(container, scrollTop, 1500);
        }
        setIntroTitle('hidden');
      }, 2500);

      return () => { clearTimeout(fadeTimer); clearTimeout(scrollTimer); };
    }

    const timer = setTimeout(() => {
      if (!currentNodeId) return;
      const nodeEl = document.getElementById(`map-${currentNodeId}`);
      if (nodeEl && container) {
        const nodeRect = nodeEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollTop = container.scrollTop + (nodeRect.top - containerRect.top)
          - (containerRect.height / 2) + (nodeRect.height / 2);
        smoothScrollTo(container, scrollTop, 1500);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isVisible, currentNodeId, currentMap, currentMapNumber]);

  const handleNodeClick = (nodeId: string, nodeType: MapNodeType) => {
    if (isNodeInProgress) return;
    const isAvailable = availableNodes.some(n => n.id === nodeId);
    if (!isAvailable) return;

    AudioEngine.getInstance().playSfx('ui-click');
    dispatch(mapActions.setCurrentNode(nodeId));

    if (delayRef.current) clearTimeout(delayRef.current);

    if (nodeType === 'fight' || nodeType === 'elite' || nodeType === 'boss') {
      delayRef.current = setTimeout(() => {
        dispatch(playerState.resetAllPiles());
        dispatch(battleCreaturesState.clearBattleCreatures());
        dispatch(battleState.clearTargeting());
        dispatch(battleState.setBattleResult('ongoing'));
        dispatch(battleState.setShouldDraw(true));
        dispatch(battleState.setBattleStart(true));
        dispatch(battleState.setBattlePhase('turn_start'));
        dispatch(battleState.resetTurn());
        setLayerContext('Fight');
      }, 800);
    } else {
      setModalDelayReady(false);
      delayRef.current = setTimeout(() => setModalDelayReady(true), 800);
    }
  };

  const handleScreenComplete = () => {
    dispatch(mapActions.completeCurrentNode());
  };

  return (
    <div className={`layer-02-container ${!isVisible ? 'layer-hidden' : ''}`}>
      <div className="run-info">
        <div className="info-character">
          <div>Team</div>
          <div>HP</div>
          <div>Gold</div>
        </div>
        <div className="info-floor">
          Map {currentMapNumber}/{totalMaps} {currentNodeId ? `- ${currentNodeId}` : ''}
        </div>
        <div className="info-system">
          {isNodeInProgress && (
            <div className="return-to-fight" onClick={() => setLayerContext('Fight')}>
              Return to Fight
            </div>
          )}
          <div onClick={onOpenInventory} style={{ cursor: 'pointer' }}>deck</div>
          <div>controls</div>
        </div>
      </div>

      <div className="map-scroll-container" ref={scrollContainerRef}>
        {introTitle !== 'hidden' && (
          <div className={`map-intro-title ${introTitle === 'fade-out' ? 'fade-out' : ''}`}>
            Map {currentMapNumber}
          </div>
        )}
        {currentMap && (
          <div className="map-graph" ref={graphRef}>
            <MapConnections levels={currentMap.levels} visible={isVisible} />
            <MapPlayerToken currentNodeId={currentNodeId} graphRef={graphRef} />

            <div className="map-levels">
              {[...currentMap.levels].reverse().map(level => (
                <div key={`level-${level.level}`} className="map-level-column">
                  {level.nodes.map(node => (
                    <MapNodeComponent
                      key={node.id}
                      node={node}
                      isCurrent={node.id === currentNodeId}
                      disabled={isNodeInProgress && node.id !== currentNodeId}
                      onClick={() => handleNodeClick(node.id, node.type)}
                      highlightState={
                        hoveredLegendType === null ? null
                        : hoveredLegendType === node.type ? 'highlighted'
                        : 'dimmed'
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {currentMap && (
        <div className="map-legend">
          {ALL_NODE_TYPES.map(type => (
            <div
              key={type}
              className={`map-legend-item ${hoveredLegendType === type ? 'active' : ''}`}
              onMouseEnter={() => setHoveredLegendType(type)}
              onMouseLeave={() => setHoveredLegendType(null)}
            >
              <div
                className="map-legend-icon"
                style={{ backgroundColor: nodeTypeColors[type] }}
              >
                {nodeTypeIcons[type]}
              </div>
              <span className="map-legend-label">{NODE_TYPE_LABELS[type]}</span>
            </div>
          ))}
        </div>
      )}

      {isNodeInProgress && modalDelayReady && currentNodeType === 'rest' && <RestScreen onComplete={handleScreenComplete} />}
      {isNodeInProgress && modalDelayReady && currentNodeType === 'shop' && <ShopScreen onComplete={handleScreenComplete} />}
      {isNodeInProgress && modalDelayReady && currentNodeType === 'event' && <EventScreen onComplete={handleScreenComplete} />}
      {isChoosingNextMap && <MapChoiceScreen />}
    </div>
  );
};

export default MapLayer;
