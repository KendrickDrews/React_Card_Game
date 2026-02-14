import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RunMap, MapNode } from '../../../types/map';

export interface MapState {
  currentMap: RunMap | null;
  currentNodeId: string | null;
  completedNodeIds: string[];
}

const initMapState: MapState = {
  currentMap: null,
  currentNodeId: null,
  completedNodeIds: [],
};

export const mapSlice = createSlice({
  name: 'map',
  initialState: initMapState,
  reducers: {
    setMap: (state, action: PayloadAction<RunMap>) => {
      state.currentMap = action.payload;
      state.currentNodeId = 'node-0-0';
      state.completedNodeIds = ['node-0-0'];
    },

    setCurrentNode: (state, action: PayloadAction<string>) => {
      if (!state.currentMap) return;
      state.currentNodeId = action.payload;

      for (const level of state.currentMap.levels) {
        const node = level.nodes.find(n => n.id === action.payload);
        if (node) {
          node.visited = true;
          node.available = false;
          break;
        }
      }
    },

    completeCurrentNode: (state) => {
      if (!state.currentMap || !state.currentNodeId) return;

      if (!state.completedNodeIds.includes(state.currentNodeId)) {
        state.completedNodeIds.push(state.currentNodeId);
      }

      // Find current node
      let currentNode: MapNode | undefined;
      for (const level of state.currentMap.levels) {
        currentNode = level.nodes.find(n => n.id === state.currentNodeId);
        if (currentNode) break;
      }
      if (!currentNode) return;

      // Clear all available flags
      for (const level of state.currentMap.levels) {
        for (const node of level.nodes) {
          node.available = false;
        }
      }

      // Mark connected next-level nodes as available
      const nextLevel = state.currentMap.levels.find(l => l.level === currentNode!.level + 1);
      if (nextLevel) {
        for (const connId of currentNode.connections) {
          const nextNode = nextLevel.nodes.find(n => n.id === connId);
          if (nextNode && !nextNode.visited) {
            nextNode.available = true;
          }
        }
      }
    },

    clearMap: (state) => {
      state.currentMap = null;
      state.currentNodeId = null;
      state.completedNodeIds = [];
    },
  },
});

export const mapActions = mapSlice.actions;

export default mapSlice.reducer;
