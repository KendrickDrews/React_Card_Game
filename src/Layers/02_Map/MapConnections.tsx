import { useEffect, useState, useCallback } from 'react';
import { MapLevel } from '../../types/map';

interface Props {
  levels: MapLevel[];
  visible: boolean;
}

interface Line {
  key: string;
  x1: number; y1: number;
  x2: number; y2: number;
  visited: boolean;
}

const MapConnections = ({ levels, visible }: Props) => {
  const [lines, setLines] = useState<Line[]>([]);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

  const computeLines = useCallback(() => {
    const newLines: Line[] = [];
    const container = document.querySelector('.map-graph') as HTMLElement | null;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    // Set SVG dimensions to match full scrollable content area
    setSvgSize({
      width: container.scrollWidth,
      height: container.scrollHeight,
    });

    for (const level of levels) {
      for (const node of level.nodes) {
        const fromEl = document.getElementById(`map-${node.id}`);
        if (!fromEl) continue;
        const fromRect = fromEl.getBoundingClientRect();
        const fromX = fromRect.right - containerRect.left + container.scrollLeft;
        const fromY = fromRect.top + fromRect.height / 2 - containerRect.top + container.scrollTop;

        for (const connId of node.connections) {
          const toEl = document.getElementById(`map-${connId}`);
          if (!toEl) continue;
          const toRect = toEl.getBoundingClientRect();
          const toX = toRect.left - containerRect.left + container.scrollLeft;
          const toY = toRect.top + toRect.height / 2 - containerRect.top + container.scrollTop;

          const targetNode = levels.flatMap(l => l.nodes).find(n => n.id === connId);
          const isVisited = node.visited && (targetNode?.visited ?? false);

          newLines.push({
            key: `${node.id}-${connId}`,
            x1: fromX, y1: fromY,
            x2: toX, y2: toY,
            visited: isVisited,
          });
        }
      }
    }
    setLines(newLines);
  }, [levels]);

  useEffect(() => {
    if (!visible) return;
    // Delay to let DOM render after layer transition
    const timer = setTimeout(computeLines, 100);
    window.addEventListener('resize', computeLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', computeLines);
    };
  }, [computeLines, visible]);

  return (
    <svg
      className="map-connections-svg"
      width={svgSize.width || '100%'}
      height={svgSize.height || '100%'}
      style={{ minWidth: svgSize.width, minHeight: svgSize.height }}
    >
      {lines.map(line => (
        <line
          key={line.key}
          x1={line.x1} y1={line.y1}
          x2={line.x2} y2={line.y2}
          className={`map-line ${line.visited ? 'visited' : ''}`}
        />
      ))}
    </svg>
  );
};

export default MapConnections;
