import { useAppSelector } from '../../redux/hooks';
import { selectRunStats, selectCombatStats, selectAllUnlocks, selectEnemyDefeats, selectRunWinRate, selectTotalEnemiesDefeated, selectUniqueSpeciesDefeated } from '../../redux/slices/Stats/statsSelector';
import { unlockableCreatures } from '../../data/unlockableCreatures';

interface StatsScreenProps {
  onBack: () => void;
}

const StatsScreen = ({ onBack }: StatsScreenProps) => {
  const runs = useAppSelector(selectRunStats);
  const combat = useAppSelector(selectCombatStats);
  const unlocks = useAppSelector(selectAllUnlocks);
  const enemyDefeats = useAppSelector(selectEnemyDefeats);
  const winRate = useAppSelector(selectRunWinRate);
  const totalDefeated = useAppSelector(selectTotalEnemiesDefeated);
  const uniqueSpecies = useAppSelector(selectUniqueSpeciesDefeated);

  const unlockedCount = Object.values(unlocks).filter(u => u.unlockedAt !== null).length;
  const totalUnlockable = unlockableCreatures.length;

  const defeatRecords = Object.values(enemyDefeats).sort((a, b) => b.totalDefeats - a.totalDefeats);

  return (
    <div className="stats-screen">
      <div className="stats-header">
        <button className="menu-button menu-button-small" onClick={onBack}>Back</button>
        <h2>Game Stats</h2>
      </div>

      <div className="stats-body">
        {/* Runs */}
        <div className="stats-section">
          <h3>Runs</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{runs.totalRuns}</span>
              <span className="stat-label">Total Runs</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{runs.successfulRuns}</span>
              <span className="stat-label">Victories</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{runs.failedRuns}</span>
              <span className="stat-label">Defeats</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{(winRate * 100).toFixed(0)}%</span>
              <span className="stat-label">Win Rate</span>
            </div>
          </div>
        </div>

        {/* Combat */}
        <div className="stats-section">
          <h3>Combat</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{combat.totalBattlesWon}</span>
              <span className="stat-label">Battles Won</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{combat.totalBattlesLost}</span>
              <span className="stat-label">Battles Lost</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{combat.totalDamageDealt.toLocaleString()}</span>
              <span className="stat-label">Damage Dealt</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{combat.totalDamageReceived.toLocaleString()}</span>
              <span className="stat-label">Damage Taken</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{combat.totalHealingDone.toLocaleString()}</span>
              <span className="stat-label">Healing Done</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{combat.totalCardsPlayed.toLocaleString()}</span>
              <span className="stat-label">Cards Played</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{combat.totalTurnsTaken.toLocaleString()}</span>
              <span className="stat-label">Turns Taken</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{combat.totalGoldSpent.toLocaleString()}</span>
              <span className="stat-label">Gold Spent</span>
            </div>
          </div>
        </div>

        {/* Enemy Defeats */}
        <div className="stats-section">
          <h3>Enemy Defeats</h3>
          <div className="stats-summary-row">
            <span>{totalDefeated} total defeated</span>
            <span>{uniqueSpecies} unique species</span>
          </div>
          {defeatRecords.length > 0 ? (
            <div className="defeat-list">
              {defeatRecords.map(record => (
                <div key={record.speciesId} className="defeat-row">
                  <span className="defeat-name">{record.speciesId}</span>
                  <span className="defeat-count">{record.totalDefeats}x</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="stats-empty">No enemies defeated yet</p>
          )}
        </div>

        {/* Unlocks */}
        <div className="stats-section">
          <h3>Unlocks <span className="unlock-progress">{unlockedCount}/{totalUnlockable}</span></h3>
          <div className="unlock-list">
            {unlockableCreatures.map(entry => {
              const unlocked = unlocks[entry.unlock.id]?.unlockedAt !== null && unlocks[entry.unlock.id] !== undefined;
              return (
                <div key={entry.unlock.id} className={`unlock-row ${unlocked ? 'unlocked' : 'locked'}`}>
                  <span className="unlock-name">{unlocked ? entry.unlock.name : '???'}</span>
                  <span className="unlock-status">
                    {unlocked ? 'Unlocked' : entry.conditionLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsScreen;
