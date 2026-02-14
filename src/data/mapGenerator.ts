import { MapConfig, MapNode, MapLevel, RunMap, MapNodeType, DEFAULT_MAP_CONFIG } from '../types/map';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedRandom(weights: Record<string, number>): string {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;
  for (const [key, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

function assignNodeType(level: number, depth: number, config: MapConfig): MapNodeType {
  // Level 1 is always fight (first encounter)
  if (level === 1) return 'fight';

  // Penultimate level is always rest (campfire before boss)
  if (level === depth - 2) return 'rest';

  // Build weights, gating elites by level threshold
  const weights = { ...config.nodeTypeWeights };
  if (level < config.eliteLevelThreshold) {
    weights.elite = 0;
  } else {
    // Increase elite weight for later levels
    weights.elite += (level - config.eliteLevelThreshold) * 5;
  }

  return weightedRandom(weights) as MapNodeType;
}

function buildConnections(
  currentNodes: MapNode[],
  nextNodes: MapNode[],
  config: MapConfig
): void {
  const cLen = currentNodes.length;
  const nLen = nextNodes.length;

  // Track connections per node
  const outgoing = new Map<string, Set<string>>();
  const incoming = new Map<string, Set<string>>();
  for (const node of currentNodes) outgoing.set(node.id, new Set());
  for (const node of nextNodes) incoming.set(node.id, new Set());

  // Helper: proportional mapping — node at index i in current maps to ~this index in next
  const mappedIndex = (i: number): number => {
    if (cLen === 1) return Math.floor(nLen / 2);
    return Math.round((i / (cLen - 1)) * (nLen - 1));
  };

  // STEP 1: Ensure every next-level node has at least 1 incoming connection
  for (let j = 0; j < nLen; j++) {
    // Find the closest current-level node by proportional mapping
    const idealSource = Math.round((j / Math.max(nLen - 1, 1)) * (cLen - 1));

    // Try the ideal source first, then expand outward
    let bestSource = idealSource;
    for (let offset = 0; offset < cLen; offset++) {
      const tryIdx = idealSource + offset;
      const tryIdx2 = idealSource - offset;
      if (tryIdx < cLen) {
        const srcOut = outgoing.get(currentNodes[tryIdx].id)!;
        if (srcOut.size < config.maxConnections) {
          bestSource = tryIdx;
          break;
        }
      }
      if (tryIdx2 >= 0 && tryIdx2 !== tryIdx) {
        const srcOut = outgoing.get(currentNodes[tryIdx2].id)!;
        if (srcOut.size < config.maxConnections) {
          bestSource = tryIdx2;
          break;
        }
      }
    }

    const srcId = currentNodes[bestSource].id;
    const tgtId = nextNodes[j].id;
    outgoing.get(srcId)!.add(tgtId);
    incoming.get(tgtId)!.add(srcId);
  }

  // STEP 2: Ensure every current-level node has at least minConnections
  for (let i = 0; i < cLen; i++) {
    const srcId = currentNodes[i].id;
    const srcOut = outgoing.get(srcId)!;

    while (srcOut.size < config.minConnections) {
      const ideal = mappedIndex(i);
      // Find closest unconnected next-level node
      let added = false;
      for (let offset = 0; offset < nLen; offset++) {
        for (const tryIdx of [ideal + offset, ideal - offset]) {
          if (tryIdx >= 0 && tryIdx < nLen) {
            const tgtId = nextNodes[tryIdx].id;
            if (!srcOut.has(tgtId)) {
              srcOut.add(tgtId);
              incoming.get(tgtId)!.add(srcId);
              added = true;
              break;
            }
          }
        }
        if (added) break;
      }
      if (!added) break; // All next-level nodes already connected
    }
  }

  // STEP 3: Optionally add extra connections (50% chance per node, prefer adjacent)
  for (let i = 0; i < cLen; i++) {
    const srcId = currentNodes[i].id;
    const srcOut = outgoing.get(srcId)!;
    const ideal = mappedIndex(i);

    while (srcOut.size < config.maxConnections && Math.random() < 0.4) {
      // Only try indices within +-1 of already-connected range to minimize crossings
      const connectedIndices = [...srcOut].map(id => {
        return nextNodes.findIndex(n => n.id === id);
      });
      const minConn = Math.max(0, Math.min(...connectedIndices) - 1);
      const maxConn = Math.min(nLen - 1, Math.max(...connectedIndices) + 1);

      let added = false;
      // Try from ideal outward within range
      for (let offset = 0; offset <= maxConn - minConn; offset++) {
        for (const tryIdx of [ideal + offset, ideal - offset]) {
          if (tryIdx >= minConn && tryIdx <= maxConn && tryIdx >= 0 && tryIdx < nLen) {
            const tgtId = nextNodes[tryIdx].id;
            if (!srcOut.has(tgtId)) {
              srcOut.add(tgtId);
              incoming.get(tgtId)!.add(srcId);
              added = true;
              break;
            }
          }
        }
        if (added) break;
      }
      if (!added) break;
    }
  }

  // Write connections back to nodes
  for (const node of currentNodes) {
    node.connections = [...outgoing.get(node.id)!];
  }
}

export function generateMap(config: MapConfig = DEFAULT_MAP_CONFIG): RunMap {
  const levels: MapLevel[] = [];

  // Level 0: Single start node
  const startNode: MapNode = {
    id: 'node-0-0',
    type: 'start',
    level: 0,
    index: 0,
    connections: [],
    visited: true,
    available: false,
  };
  levels.push({ level: 0, nodes: [startNode] });

  // Middle levels: 1 through depth-2
  for (let lvl = 1; lvl < config.depth - 1; lvl++) {
    const width = randomInt(config.minWidth, config.maxWidth);
    const nodes: MapNode[] = [];
    for (let idx = 0; idx < width; idx++) {
      nodes.push({
        id: `node-${lvl}-${idx}`,
        type: assignNodeType(lvl, config.depth, config),
        level: lvl,
        index: idx,
        connections: [],
        visited: false,
        available: false,
      });
    }
    levels.push({ level: lvl, nodes });
  }

  // Last level: Single boss node
  const bossLevel = config.depth - 1;
  const bossNode: MapNode = {
    id: `node-${bossLevel}-0`,
    type: 'boss',
    level: bossLevel,
    index: 0,
    connections: [],
    visited: false,
    available: false,
  };
  levels.push({ level: bossLevel, nodes: [bossNode] });

  // Build connections between adjacent levels
  for (let lvl = 0; lvl < levels.length - 1; lvl++) {
    buildConnections(levels[lvl].nodes, levels[lvl + 1].nodes, config);
  }

  // Mark level-1 nodes reachable from start as available
  for (const connId of levels[0].nodes[0].connections) {
    const target = levels[1].nodes.find(n => n.id === connId);
    if (target) target.available = true;
  }

  return { levels, depth: config.depth };
}
