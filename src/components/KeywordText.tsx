import { useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { KEYWORD_REGISTRY } from '../data/keywordRegistry';
import './KeywordText.scss';

interface PanelState {
  keys: string[];
  x: number;
  y: number;
}

const sortedKeys = Object.keys(KEYWORD_REGISTRY).sort((a, b) => b.length - a.length);
const keywordRegex = new RegExp(`\\b(${sortedKeys.join('|')})\\b`, 'gi');

interface Segment {
  text: string;
  isKeyword: boolean;
  keywordKey?: string;
}

function parseSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  keywordRegex.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = keywordRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), isKeyword: false });
    }
    segments.push({ text: match[0], isKeyword: true, keywordKey: match[0].toLowerCase() });
    lastIndex = keywordRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), isKeyword: false });
  }
  return segments;
}

const KeywordText = ({ text }: { text: string }) => {
  const groupRef = useRef<HTMLSpanElement>(null);
  const [panel, setPanel] = useState<PanelState | null>(null);
  const segments = parseSegments(text);
  const keywordKeys = useMemo(
    () => [...new Set(segments.filter(s => s.isKeyword).map(s => s.keywordKey!))],
    [segments]
  );

  if (keywordKeys.length === 0) return <>{text}</>;

  const handleEnter = () => {
    const rect = groupRef.current?.getBoundingClientRect();
    if (rect) setPanel({ keys: keywordKeys, x: rect.left + rect.width / 2, y: rect.top });
  };

  return (
    <span ref={groupRef} className="keyword-group" onMouseEnter={handleEnter} onMouseLeave={() => setPanel(null)}>
      {segments.map((seg, i) =>
        seg.isKeyword
          ? <span key={i} className="keyword-highlight">{seg.text}</span>
          : <span key={i}>{seg.text}</span>
      )}
      {panel && createPortal(
        <div className="keyword-tooltip" style={{ left: panel.x, top: panel.y }}>
          {panel.keys.map((key, i) => (
            <div key={key} className={`keyword-entry${i > 0 ? ' keyword-entry-divider' : ''}`}>
              <div className="keyword-tooltip-name">{KEYWORD_REGISTRY[key]?.name}</div>
              <div className="keyword-tooltip-desc">{KEYWORD_REGISTRY[key]?.description}</div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </span>
  );
};

export default KeywordText;
