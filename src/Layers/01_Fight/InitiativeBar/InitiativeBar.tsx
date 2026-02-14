import { useAppSelector } from '../../../redux/hooks';
import { selectBattleState } from '../../../redux/slices/Battle/battleSelector';
import { selectPlayerCreatures, selectEnemyCreatures } from '../../../redux/slices/BattleCreatures/battleCreaturesSelector';
import './InitiativeBar.scss';

const InitiativeBar = () => {
  const { initiativeQueue, currentInitiativeIndex, isInitiativeResolving } = useAppSelector(selectBattleState);
  const playerCreatures = useAppSelector(selectPlayerCreatures);
  const enemyCreatures = useAppSelector(selectEnemyCreatures);
  const allCreatures = [...playerCreatures, ...enemyCreatures];

  return (
    <div className="initiative-bar">
      {initiativeQueue.map((entry, index) => {
        const creature = allCreatures.find(c => c.id === entry.creatureId);
        if (!creature) return null;

        const isActive = isInitiativeResolving && index === currentInitiativeIndex;
        const isDead = !creature.isAlive;

        return (
          <div
            key={entry.creatureId}
            className={`initiative-entry
              ${entry.side === 'player' ? 'player-side' : 'enemy-side'}
              ${isActive ? 'active' : ''}
              ${isDead ? 'dead' : ''}`}
          >
            <div className="initiative-name">{creature.name}</div>
            <div className="initiative-stats">
              <span className="initiative-hp">{creature.currentHp}/{creature.maxHp}</span>
              <span className="initiative-value">Init: {entry.initiative}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InitiativeBar;
