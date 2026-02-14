import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../index';

export const selectTeamState = (state: RootState) => state.team;

export const selectActiveTeam = createSelector(
  selectTeamState,
  (team) => team.roster.filter(c => team.activeTeam.includes(c.id))
);

export const selectActiveTeamCardIds = createSelector(
  selectActiveTeam,
  (creatures) => creatures.flatMap(c => c.cards)
);
