import { BattleCreature, EnemyCreature } from '../types/creature';
import { useAppSelector } from '../redux/hooks';
import { selectActiveAnimation } from '../redux/slices/Battle/battleSelector';
import Cricket from './Cricket';
import './CreatureUnit.scss';

interface CreatureUnitProps {
  creature: BattleCreature;
  size?: number;
  isTargetingActive?: boolean;
  isValidTarget?: boolean;
}

const CreatureUnit = ({ creature, size = 200, isTargetingActive = false, isValidTarget = false }: CreatureUnitProps) => {
  const isEnemy = creature.side === 'enemy';
  const enemyCreature = isEnemy ? (creature as EnemyCreature) : null;
  const nextIntent = enemyCreature
    ? enemyCreature.pattern[enemyCreature.patternIndex]
    : null;

  const hpPercent = (creature.currentHp / creature.maxHp) * 100;

  const targetingClass = isTargetingActive
    ? (isValidTarget ? 'targetable' : 'not-targetable')
    : '';

  const activeAnimation = useAppSelector(selectActiveAnimation);
  const animClass = activeAnimation?.creatureId === creature.id
    ? `anim-${activeAnimation.animationName}`
    : '';

  return (
    <div
      className={`creature-unit ${!creature.isAlive ? 'dead' : ''} ${isEnemy ? 'enemy' : 'player'} ${targetingClass} ${animClass}`}
    >
      {/* Enemy intent indicator */}
      {isEnemy && nextIntent && (
        <div className={`intent-indicator intent-${nextIntent.intentIcon}`}>
          <span className="intent-label">{nextIntent.action.name}</span>
          {nextIntent.action.effect.damage && (
            <span className="intent-value">{nextIntent.action.effect.damage}</span>
          )}
        </div>
      )}

      {/* Sprite */}
      <div className={`creature-sprite ${isEnemy ? 'flipped-horizontal' : ''} ${creature.isAlive ? 'idle' : ''}`}>
        {creature.spriteId === 'cricket' ? (
          <Cricket width={size} />
        ) : (
          <div className="placeholder-sprite" style={{ width: size * 0.5, height: size * 0.6 }}>{creature.name[0]}</div>
        )}
      </div>

      {/* HP Bar */}
      <div className="creature-hp-bar">
        <div className="hp-fill" style={{ width: `${hpPercent}%` }} />
        <span className="hp-text">{creature.currentHp}/{creature.maxHp}</span>
      </div>

      {/* Block */}
      {creature.block > 0 && (
        <div className="creature-block">{creature.block}</div>
      )}

      {/* Name */}
      <div className="creature-name">{creature.name}</div>
    </div>
  );
};

export default CreatureUnit;
