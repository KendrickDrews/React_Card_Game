import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectCurrentMap, selectCurrentNodeId, selectCurrentNode, selectAvailableNodes, selectCompletedNodeIds } from '../../redux/slices/Map/mapSelector';
import { mapActions } from '../../redux/slices/Map/mapSlice';
import { battleState } from '../../redux/slices/Battle/battleSlice';
import { playerState } from '../../redux/slices/Player/playerSlice';
import { battleCreaturesState } from '../../redux/slices/BattleCreatures/battleCreaturesSlice';
import { generateMap } from '../../data/mapGenerator';
import { MapNodeType } from '../../types/map';
import MapNodeComponent from './MapNode';
import MapConnections from './MapConnections';
import { AudioEngine } from '../../audio';
import EventScreen from './EventScreen';
import RestScreen from './RestScreen';
import ShopScreen from './ShopScreen';

interface LayerContext {
  layerContext: string;
  setLayerContext: (value: string) => void;
}

const MapLayer = ({ layerContext, setLayerContext }: LayerContext) => {
  const dispatch = useAppDispatch();
  const currentMap = useAppSelector(selectCurrentMap);
  const currentNodeId = useAppSelector(selectCurrentNodeId);
  const currentNode = useAppSelector(selectCurrentNode);
  const availableNodes = useAppSelector(selectAvailableNodes);
  const completedNodeIds = useAppSelector(selectCompletedNodeIds);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isVisible = layerContext === 'Map';
  const isNodeInProgress = currentNodeId !== null && !completedNodeIds.includes(currentNodeId);
  const currentNodeType = currentNode?.type ?? null;

  // Generate map if none exists when layer becomes visible
  useEffect(() => {
    if (isVisible && !currentMap) {
      const map = generateMap();
      dispatch(mapActions.setMap(map));
    }
  }, [isVisible, currentMap, dispatch]);

  // Auto-scroll to current node position (horizontal only, within the scroll container)
  useEffect(() => {
    if (isVisible && currentNodeId && scrollContainerRef.current) {
      const timer = setTimeout(() => {
        const nodeEl = document.getElementById(`map-${currentNodeId}`);
        const container = scrollContainerRef.current;
        if (nodeEl && container) {
          const nodeRect = nodeEl.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const scrollLeft = container.scrollLeft + (nodeRect.left - containerRect.left) - (containerRect.width / 2) + (nodeRect.width / 2);
          container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isVisible, currentNodeId]);

  const handleNodeClick = (nodeId: string, nodeType: MapNodeType) => {
    if (isNodeInProgress) return;
    const isAvailable = availableNodes.some(n => n.id === nodeId);
    if (!isAvailable) return;

    AudioEngine.getInstance().playSfx('ui-click');
    dispatch(mapActions.setCurrentNode(nodeId));

    if (nodeType === 'fight' || nodeType === 'elite' || nodeType === 'boss') {
      // Reset battle state for a fresh fight
      dispatch(playerState.resetAllPiles());
      dispatch(battleCreaturesState.clearBattleCreatures());
      dispatch(battleState.clearTargeting());
      dispatch(battleState.setBattleResult('ongoing'));
      dispatch(battleState.setShouldDraw(true));
      dispatch(battleState.setBattleStart(true));
      dispatch(battleState.setBattlePhase('turn_start'));
      dispatch(battleState.resetTurn());
      setLayerContext('Fight');
    } else {
      // Rest, Shop, Event: node stays "in progress" until the overlay screen completes it
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
          {currentNodeId ? `Node: ${currentNodeId}` : 'Map'}
        </div>
        <div className="info-system">
          {isNodeInProgress && (
            <div className="return-to-fight" onClick={() => setLayerContext('Fight')}>
              Return to Fight
            </div>
          )}
          <div>deck</div>
          <div>controls</div>
        </div>
      </div>

      <div className="map-scroll-container" ref={scrollContainerRef}>
        {currentMap && (
          <div className="map-graph">
            <MapConnections levels={currentMap.levels} visible={isVisible} />

            <div className="map-levels">
              {currentMap.levels.map(level => (
                <div key={`level-${level.level}`} className="map-level-column">
                  {level.nodes.map(node => (
                    <MapNodeComponent
                      key={node.id}
                      node={node}
                      isCurrent={node.id === currentNodeId}
                      onClick={() => handleNodeClick(node.id, node.type)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isNodeInProgress && currentNodeType === 'rest' && <RestScreen onComplete={handleScreenComplete} />}
      {isNodeInProgress && currentNodeType === 'shop' && <ShopScreen onComplete={handleScreenComplete} />}
      {isNodeInProgress && currentNodeType === 'event' && <EventScreen onComplete={handleScreenComplete} />}
    </div>
  );
};

export default MapLayer;
