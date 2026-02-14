export const GRID_SIZE = 10;

export interface GridZone {
  colMin: number;
  colMax: number;
  rowMin: number;
  rowMax: number;
}

export const PLAYER_ZONE: GridZone = {
  colMin: 1,
  colMax: 3,
  rowMin: 3,
  rowMax: 7,
};

export const ENEMY_ZONE: GridZone = {
  colMin: 6,
  colMax: 8,
  rowMin: 3,
  rowMax: 7,
};

export function isInZone(col: number, row: number, zone: GridZone): boolean {
  return col >= zone.colMin && col <= zone.colMax && row >= zone.rowMin && row <= zone.rowMax;
}

// Default starting positions for up to 3 creatures per side
export const PLAYER_START_POSITIONS = [
  { col: 2, row: 4 },
  { col: 2, row: 6 },
  { col: 1, row: 5 },
];

export const ENEMY_START_POSITIONS = [
  { col: 7, row: 4 },
  { col: 7, row: 6 },
  { col: 8, row: 5 },
];
