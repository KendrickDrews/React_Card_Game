import { MapNode, MapNodeType } from '../../types/map';

interface MapNodeProps {
  node: MapNode;
  isCurrent: boolean;
  onClick: () => void;
  highlightState?: 'highlighted' | 'dimmed' | null;
}

export const nodeTypeIcons: Record<MapNodeType, string> = {
  start: 'S',
  fight: 'F',
  elite: 'E',
  boss: 'B',
  rest: 'R',
  shop: '$',
  event: '?',
};

export const nodeTypeColors: Record<MapNodeType, string> = {
  start: '#4a9',
  fight: '#c55',
  elite: '#c85',
  boss: '#a33',
  rest: '#5a5',
  shop: '#cc5',
  event: '#58c',
};

const MapNodeComponent = ({ node, isCurrent, onClick, highlightState }: MapNodeProps) => {
  const stateClass = node.visited ? 'visited'
                   : node.available ? 'available'
                   : 'locked';

  return (
    <div
      id={`map-${node.id}`}
      className={`map-node ${stateClass} ${isCurrent ? 'current' : ''} type-${node.type} ${highlightState ?? ''}`}
      onClick={onClick}
      style={{
        '--node-color': nodeTypeColors[node.type] ?? '#888',
      } as React.CSSProperties}
    >
      <div className="map-node-icon">
        {nodeTypeIcons[node.type] ?? '?'}
      </div>
    </div>
  );
};

export default MapNodeComponent;
