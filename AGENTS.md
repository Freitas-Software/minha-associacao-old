# Minha Associação — repository guidance

## Repository

- This is a `pnpm` monorepo orchestrated with Turborepo. Do not use npm or yarn.
- Main areas: `apps/api`, `apps/web`, `apps/mobile`, and shared `packages/*`.
- Prefer existing workspace scripts and internal `workspace:*` packages over duplicate local implementations.
- Biome is the repository formatter/linter. Do not introduce ESLint or Prettier unless the task explicitly changes the tooling strategy.

## Working method

- Make the smallest coherent change that satisfies the request.
- Do not refactor, rename, reformat, or upgrade unrelated code.
- Search for an existing implementation or pattern before creating a new abstraction.
- Prefer targeted `rg`/file reads over recursive repository-wide reading.
- Do not reread unchanged files unless new evidence requires it.
- Before asking the user a repository-related question, inspect the relevant code, tests, package scripts, configuration, and nearby docs first.
- Never rerun the same failed command unchanged. Diagnose the cause before retrying.
- Do not add a production dependency when the existing stack can solve the task cleanly. If a new dependency is necessary, keep it scoped to the owning workspace.

## Validation

- Validate the smallest affected workspace first.
- From the repository root, prefer `pnpm --filter <workspace> <script>` for scoped checks; use the workspace name from its `package.json` instead of guessing it.
- For cross-cutting changes, expand validation to affected consumers and then root Turborepo checks when justified.
- Before finishing, review `git diff` and remove accidental or unrelated changes.
- Do not run expensive repository-wide checks repeatedly when scoped checks already isolate the failure.

## Boundaries

- `apps/api`: backend and persistence. Follow its local `AGENTS.md` for API/database work.
- `apps/web`: web client. Follow its local `AGENTS.md` for routing/UI work.
- `apps/mobile`: Expo application. Follow its local `AGENTS.md` for mobile work.
- `packages/*`: shared code with a wider blast radius. Follow `packages/AGENTS.md`.
- Never commit secrets, real credentials, private keys, or production `.env` values.
- Preserve public contracts unless the task explicitly requires a breaking change.

## Git and PRs

- Keep one logical change per PR.
- Do not mix unrelated cleanup with feature/fix work.
- When asked to commit, push, or open a PR, use the available GitHub/yeet workflow if installed instead of duplicating that workflow here.

## Done

A task is done when the requested behavior is implemented, relevant scoped checks pass, the final diff is focused, and any unresolved risk is stated explicitly.
