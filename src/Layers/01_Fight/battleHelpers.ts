import { BattleCreature, GridPosition } from '../../types/creature';
import { AoeShape, PushDirection, PushResult } from '../../types/battleHelpers';
import { BattleCreaturesState, battleCreaturesState } from '../../redux/slices/BattleCreatures';
import { PLAYER_ZONE, ENEMY_ZONE, GridZone, isInZone } from './gridConstants';
import type { AppDispatch, RootState } from '../../redux/store';

// ── Private helpers ──

function pickRandom<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function getCreaturesForSide(
  state: BattleCreaturesState,
  side: 'player' | 'enemy'
): BattleCreature[] {
  return side === 'player' ? state.playerCreatures : state.enemyCreatures;
}

function getDirectionDelta(direction: PushDirection): { dCol: number; dRow: number } {
  switch (direction) {
    case 'left':  return { dCol: -1, dRow: 0 };
    case 'right': return { dCol: 1,  dRow: 0 };
    case 'up':    return { dCol: 0,  dRow: -1 };
    case 'down':  return { dCol: 0,  dRow: 1 };
  }
}

function buildOccupiedMap(
  state: BattleCreaturesState,
  excludeCreatureId?: string
): Map<string, string> {
  const map = new Map<string, string>();
  const all: BattleCreature[] = [...state.playerCreatures, ...state.enemyCreatures];
  for (const c of all) {
    if (c.gridPosition && c.id !== excludeCreatureId) {
      map.set(`${c.gridPosition.col},${c.gridPosition.row}`, c.id);
    }
  }
  return map;
}

function getZoneForSide(side: 'player' | 'enemy'): GridZone {
  return side === 'player' ? PLAYER_ZONE : ENEMY_ZONE;
}

function isInAnyZone(col: number, row: number): boolean {
  return isInZone(col, row, PLAYER_ZONE) || isInZone(col, row, ENEMY_ZONE);
}

function getAllCellsInZone(zone: GridZone): GridPosition[] {
  const cells: GridPosition[] = [];
  for (let col = zone.colMin; col <= zone.colMax; col++) {
    for (let row = zone.rowMin; row <= zone.rowMax; row++) {
      cells.push({ col, row });
    }
  }
  return cells;
}

// ── Exported: Random Selection ──

export function selectRandomUnit(
  state: BattleCreaturesState,
  side: 'player' | 'enemy'
): BattleCreature | null {
  return pickRandom(getCreaturesForSide(state, side));
}

export function selectRandomAliveUnit(
  state: BattleCreaturesState,
  side: 'player' | 'enemy'
): BattleCreature | null {
  return pickRandom(getCreaturesForSide(state, side).filter(c => c.isAlive));
}

export function selectRandomDeadUnit(
  state: BattleCreaturesState,
  side: 'player' | 'enemy'
): BattleCreature | null {
  return pickRandom(getCreaturesForSide(state, side).filter(c => !c.isAlive));
}

export function selectRandomUnitFromBoard(
  state: BattleCreaturesState
): BattleCreature | null {
  return pickRandom([...state.playerCreatures, ...state.enemyCreatures]);
}

export function selectRandomEmptyCell(
  state: BattleCreaturesState,
  side: 'player' | 'enemy'
): GridPosition | null {
  const zone = getZoneForSide(side);
  const occupied = buildOccupiedMap(state);
  const allCells = getAllCellsInZone(zone);
  const emptyCells = allCells.filter(cell => !occupied.has(`${cell.col},${cell.row}`));
  return pickRandom(emptyCells);
}

// ── Exported: Row Scan ──

export interface RowScanHit {
  position: GridPosition;
  creature: BattleCreature;
}

/**
 * Scans across the opposite side's zone along the source creature's row.
 * Walks from the near edge (closest to source) toward the far edge.
 * Returns the first occupied cell hit, or null if the row is clear.
 */
