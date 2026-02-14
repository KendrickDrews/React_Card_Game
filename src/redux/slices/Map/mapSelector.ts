import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../index';

export const selectMapState = (state: RootState) => state.map;

export const selectCurrentMap = createSelector(
  selectMapState,
  (map) => map.currentMap
);

export const selectCurrentNodeId = createSelector(
  selectMapState,
  (map) => map.currentNodeId
);

export const selectCurrentNode = createSelector(
  selectMapState,
  (map) => {
    if (!map.currentMap || !map.currentNodeId) return null;
    for (const level of map.currentMap.levels) {
      const node = level.nodes.find(n => n.id === map.currentNodeId);
      if (node) return node;
    }
    return null;
  }
);

export const selectAvailableNodes = createSelector(
  selectMapState,
  (map) => {
    if (!map.currentMap) return [];
    return map.currentMap.levels.flatMap(l => l.nodes.filter(n => n.available));
  }
);

export const selectMapLevels = createSelector(
  selectCurrentMap,
  (currentMap) => currentMap?.levels ?? []
);

export const selectCompletedNodeIds = createSelector(
  selectMapState,
  (map) => map.completedNodeIds
);

export const selectIsMapComplete = createSelector(
  selectMapState,
  (map) => {
    if (!map.currentMap) return false;
    const bossLevel = map.currentMap.levels[map.currentMap.levels.length - 1];
    return bossLevel.nodes.some(n => n.visited);
  }
);
