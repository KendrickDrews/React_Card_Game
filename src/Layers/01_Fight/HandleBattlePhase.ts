import { battleState, playerState } from '../../redux';
import { RootState } from '../../redux';
import { Action, ThunkAction } from '@reduxjs/toolkit';
import { battleCreaturesState } from '../../redux/slices/BattleCreatures/battleCreaturesSlice';
import { InitiativeEntry, PlayerCreature, EnemyCreature } from '../../types/creature';
import { getCardsForCreature } from './Deck/CardRegistry';
import { resolveCreatureAction } from './resolveCreatureAction';
import { getAnimationName } from './animationRegistry';
import { grasslandsEncounter, getEncounterForNode } from '../../data/encounters';
import { MapNode } from '../../types/map';
import { PlayingCard } from '../../types/card';

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;

const delay = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const drawHand = async (dispatch: any, getState: () => RootState) => {
  const player = getState().player;
  for (let i = 0; i < player.drawCount; i++) {
    if (getState().player.draw.length === 0) {
      dispatch(playerState.shuffleDiscardToDraw());
    }
    if (getState().player.draw.length === 0) {
      break; // both draw and discard empty
    }
    if (getState().player.hand.length >= 10) {
      break;
    }
    dispatch(playerState.drawCard());
    await delay(0.5);
  }
  dispatch(battleState.setShouldDraw(false));
};

const discardHand = async (dispatch: any, getState: () => RootState) => {
  const hand = getState().player.hand;
  for (let i = hand.length - 1; i >= 0; i--) {
    dispatch(playerState.toggleCardDiscardProperty({ id: hand[i].id, discard: true }));
    await delay(0.5 * (1 / hand.length));
  }
};

