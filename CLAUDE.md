# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Slay The Browser** — a browser-based creature-collector card game inspired by Slay the Spire. Built with React 18, Redux Toolkit, TypeScript, Vite, and SCSS.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — TypeScript compile + Vite production build (`tsc -b && vite build`)
- `npm run lint` — ESLint with zero warnings allowed (`--max-warnings 0`)
- `npm run preview` — Preview production build

No test framework is configured yet.

## Architecture

### Layered UI System

The app uses a numbered layer system for screen management. Each layer is a full-screen component that slides on/off screen via CSS transitions. Layer visibility is controlled by `layerContext` state in `App.tsx`.

- `src/Layers/00_Background/` — Background navigation (z-index 0)
- `src/Layers/01_Fight/` — Main battle/combat screen (z-index 100)
- `src/Layers/02_Map/` — Map/navigation screen (z-index 200)

Layer show/hide uses `.layer-hidden` CSS class with position transitions (1.5s ease-in-out).

### Redux State (4 slices)

All slices live in `src/redux/slices/` and follow the pattern: `<name>Slice.ts` + `<name>Selector.ts` + `index.ts`.

- **battle** — Turn phase management, initiative queue, active card, targeting, battle result. Phase cycle: `turn_start → player_card_phase → player_end → initiative_phase → turn_end`. Actions exported as `battleState`.
- **player** — Mana, maxMana, drawCount, and 5 card piles: `deck`, `draw`, `hand`, `discard`, `exhaust`. Uses Fisher-Yates shuffle. Actions exported as `playerState`.
- **team** — Persistent player creature roster and activeTeam selection. Survives between battles. Actions exported as `teamActions`.
- **battleCreatures** — In-combat state for ALL creatures (both player and enemy). HP, block, buffs/debuffs, initiative actions, enemy patterns. Actions exported as `battleCreaturesState`.

Typed hooks (`useAppDispatch`, `useAppSelector`) are in `src/redux/hooks.ts`.

### Creature System

Types defined in `src/types/creature.ts`:
- **BaseCreature** — Shared fields: id, name, HP, block, initiative, passive, buffs, debuffs, isAlive, spriteId
- **PlayerCreature** extends BaseCreature — adds cards (card IDs), defaultAction, currentAction (modifiable by cards), level, experience
- **EnemyCreature** extends BaseCreature — adds pattern (array of EnemyPatternStep) and patternIndex

Player creatures contribute cards to the shared deck. Each creature has a `defaultAction` that fires during the initiative phase; cards can modify `currentAction` before the player ends their turn.

Enemy creatures cycle through their `pattern` array instead of using cards.

### Battle Flow

5-phase cycle in `src/Layers/01_Fight/HandleBattlePhase.ts`:
1. **turn_start** — First turn: load team + enemies, compose deck from creature cards. Every turn: reset block, reset creature actions, reset mana, tick status effects, build initiative queue, draw hand.
2. **player_card_phase** — No-op; player plays cards from hand.
3. **player_end** — Discard hand with animation cascade.
4. **initiative_phase** — All creatures (both sides) act in a mixed queue sorted by initiative (highest first). Dead creatures are skipped but remain in the UI for potential revival. After each action, checks for victory/defeat.
5. **turn_end** — Increment turn, loop back.

### Card System

- Card templates in `src/Layers/01_Fight/Deck/CardRegistry.ts` — lookup by string ID
- `getCardsForCreature()` instantiates PlayingCard[] from a creature's card ID list, stamping each with `creatureId`
- Card type in `src/types/card.ts` — id (string), creatureId, title, type, manaCost, effect, optional modifyAction
- Card effects resolved via `src/Layers/01_Fight/resolveCardEffect.ts`
- `Card.tsx` handles animation states, z-index stacking, hover/selection, mana-gating

### Initiative & Action Resolution

- `src/Layers/01_Fight/resolveCreatureAction.ts` — Resolves a creature's action based on targetType (self, single_enemy, all_enemies, single_ally, all_allies, random_enemy)
- Initiative bar UI: `src/Layers/01_Fight/InitiativeBar/InitiativeBar.tsx` — shows all creatures sorted by initiative at top-center of battle arena

### Sprite System

`src/components/Cricket.tsx` renders a composite character from 6 layered PNG images. `src/components/CreatureUnit.tsx` is the reusable creature display component (sprite, HP bar, block, enemy intent).

### Data

- `src/data/starterTeam.ts` — Default player team (Cricket + Sun Spirit)
- `src/data/encounters.ts` — Enemy encounter definitions (Goblin Scout + Green Slime)

### Battle Grid

The fight layer uses a 10x10 CSS grid with perspective transform for 3D positioning. Creature placement on the grid is deferred to a future implementation.

## Path Alias

`@/types` resolves to `src/types/` (configured in tsconfig.json).

## Key Patterns

- Slice actions are exported as named objects (`battleState`, `playerState`, `teamActions`, `battleCreaturesState`) rather than individual action creators
- Redux Logger middleware is enabled with collapsed logs
- SCSS is used throughout; `src/styles/main.scss` contains global styles and layer animation math
- Each layer directory has its own `.scss` file alongside its component
- Buff/debuff/passive types are defined in `src/types/creature.ts` but logic is stubbed for future implementation
