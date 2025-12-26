# Implementation Plan

Status key: Not started | In progress | Done

## Phase 1: Scaffold & Docs (Done)
- Create project structure (`src/`, `public/`, `tests/`).
- Add tooling config: `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`.
- Add `README.md` with setup/run/test instructions.

## Phase 2: Fraction Engine + Tests (Done)
- Implement fraction types, normalization, gcd, simplify, mul/div, compare.
- Implement parsing (including mixed numbers) and formatting.
- Add unit tests for parsing, simplify, mul/div, normalize.

## Phase 3: Seed Tasks + Verification (Done)
- Add seed JSON data under `src/data/seed-tasks.json`.
- Add `verify-tasks` script using engine to validate answers.
- Ensure `npm test` runs unit tests + verification.

## Phase 4: Core Logic + Persistence (Done)
- Implement module/subskill definitions and task generators (min 6 subskills).
- Implement diagnostic scoring + mastery logic.
- Add local persistence (IndexedDB or localStorage).

## Phase 5: UI Screens & Flow (Done)
- Build screens: Home, Diagnose Task, Dashboard, Training Start, Training Game, Review.
- Add basic navigation and state management.

## Phase 6: Polish & Final Checks (Done)
- Validate adaptive selection and error mapping.
- UI copy review and accessibility checks.
- Update docs and ensure acceptance criteria covered.
