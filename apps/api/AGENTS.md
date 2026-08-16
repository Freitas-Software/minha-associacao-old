# API guidance

## Stack

- Fastify + TypeScript, ESM.
- PostgreSQL through `pg` and Drizzle ORM/Drizzle Kit.
- Fastify autoload and Zod type-provider conventions are already part of this app; extend existing patterns instead of introducing parallel frameworks.
- Shared environment/configuration belongs in `@minha-associacao/config` when it is cross-cutting.
- Tests use Vitest.

## Implementation

- Keep HTTP concerns, domain/application logic, and database concerns separated according to the nearest existing pattern.
- Reuse existing schemas, plugins, helpers, ID utilities, and error-handling conventions before adding new abstractions.
- Validate external input at the boundary. Do not trust request payloads or persisted external data implicitly.
- Avoid leaking database rows or implementation-specific errors directly through public HTTP responses.
- Preserve existing API contracts unless the task explicitly changes them.

## Database

- Treat Drizzle schema definitions as the source of truth for schema changes.
- Use the existing migration workflow; do not hand-edit generated migration output just to make a migration pass.
- For schema work, use the app scripts such as `pnpm db:generate` and `pnpm db:check` as applicable.
- Run `pnpm db:migrate` only when the task and environment clearly target the local/development database; never assume an unknown database is disposable.
- Diagnose migration failures before retrying them. Check existing data, schema state, migration order, and constraints instead of repeatedly rerunning the same migration.

## Validation

Start narrow and expand as needed:

1. affected Vitest test/file;
2. `pnpm typecheck`;
3. `pnpm lint`;
4. `pnpm test` when the change affects broader API behavior.

Use `pnpm db:check` for relevant database/migration changes.
