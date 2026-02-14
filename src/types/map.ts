export type MapNodeType = 'start' | 'fight' | 'elite' | 'boss' | 'rest' | 'shop' | 'event';

export interface MapNode {
  id: string;
  type: MapNodeType;
  level: number;
  index: number;
  connections: string[];
  visited: boolean;
  available: boolean;
  encounterId?: string;
}

export interface MapLevel {
  level: number;
  nodes: MapNode[];
}

export interface RunMap {
  levels: MapLevel[];
  depth: number;
}

export interface MapConfig {
  depth: number;
  maxWidth: number;
  minWidth: number;
  minConnections: number;
  maxConnections: number;
  nodeTypeWeights: {
    fight: number;
    elite: number;
    rest: number;
    shop: number;
    event: number;
  };
  eliteLevelThreshold: number;
}

export const DEFAULT_MAP_CONFIG: MapConfig = {
  depth: 9,
  maxWidth: 4,
  minWidth: 2,
  minConnections: 1,
  maxConnections: 3,
  nodeTypeWeights: {
    fight: 50,
    elite: 10,
    rest: 15,
    shop: 10,
    event: 15,
  },
  eliteLevelThreshold: 4,
};
