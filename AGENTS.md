# Minha Associação — Codex repository guidance

## Operating mode: eyes and brain, not hands

- Default to **read, inspect, reason, review, plan, and draft**.
- Do **not** modify, create, delete, rename, or reformat repository files unless the user explicitly overrides this rule for the current task.
- Do **not** use `apply_patch`, shell redirection, `sed -i`, code formatters with write mode, package installation, migrations, git commits/pushes, or other state-changing commands by default.
- When implementation is requested, return the proposed code, diff, file contents, migration plan, or exact edit instructions in the response so the user can write/apply them.
- Read-only shell/search commands are allowed when they are necessary to understand the repository. Prefer targeted reads/searches.
- If a command can materially mutate project, database, infrastructure, dependency state, or Git state, do not run it without explicit authorization.

## Business source of truth

- Business behavior lives under `docs/domain/`.
- Start with `docs/README.md` to route to the minimum relevant documentation.
- Architecture guidance lives under `docs/architecture/`.
- Known schema/domain drift lives in `docs/development/implementation-gap.md`.
- For intended behavior, documented domain rules outrank current code/schema, prototypes, mocks, and UI assumptions.
- Never invent a business rule because the current schema happens to encode it.
- When code and docs conflict, report the conflict before proposing implementation.
- Refer to stable business rule IDs (`ORG-*`, `MBR-*`, `BIL-*`, etc.) in plans and reviews.

## Repository

- `pnpm` monorepo orchestrated with Turborepo. Do not substitute npm or yarn.
- Main areas: `apps/api`, `apps/web`, `apps/mobile`, and `packages/*`.
- Biome is the repository formatting/lint authority.
- Reuse existing workspace scripts, shared packages, ID helpers, schemas, and established patterns before proposing new abstractions.

## Analysis workflow

Before proposing a change:

1. identify the exact requested behavior;
2. read the smallest relevant domain docs;
3. inspect current code/schema/tests;
4. list affected rule IDs;
5. classify authorization as public/token, provisioning, membership, self/resource, or privileged;
6. identify domain↔implementation drift;
7. propose the smallest coherent design;
8. provide code/diff as a proposal only;
9. describe narrow validation the user should run.

## Non-negotiable domain reminders

- Organization is the tenant boundary.
- Selected organization UI state is never authorization proof.
- One membership per user+organization for lifetime.
- Exactly one current role per membership.
- Role names and `isBoardRole` never grant authority.
- `isFullAccess` grants all configurable permissions but bypasses no tenant/state/invariant checks.
- Operational organizations must never have zero active full-access members.
- Payments/permissions are evaluated from current state; sessions do not freeze authorization or financial truth.
- Payment gateway confirmed state is authoritative for external settlements.

## Scope discipline

- Do not implement undefined future features from assumptions.
- If a real product decision is missing and multiple behaviors would materially change the domain, stop and ask one focused question.
- Do not ask the user to confirm consequences that follow directly from documented invariants.

## Reporting

Keep reports useful to a human implementer:

- evidence and relevant files;
- rule IDs;
- problem/constraint;
- proposed design;
- exact code or diff to type/apply;
- validation steps;
- real remaining risks.
