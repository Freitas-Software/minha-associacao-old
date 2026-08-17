---
name: schema-domain-drift
description: Compare Minha Associação database/schema/code models with approved domain documentation before planning migrations or persistence changes. Use for Drizzle schema work, migrations, DB reviews, and data-model refactors.
---

# Schema-domain drift review

Read:
- relevant `docs/domain/*`;
- `docs/architecture/persistence.md`;
- `docs/development/implementation-gap.md`.

Inspect the current Drizzle schema.

Create a drift table with:
- domain rule ID;
- current schema behavior;
- mismatch;
- risk;
- proposed target shape;
- migration/data concern.

Pay special attention to:
- `PROVISIONING` organization lifecycle;
- business `ACTIVE`/`INACTIVE` membership lifecycle;
- exactly one current role per membership;
- removal of `board_members` as authority;
- one explicit default join role;
- provisioning access;
- individual vs global invitation semantics;
- billing/barter/PAA persistence;
- distinguishable audit actor source;
- accidental constraints not defined by business (for example global abbreviation uniqueness).

Do not treat current schema as product policy.
Do not edit schema or generate/run migrations in the workspace.
Draft migration/schema code for the human when requested.
