import { EventEffect } from '../types/event';
import { AppDispatch } from '../redux/store';
import { inventoryActions } from '../redux/slices/Inventory/inventorySlice';
import { teamActions } from '../redux/slices/Team/teamSlice';
import { instantiateArtifact, artifactTemplates } from './artifactRegistry';
import { cardTemplates } from '../Layers/01_Fight/Deck/CardRegistry';

function rollRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function resolveEventEffect(
  effect: EventEffect,
  dispatch: AppDispatch
): string {
  const parts: string[] = [];

  if (effect.goldRange) {
    const amount = rollRange(effect.goldRange[0], effect.goldRange[1]);
    dispatch(inventoryActions.addGold(amount));
    parts.push(`Gained ${amount} gold`);
  }

  if (effect.goldChange !== undefined) {
    if (effect.goldChange > 0) {
      dispatch(inventoryActions.addGold(effect.goldChange));
      parts.push(`Gained ${effect.goldChange} gold`);
    } else if (effect.goldChange < 0) {
      dispatch(inventoryActions.spendGold(Math.abs(effect.goldChange)));
      parts.push(`Spent ${Math.abs(effect.goldChange)} gold`);
    }
  }

  if (effect.healPercent) {
    dispatch(teamActions.healTeamByPercent(effect.healPercent));
    parts.push(`Healed team for ${effect.healPercent}%`);
  }

  if (effect.damagePercent) {
    dispatch(teamActions.damageTeamByPercent(effect.damagePercent));
    parts.push(`Team took ${effect.damagePercent}% damage`);
  }

  if (effect.addCard) {
    const template = cardTemplates[effect.addCard];
    dispatch(inventoryActions.addNeutralCard(effect.addCard));
    parts.push(`Gained card: ${template?.title ?? effect.addCard}`);
  }

  if (effect.addArtifact) {
    const artifact = instantiateArtifact(effect.addArtifact);
    const template = artifactTemplates[effect.addArtifact];
    dispatch(inventoryActions.addArtifact(artifact));
    parts.push(`Gained artifact: ${template?.name ?? effect.addArtifact}`);
  }

  return parts.join('. ');
}

export function resolveAllEffects(
  effects: EventEffect[],
  dispatch: AppDispatch
): string {
  return effects.map(e => resolveEventEffect(e, dispatch)).filter(Boolean).join('. ');
}
