# Repository Guidelines

## Project Structure & Module Organization

- `coding_agent_prompt_bruchtrainer_app_stufe_1_2.md` contains the full product specification, task requirements, and acceptance criteria for the Bruchtrainer app.
- Application code lives in `src/` (UI, logic, engine, data), tests in `tests/`, and scripts in `scripts/`.
- Seeded tasks are stored in `src/data/seed-tasks.json` and verified by `scripts/verify-tasks.ts`.
- UI entrypoint is `src/App.tsx`; global styles are in `src/styles/main.css`.
- Translations and glossary content live in `src/logic/i18n.ts`.

## Build, Test, and Development Commands

- `npm install` installs dependencies.
- `npm run dev` starts the Vite dev server.
- `npm test` runs Vitest plus task verification (`verify-tasks`).
- `npm run build` produces the production bundle in `dist/`.

## Coding Style & Naming Conventions

- No repository-wide formatter is configured yet; keep changes readable and consistent.
- If you introduce tooling, document it explicitly (e.g., `prettier`, `eslint`, `vitest`) and ensure it is referenced in `README.md` and this file.
- Follow the naming conventions defined in the spec for domain IDs, for example:
  - `moduleId`: `M_*` (e.g., `M_MUL`)
  - `subskillId`: `S_*` (e.g., `S_MUL_01`)

## Testing Guidelines

- The specification requires unit tests for fraction parsing, simplification, multiplication, and division.
- Tests live in `tests/` (e.g., `tests/fractions.test.ts`, `tests/generators.test.ts`).
- Task correctness is enforced by `scripts/verify-tasks.ts` and is part of `npm test`.
- Keep seed tasks mathematically correct and fully simplified; verifier expects that.

## Commit & Pull Request Guidelines

- No commit message conventions are established in Git history.
- Use short, imperative commit summaries (e.g., “Add fraction parser tests”).
- For pull requests, include:
  - A brief description of what changed and why.
  - Links to relevant spec sections in `coding_agent_prompt_bruchtrainer_app_stufe_1_2.md`.
  - Screenshots or short clips for UI changes.

## Agent-Specific Instructions

- Always consult `coding_agent_prompt_bruchtrainer_app_stufe_1_2.md` before making feature changes.
- Prioritize correctness for the fraction engine and task verification flow, as these are acceptance criteria.
