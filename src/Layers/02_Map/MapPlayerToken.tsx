import { useEffect, useState } from 'react';

interface MapPlayerTokenProps {
  currentNodeId: string | null;
  graphRef: React.RefObject<HTMLDivElement>;
}

const MapPlayerToken = ({ currentNodeId, graphRef }: MapPlayerTokenProps) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!currentNodeId || !graphRef.current) return;

    const updatePosition = () => {
      const nodeEl = document.getElementById(`map-${currentNodeId}`);
      const graphEl = graphRef.current;
      if (!nodeEl || !graphEl) return;

      const nodeRect = nodeEl.getBoundingClientRect();
      const graphRect = graphEl.getBoundingClientRect();
      setPosition({
        top: nodeRect.top - graphRect.top + nodeRect.height / 2,
        left: nodeRect.left - graphRect.left + nodeRect.width / 2,
      });
    };

    const rafId = requestAnimationFrame(updatePosition);
    window.addEventListener('resize', updatePosition);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePosition);
    };
  }, [currentNodeId, graphRef]);

  if (!position) return null;

  return (
    <div
      className="map-player-token"
      style={{ top: position.top, left: position.left }}
    />
  );
};

export default MapPlayerToken;
