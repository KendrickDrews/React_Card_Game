# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Slay The Browser** — a browser-based card game inspired by Slay the Spire. Built with React 18, Redux Toolkit, TypeScript, Vite, and SCSS.

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

### Redux State (3 slices)

All slices live in `src/redux/slices/` and follow the pattern: `<name>Slice.ts` + `<name>Selector.ts` + `index.ts`.

- **battle** — Turn phase management, active card tracking. Phase cycle: `player_start → player_active → player_end → enemy_start → enemy_active → enemy_end`. Actions are exported as `battleState`.
- **player** — Health, mana, drawCount, and 5 card piles: `deck`, `draw`, `hand`, `discard`, `exhaust`. Uses Fisher-Yates shuffle. Actions exported as `playerState`.
- **enemy** — Health and block. Actions exported as `enemyState`.

Typed hooks (`useAppDispatch`, `useAppSelector`) are in `src/redux/hooks.ts`.

### Battle Phase Thunk

`src/Layers/01_Fight/HandleBattlePhase.ts` — The core game loop. An async thunk that dispatches actions based on `battle.phase`, with timed delays for animations. The `player_active` phase is a no-op (waits for player input). Phase transitions are driven by `battleState.nextBattlePhase()` which cycles through the phase array.

### Card System

- Card definitions in `src/Layers/01_Fight/Deck/Deck.tsx` (10-card base deck)
- Card type defined in `src/types/card.ts` — includes id, title, type, manaCost, value, description, effect (`{damage, heal, addMana}`), and discard flag
- Card types: Creature, Spell, Enchantment, Artifact, Land
- `Card.tsx` handles animation states, z-index stacking, hover/selection, and mana-gating

### Sprite System

`src/components/Cricket.tsx` renders a composite character from 6 layered PNG images (Eye, Main, Socks, Top, Under, LineArt SVG). Each layer is positioned absolutely at the same dimensions.

### Battle Grid

The fight layer uses a 10x10 CSS grid with perspective transform for 3D positioning. Unit placement uses grid cell coordinates to calculate pixel positions.

## Path Alias

`@/types` resolves to `src/types/` (configured in tsconfig.json).

## Key Patterns

- Slice actions are exported as named objects (`battleState`, `playerState`, `enemyState`) rather than individual action creators
- Redux Logger middleware is enabled with collapsed logs
- SCSS is used throughout; `src/styles/main.scss` contains global styles and layer animation math
- Each layer directory has its own `.scss` file alongside its component
