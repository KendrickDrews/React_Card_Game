export type UnlockCategory = 'creature' | 'card' | 'cosmetic' | 'artifact';

export interface UnlockEntry {
  id: string;
  category: UnlockCategory;
  name: string;
  description: string;
  unlockedAt: number | null;
}

export interface EnemyDefeatRecord {
  speciesId: string;
  totalDefeats: number;
  firstDefeatedAt: number | null;
}

export interface RunRecord {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
}

export interface CombatStats {
  totalDamageDealt: number;
  totalDamageReceived: number;
  totalHealingDone: number;
  totalCardsPlayed: number;
  totalTurnsTaken: number;
  totalBattlesWon: number;
  totalBattlesLost: number;
  totalGoldSpent: number;
}

export interface StatsState {
  runs: RunRecord;
  unlocks: Record<string, UnlockEntry>;
  enemyDefeats: Record<string, EnemyDefeatRecord>;
  combat: CombatStats;
}