export function scanRowForTarget(
  state: BattleCreaturesState,
  sourceCreatureId: string
): RowScanHit | null {
  const all: BattleCreature[] = [...state.playerCreatures, ...state.enemyCreatures];
  const source = all.find(c => c.id === sourceCreatureId);
  if (!source?.gridPosition) return null;

  const row = source.gridPosition.row;
  const oppositeZone = getZoneForSide(source.side === 'player' ? 'enemy' : 'player');
  const occupied = buildOccupiedMap(state);

  // Player fires right (ascending cols), enemy fires left (descending cols)
  const startCol = source.side === 'player' ? oppositeZone.colMin : oppositeZone.colMax;
  const step = source.side === 'player' ? 1 : -1;

  for (let col = startCol; col >= oppositeZone.colMin && col <= oppositeZone.colMax; col += step) {
    const occupantId = occupied.get(`${col},${row}`);
    if (occupantId) {
      const creature = all.find(c => c.id === occupantId);
      if (creature) {
        return { position: { col, row }, creature };
      }
    }
  }

  return null;
}

// ── Exported: AOE ──

/**
 * Returns all grid positions affected by an AOE shape centered on a target cell.
 * Results are clipped to valid zone cells (player zone or enemy zone only).
 */
export function getAoeCells(target: GridPosition, shape: AoeShape): GridPosition[] {
  const cells: GridPosition[] = [];

  if (typeof shape === 'number') {
    // Diamond: Manhattan distance <= shape
    for (let dc = -shape; dc <= shape; dc++) {
      for (let dr = -shape; dr <= shape; dr++) {
        if (Math.abs(dc) + Math.abs(dr) <= shape) {
          cells.push({ col: target.col + dc, row: target.row + dr });
        }
      }
    }
    return cells.filter(c => isInAnyZone(c.col, c.row));
  }

  switch (shape[0]) {
    case 'square': {
      const [, size] = shape;
      for (let dc = -size; dc <= size; dc++) {
        for (let dr = -size; dr <= size; dr++) {
          cells.push({ col: target.col + dc, row: target.row + dr });
        }
      }
      break;
    }
    case 'line': {
      const [, axis, length] = shape;
      for (let i = -length; i <= length; i++) {
        if (axis === 'h') {
          cells.push({ col: target.col + i, row: target.row });
        } else {
          cells.push({ col: target.col, row: target.row + i });
        }
      }
      break;
    }
    case 'ring': {
      const [, outer, inner] = shape;
      for (let dc = -outer; dc <= outer; dc++) {
        for (let dr = -outer; dr <= outer; dr++) {
          const dist = Math.max(Math.abs(dc), Math.abs(dr));
          if (dist > inner && dist <= outer) {
            cells.push({ col: target.col + dc, row: target.row + dr });
          }
        }
      }
      break;
    }
    case 'stick': {
      const [, axis, length] = shape;
      // Target tile is always included
      cells.push({ ...target });
      if (length === 0) break;
      // Positive = left (h) or up (v), negative = right (h) or down (v)
      const step = length > 0 ? -1 : 1;
      const count = Math.abs(length);
      for (let i = 1; i <= count; i++) {
        if (axis === 'h') {
          cells.push({ col: target.col + step * i, row: target.row });
        } else {
          cells.push({ col: target.col, row: target.row + step * i });
        }
      }
      break;
    }
  }

  return cells.filter(c => isInAnyZone(c.col, c.row));
}

/**
 * Returns all creatures occupying cells within an AOE shape.
 */
export function getCreaturesInAoe(
  state: BattleCreaturesState,
  target: GridPosition,
  shape: AoeShape
): BattleCreature[] {
  const aoeCells = getAoeCells(target, shape);
  const cellSet = new Set(aoeCells.map(c => `${c.col},${c.row}`));
  const all: BattleCreature[] = [...state.playerCreatures, ...state.enemyCreatures];
  return all.filter(c => c.gridPosition && cellSet.has(`${c.gridPosition.col},${c.gridPosition.row}`));
}

// ── Exported: Parse AOE Shape from string ──