export const handleBattlePhase = (): AppThunk => async (dispatch, getState) => {
  const { battle, player } = getState();

  switch (battle.phase) {

    // ============================================
    // PHASE 1: TURN START
    // ============================================
    case 'turn_start': {
      if (battle.battleStart) {
        // Load active team creatures into battle
        const updatedTeam = getState().team;
        const activeCreatures = updatedTeam.roster.filter(
          c => updatedTeam.activeTeam.includes(c.id)
        );
        dispatch(battleCreaturesState.loadPlayerCreatures(activeCreatures));

        // Load enemies for this encounter (dynamic based on map node)
        const mapState = getState().map;
        let currentNode: MapNode | undefined;
        if (mapState.currentMap && mapState.currentNodeId) {
          for (const level of mapState.currentMap.levels) {
            currentNode = level.nodes.find(n => n.id === mapState.currentNodeId);
            if (currentNode) break;
          }
        }

        let enemies: EnemyCreature[];
        if (currentNode && (currentNode.type === 'fight' || currentNode.type === 'elite' || currentNode.type === 'boss')) {
          enemies = getEncounterForNode(currentNode.type, currentNode.encounterId);
        } else {
          enemies = grasslandsEncounter.map(e => ({ ...e }));
        }
        dispatch(battleCreaturesState.loadEnemyCreatures(enemies));

        // Compose deck from all active team creatures' cards
        const allCards: PlayingCard[] = [];
        for (const creature of activeCreatures) {
          allCards.push(...getCardsForCreature(creature));
        }
        dispatch(playerState.loadDeck(allCards));
        dispatch(playerState.shuffleDeckToDraw());
        dispatch(battleState.setBattleStart(false));
      }

      // Reset block on all creatures
      dispatch(battleCreaturesState.resetAllBlock());

      // Reset creature actions to defaults
      dispatch(battleCreaturesState.resetAllCreatureActions());

      // Reset mana
      dispatch(playerState.resetMana());

      // Tick status effects (stubbed - decrements durations)
      dispatch(battleCreaturesState.tickAllStatusEffects());

      // Build initiative queue
      const bcState = getState().battleCreatures;
      const allAlive = [
        ...bcState.playerCreatures.filter(c => c.isAlive),
        ...bcState.enemyCreatures.filter(c => c.isAlive),
      ];
      const queue: InitiativeEntry[] = allAlive
        .map(c => ({
          creatureId: c.id,
          side: c.side,
          initiative: c.initiative,
          hasActed: false,
        }))
        .sort((a, b) => b.initiative - a.initiative);
      dispatch(battleState.buildInitiativeQueue(queue));

      // Draw hand
      if (battle.shouldDraw || getState().battle.shouldDraw) {
        await drawHand(dispatch, getState);
      }

      await delay(0.25);
      dispatch(battleState.nextBattlePhase()); // -> player_card_phase
      break;
    }

    // ============================================
    // PHASE 2: PLAYER CARD PHASE
    // ============================================
    case 'player_card_phase': {
      // No-op — player interacts with UI
      break;
    }

    // ============================================
    // PHASE 3: PLAYER END
    // ============================================
    case 'player_end': {
      dispatch(battleState.setShouldDraw(true));

      // Clear any active targeting/card state
      dispatch(battleState.clearTargeting());

      if (player.hand.length > 0) {
        await discardHand(dispatch, getState);
      }

      await delay(0.25);
      dispatch(battleState.nextBattlePhase()); // -> initiative_phase
      break;
    }

    // ============================================
    // PHASE 4: INITIATIVE RESOLUTION
    // ============================================
    case 'initiative_phase': {
      dispatch(battleState.setIsInitiativeResolving(true));
      const queue = getState().battle.initiativeQueue;

      for (let i = 0; i < queue.length; i++) {
        const entry = queue[i];
        dispatch(battleState.setCurrentInitiativeIndex(i));

        // Check if creature is still alive
        const currentBC = getState().battleCreatures;
        const allCreatures = [...currentBC.playerCreatures, ...currentBC.enemyCreatures];
        const creature = allCreatures.find(c => c.id === entry.creatureId);

        if (!creature || !creature.isAlive) {
          continue; // skip dead creatures
        }

        // Determine action and start animation
        let action;
        if (entry.side === 'player') {
          action = (creature as PlayerCreature).currentAction;
        } else {
          const enemyCreature = creature as EnemyCreature;
          action = enemyCreature.pattern[enemyCreature.patternIndex].action;
        }

        const animationName = getAnimationName(action);
        dispatch(battleState.setActiveAnimation({ creatureId: creature.id, animationName }));
        await delay(0.3);

        // Resolve action at animation midpoint
        if (entry.side === 'player') {
          resolveCreatureAction(dispatch, getState, creature as PlayerCreature, action);
        } else {
          resolveCreatureAction(dispatch, getState, creature as EnemyCreature, action);
          dispatch(battleCreaturesState.advanceEnemyPattern(creature.id));
        }

        await delay(0.45);
        dispatch(battleState.clearActiveAnimation());

        // Check for battle end
        const stateAfter = getState().battleCreatures;
        const allPlayersDead = stateAfter.playerCreatures.every(c => !c.isAlive);
        const allEnemiesDead = stateAfter.enemyCreatures.every(c => !c.isAlive);

        if (allPlayersDead) {
          dispatch(battleState.setBattleResult('defeat'));
          dispatch(battleState.setIsInitiativeResolving(false));
          return;
        }
        if (allEnemiesDead) {
          dispatch(battleState.setBattleResult('victory'));
          dispatch(battleState.setIsInitiativeResolving(false));
          return;
        }
      }

      dispatch(battleState.resetInitiative());
      await delay(0.25);
      dispatch(battleState.nextBattlePhase()); // -> turn_end
      break;
    }

    // ============================================
    // PHASE 5: TURN END
    // ============================================
    case 'turn_end': {
      dispatch(battleState.increaseTurn());
      await delay(0.25);
      dispatch(battleState.nextBattlePhase()); // -> turn_start (wraps)
      break;
    }
  }
};
