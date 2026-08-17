# API guidance

Inherits repository-root `AGENTS.md`.

## Stack

- Fastify + TypeScript ESM.
- PostgreSQL via Drizzle ORM/Drizzle Kit and `pg`.
- Vitest for tests.
- Existing TypeID helper is the ID convention unless the task explicitly changes it.

## Domain-sensitive work

- For schema changes, read the relevant `docs/domain/*` file and `docs/development/implementation-gap.md` before treating Drizzle definitions as desired behavior.
- Drizzle is the source of truth for **current physical schema**, not for intended business policy.
- Authorization must be server-side and classified using `docs/architecture/authorization.md`.
- Do not expose raw database rows or provider-specific financial/auth objects as domain contracts.
- Preserve transaction boundaries for cross-row invariants.

## Read-only operating mode

Do not generate/apply migrations, run migrations, modify schema files, or execute database writes by default. Draft the exact schema/migration/application code for the user instead.

If validation is requested, prefer commands that do not mutate the database.