/**
 * Converts an encoded string into an AoeShape type for use by card effects.
 *
 * '2'          → 2 (diamond)
 * 'square-1'   → ['square', 1]
 * 'line-h-1'   → ['line', 'h', 1]
 * 'ring-2-1'   → ['ring', 2, 1]
 * 'stick-v-2'  → ['stick', 'v', 2]
 */
export function parseAoeShape(encoded: string): AoeShape {
  // Pure number → diamond
  if (/^\d+$/.test(encoded)) {
    return parseInt(encoded, 10);
  }

  const parts = encoded.split('-');
  switch (parts[0]) {
    case 'square':
      return ['square', parseInt(parts[1], 10)];
    case 'line':
      return ['line', parts[1] as 'v' | 'h', parseInt(parts[2], 10)];
    case 'ring':
      return ['ring', parseInt(parts[1], 10), parseInt(parts[2], 10)];
    case 'stick':
      return ['stick', parts[1] as 'v' | 'h', parseInt(parts[2], 10)];
    default:
      return 0;
  }
}

// ── Exported: Push ──

export function calculatePush(
  state: BattleCreaturesState,
  creatureId: string,
  direction: PushDirection,
  distance: number
): PushResult {
  // Find creature across both arrays
  const all: BattleCreature[] = [...state.playerCreatures, ...state.enemyCreatures];
  const creature = all.find(c => c.id === creatureId);

  if (!creature?.gridPosition) {
    return {
      moved: false,
      creatureId,
      originalPosition: { col: 0, row: 0 },
      newPosition: { col: 0, row: 0 },
      distanceMoved: 0,
      collision: null,
    };
  }

  if (distance <= 0) {
    return {
      moved: false,
      creatureId,
      originalPosition: { ...creature.gridPosition },
      newPosition: { ...creature.gridPosition },
      distanceMoved: 0,
      collision: null,
    };
  }

  const originalPosition = { ...creature.gridPosition };
  const zone = getZoneForSide(creature.side);
  const occupied = buildOccupiedMap(state, creatureId);
  const { dCol, dRow } = getDirectionDelta(direction);

  let currentCol = originalPosition.col;
  let currentRow = originalPosition.row;
  let distanceMoved = 0;

  for (let step = 0; step < distance; step++) {
    const nextCol = currentCol + dCol;
    const nextRow = currentRow + dRow;

    // Check zone boundary
    if (nextCol < zone.colMin || nextCol > zone.colMax ||
        nextRow < zone.rowMin || nextRow > zone.rowMax) {
      return {
        moved: distanceMoved > 0,
        creatureId,
        originalPosition,
        newPosition: { col: currentCol, row: currentRow },
        distanceMoved,
        collision: {
          type: 'boundary',
          collisionPosition: { col: nextCol, row: nextRow },
          remainingDistance: distance - distanceMoved,
        },
      };
    }

    // Check occupied square
    const occupantId = occupied.get(`${nextCol},${nextRow}`);
    if (occupantId) {
      return {
        moved: distanceMoved > 0,
        creatureId,
        originalPosition,
        newPosition: { col: currentCol, row: currentRow },
        distanceMoved,
        collision: {
          type: 'creature',
          collidedWithCreatureId: occupantId,
          collisionPosition: { col: nextCol, row: nextRow },
          remainingDistance: distance - distanceMoved,
        },
      };
    }

    // Advance
    currentCol = nextCol;
    currentRow = nextRow;
    distanceMoved++;
  }

  return {
    moved: true,
    creatureId,
    originalPosition,
    newPosition: { col: currentCol, row: currentRow },
    distanceMoved,
    collision: null,
  };
}

export function executePush(
  dispatch: AppDispatch,
  getState: () => RootState,
  creatureId: string,
  direction: PushDirection,
  distance: number
): PushResult {
  const state = getState().battleCreatures;
  const result = calculatePush(state, creatureId, direction, distance);

  if (result.moved) {
    dispatch(battleCreaturesState.moveCreature({
      creatureId,
      newPosition: result.newPosition,
    }));
  }

  return result;
}
