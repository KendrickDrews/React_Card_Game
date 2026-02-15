import { useEffect, useState, useCallback, RefObject } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectBattleState } from '../../redux/slices/Battle/battleSelector';
import './TargetingOverlay.scss';

interface TargetingOverlayProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

const TargetingOverlay = ({ containerRef }: TargetingOverlayProps) => {
  const { activeCard, targetingMode } = useAppSelector(selectBattleState);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);

  const isActive = ['enemy_creature', 'ally_creature', 'enemy_cell', 'ally_cell'].includes(targetingMode);

  const computeAnchor = useCallback(() => {
    if (!isActive || !activeCard || !containerRef.current) {
      setAnchor(null);
      return;
    }
    const cardEl = document.querySelector(`[data-card-id="${activeCard.id}"]`);
    if (!cardEl) return;
    const cardRect = cardEl.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    setAnchor({
      x: cardRect.left + cardRect.width / 2 - containerRect.left,
      y: cardRect.top - containerRect.top,
    });
  }, [isActive, activeCard, containerRef]);

  useEffect(() => {
    computeAnchor();
  }, [computeAnchor]);

  useEffect(() => {
    if (!isActive) {
      setMousePos(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('pointermove', handleMouseMove, { once: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointermove', handleMouseMove);
    };
  }, [isActive, containerRef]);

  if (!isActive || !mousePos || !anchor) return null;

  const strokeColor = targetingMode.startsWith('enemy') ? '#e44' : '#4c4';

  return (
    <svg className="targeting-overlay">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={strokeColor} />
        </marker>
      </defs>
      <line
        x1={anchor.x}
        y1={anchor.y}
        x2={mousePos.x}
        y2={mousePos.y}
        stroke={strokeColor}
        strokeWidth="3"
        strokeDasharray="8 4"
        markerEnd="url(#arrowhead)"
        opacity="0.8"
      />
    </svg>
  );
};

export default TargetingOverlay;
