import { CreatureAction } from '../../types/creature';

// Specific action overrides — maps action ID to animation CSS class name
const actionAnimations: Record<string, string> = {
  'cricket-leap': 'attack-leap',
};

// Determine animation class from a creature's action
export function getAnimationName(action: CreatureAction): string {
  if (actionAnimations[action.id]) return actionAnimations[action.id];
  if (action.effect.damage) return 'attack';
  if (action.effect.addBlock) return 'defend';
  if (action.effect.heal) return 'heal';
  return 'attack';
}
