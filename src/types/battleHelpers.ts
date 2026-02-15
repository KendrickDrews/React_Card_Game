import { GridPosition } from './creature';

// ── AOE Shape Types ──

/**
 * Describes the shape of an area-of-effect around a target square.
 *
 * - `number` — Diamond (Manhattan distance). e.g. `2` = all cells within 2 steps orthogonally.
 * - `['square', n]` — Square (Chebyshev distance). `['square', 1]` = 3x3 grid including diagonals.
 * - `['line', 'v'|'h', n]` — Line through center. `n` cells each direction. `['line', 'h', 1]` = 3-tile horizontal line.
 * - `['ring', outer, inner]` — Hollow square. Chebyshev distance > inner AND <= outer.
 *    `['ring', 1, 0]` = 3x3 without center (8 tiles). `['ring', 2, 1]` = 5x5 without inner 3x3 (16 tiles).
 * - `['stick', 'v'|'h', n]` — Directional line starting at target. Positive = left/up, negative = right/down.
 *    `['stick', 'h', 2]` = target + 2 tiles left (3 tiles). `['stick', 'v', -3]` = target + 3 tiles down (4 tiles).
 */
export type AoeShape =
  | number
  | ['square', number]
  | ['line', 'v' | 'h', number]
  | ['ring', number, number]
  | ['stick', 'v' | 'h', number];

// ── Push Types ──

export type PushDirection = 'left' | 'right' | 'up' | 'down';
export type PushCollisionType = 'creature' | 'boundary';

export interface PushCollision {
  type: PushCollisionType;
  collidedWithCreatureId?: string; // only set when type === 'creature'
  collisionPosition: GridPosition;
  remainingDistance: number; // how many squares of push were NOT completed
}

export interface PushResult {
  moved: boolean;
  creatureId: string;
  originalPosition: GridPosition;
  newPosition: GridPosition;
  distanceMoved: number;
  collision: PushCollision | null; // null = full push completed freely
}
