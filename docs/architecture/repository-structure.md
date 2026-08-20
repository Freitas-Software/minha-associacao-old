# Repository Structure and Module Boundaries

This document defines the canonical physical organization of the **Minha Associação** repository.

It answers one primary question:

> Where should a piece of implementation live?

It does **not** define business behavior. Business behavior belongs to `docs/domain/*`.

It does **not** redefine authentication, authorization, persistence, testing, or integration semantics already documented elsewhere. Those documents remain authoritative for their respective concerns.

---

## 1. Architectural principles

The repository follows these principles:

1. **Business behavior is organized by domain/feature.**
2. **Technical infrastructure is organized by responsibility.**
3. **Physical database schema is separate from application behavior.**
4. **Routes and UI routers are transport/navigation boundaries, not application architecture.**
5. **Cross-domain orchestration must be explicit.**
6. **Shared code must actually be shared.**
7. **New abstractions are introduced when a real responsibility exists, not because a template expects them.**
8. **Prefer the smallest coherent structure that preserves clear boundaries.**

The goal is not to maximize the number of folders or architectural layers.

The goal is to make ownership and dependency direction obvious to both human developers and coding agents.

---

## 2. Repository-level structure

The intended repository organization is:

```text
minha-associacao/
├── .agents/
│   └── skills/
│
├── .codex/
│   └── agents/
│
├── .github/
│
├── apps/
│   ├── api/
│   ├── web/
│   └── mobile/
│
├── packages/
│
├── docs/
│   ├── architecture/
│   ├── development/
│   ├── domain/
│   ├── glossary.md
│   └── README.md
│
├── AGENTS.md
├── CONTRIBUTING.md
├── INSTALL.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

Each top-level directory has one primary purpose.

| Area | Responsibility |
|---|---|
| `apps/*` | Deployable/runtime applications |
| `packages/*` | Explicitly reusable workspace packages |
| `docs/domain/*` | Intended business behavior and invariants |
| `docs/architecture/*` | System structure and technical architecture |
| `docs/development/*` | Development, testing, and change workflows |
| `.agents/skills/*` | Specialized repeatable analysis procedures |
| `.codex/agents/*` | Specialized Codex agent roles |
| `AGENTS.md` | Repository-level operating instructions for agents |

---

## 3. Documentation and implementation relationship

The repository deliberately separates four different kinds of truth.

```text
docs/domain/
    ↓
what the product must do

docs/architecture/
    ↓
how the system is structurally designed

docs/development/
    ↓
how changes are implemented and verified

apps/* + packages/*
    ↓
current implementation
```

The physical location of code must not silently redefine business rules.

When implementation and documented domain behavior disagree, follow the source-of-truth precedence defined in `docs/README.md`.

---

## 4. API structure

The target API structure is:

```text
apps/api/
├── src/
│   ├── modules/
│   ├── workflows/
│   ├── db/
│   ├── infra/
│   ├── plugins/
│   ├── shared/
│   ├── app.ts
│   ├── fastify.d.ts
│   ├── dev.ts
│   └── index.ts
│
├── test/
├── drizzle/
├── AGENTS.md
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

Empty architectural directories do not need to be created in advance.

Create a directory when the first real responsibility requiring it exists.

---

## 5. `modules/` — application domains

`modules/` contains behavior primarily owned by one business capability.

Expected modules include:

```text
modules/
├── identity/
├── organizations/
├── memberships/
├── access-control/
├── invitations/
├── billing/
├── barter/
├── paa/
├── documents/
└── audit/
```

This list is not an instruction to create every directory immediately.

Modules should appear as implementation reaches those domains.

### 5.1 Domain documentation mapping

The mapping is conceptual rather than strictly one-to-one.

| Implementation module | Primary domain documentation |
|---|---|
| `identity/` | `users.md`, authentication architecture |
| `organizations/` | `organizations.md`, tenancy |
| `memberships/` | `memberships.md` |
| `access-control/` | `roles.md`, `permissions.md` |
| `invitations/` | `invitations.md` |
| `billing/` | `billing.md`, `membership-cards.md` |
| `barter/` | `barter.md` |
| `paa/` | `paa.md`, `barter.md` |
| `documents/` | `organization-documents.md` |
| `audit/` | `audit.md` |

Documentation concepts and implementation modules do not need to have a one-to-one mapping.

Documentation is optimized for explaining business concepts.

Code organization is optimized for implementation cohesion.

---

## 6. Module organization

Modules use a **flat-first** structure.

A small module may look like:

```text
modules/organizations/
├── organizations.route.ts
├── organization.schema.ts
├── organization.repository.ts
├── organization.policy.ts
├── create-organization.ts
└── update-organization.ts
```

Do not automatically create:

```text
controllers/
services/
repositories/
dtos/
entities/
factories/
mappers/
interfaces/
use-cases/
```

for every module.

A folder or layer exists only when it represents a real responsibility.

When a module becomes large enough that the flat structure becomes difficult to navigate, files may be grouped by responsibility:

```text
modules/organizations/
├── routes/
├── use-cases/
├── policies/
└── repositories/
```

This is a growth mechanism, not the initial template.

---

## 7. Routes

A route file owns the HTTP boundary.

Example:

```text
organizations.route.ts
```

Route responsibilities include:

- HTTP route definition;
- request schema association;
- authentication/authorization hooks;
- calling an application operation;
- translating expected outcomes to HTTP responses.

Routes must not become the primary location for business logic.

Routes must not directly implement cross-row business invariants.

Routes should not access Drizzle directly.

Conceptually:

```text
HTTP
 ↓
route
 ↓
application operation
 ↓
repository / policy / integration
```

A route file may contain more than one closely related endpoint.

Creating one file per endpoint is not mandatory.

---

## 8. API schemas

API validation and serialization schemas belong with the module that owns the API behavior.

Example:

```text
modules/organizations/organization.schema.ts
```

These schemas describe application/API contracts such as:

- request bodies;
- route parameters;
- query parameters;
- response bodies.

They are different from physical persistence definitions.

Therefore:

```text
modules/organizations/organization.schema.ts
```

means API/application contract, while:

```text
db/schema/organizations.ts
```

means physical database schema.

These concepts must not be conflated.

---

## 9. Application operations

Meaningful operations should normally be represented explicitly.

Prefer:

```text
create-organization.ts
activate-organization.ts
archive-organization.ts
update-organization.ts
```

over a generic file that gradually becomes:

```text
organization.service.ts
```

with unrelated operations and thousands of lines.

An operation file should represent a cohesive application behavior.

Simple CRUD behavior does not require ceremony, but important domain transitions should remain easy to locate and review.

---

## 10. Policies and domain decisions

Files such as:

```text
organization.policy.ts
membership.policy.ts
billing.policy.ts
```

contain reusable decision logic such as:

- whether a state transition is allowed;
- whether a domain invariant would be violated;
- whether a financial condition is satisfied;
- whether a business restriction applies.

Policies should preferably be pure functions when the decision can be made from supplied state.

Authorization must still follow `docs/architecture/authorization.md`.

A role name, UI state, or convenience flag must never replace documented authorization semantics.

---

## 11. Repositories

Repositories isolate persistence queries required by application behavior.

Example:

```text
organization.repository.ts
```

Possible operations include:

```text
findOrganizationById
findOrganizationByDocument
insertOrganization
updateOrganization
```

A repository is not automatically required for every database table.

Repository boundaries should follow application needs rather than mechanical one-table-one-class rules.

Repositories:

- may depend on `db/*`;
- may use Drizzle;
- must not decide product policy;
- must not contain HTTP behavior;
- must not return provider-specific objects as public API contracts.

A repository may enforce query-level tenant scoping, but authorization decisions remain governed by the authorization architecture.

---

## 12. `workflows/` — cross-domain orchestration

Most behavior should remain inside one module.

When one application operation legitimately coordinates several domains, use an explicit workflow.

Example:

```text
workflows/
└── provision-organization.ts
```

A provisioning workflow could coordinate:

```text
organization
membership
role
permissions
documents
audit
```

without pretending all of those responsibilities belong to one module.

Do not create `workflows/` merely for ordinary module-to-module helper calls.

Use it when an application operation itself is genuinely cross-domain.

Cross-domain invariants should normally be executed within an appropriate transaction boundary.

---

## 13. Cross-module dependencies

A module must not casually reach into another module's internal implementation.

Avoid:

```text
modules/billing/
    ↓ imports
modules/memberships/internal/private-helper.ts
```

If behavior belongs to one module but is required elsewhere, expose a narrow application-level function or contract.

If an operation requires significant coordination between several modules, move the orchestration to `workflows/`.

Do not solve cross-module dependency problems by moving domain-specific behavior into `shared/`.

---

## 14. `db/` — persistence infrastructure

Database infrastructure remains centralized:

```text
db/
├── schema/
├── client.ts
├── ids.ts
└── ping.ts
```

`db/schema/*` describes the physical database model.

It is not the source of truth for intended product policy.

Schema files may contain:

- tables;
- columns;
- indexes;
- foreign keys;
- physical constraints;
- database enums;
- relations.

Application behavior belongs elsewhere.

---

## 15. Database schema organization

Keep Drizzle schema definitions centralized under:

```text
db/schema/
```

Do not move Drizzle table definitions into business modules.

This preserves the distinction:

```text
modules/
    application behavior

db/schema/
    physical persistence model
```

Database constraints should reinforce business invariants when practical, but a constraint existing in the current schema does not create a new business rule.

---

## 16. `infra/` — external technology adapters

`infra/` contains provider- or technology-specific implementation.

Examples:

```text
infra/
├── auth/
│   └── better-auth.ts
├── storage/
│   └── object-storage.ts
├── payments/
│   └── payment-provider.ts
└── registry/
    └── cnpj-provider.ts
```

Provider SDKs and provider-specific data structures should remain here whenever practical.

Business modules should depend on the narrow capability they need rather than spreading provider concepts throughout the codebase.

Do not create formal `ports/` and `adapters/` hierarchies unless the complexity actually justifies them.

A narrow TypeScript interface owned by the consuming module is usually sufficient.

---

## 17. `plugins/` — Fastify integration

`plugins/` is reserved for reusable Fastify application integration.

Examples:

```text
plugins/
├── database.plugin.ts
├── authentication.plugin.ts
├── authorization.plugin.ts
└── request-context.plugin.ts
```

Typical responsibilities include:

- Fastify decorators;
- request context;
- hooks;
- framework lifecycle integration;
- application-wide middleware-like behavior.

Provider configuration itself should remain under `infra/`.

For example:

```text
infra/auth/better-auth.ts
```

configures the authentication provider, while:

```text
plugins/authentication.plugin.ts
```

integrates authentication with Fastify.

---

## 18. `shared/`

`shared/` is intentionally small.

Examples of valid shared code:

```text
shared/
├── errors/
├── validation/
└── types/
```

Code belongs in `shared/` only when its meaning is genuinely cross-domain.

The inability to decide where something belongs is **not** evidence that it belongs in `shared/`.

Domain-specific behavior must remain with its owning module.

Avoid generic junk drawers such as:

```text
utils/
helpers/
common/
misc/
```

when they contain unrelated behavior.

Prefer a meaningful capability name.

---

## 19. Application entry points

These files remain close to the application root:

```text
app.ts
index.ts
dev.ts
fastify.d.ts
```

They exist for bootstrapping and framework integration.

They must not accumulate domain behavior.

`app.ts` should primarily compose plugins, infrastructure, routes, and application-level configuration.

---

## 20. API tests

Tests mirror implementation ownership:

```text
test/
├── modules/
│   ├── identity/
│   ├── organizations/
│   ├── memberships/
│   ├── access-control/
│   ├── invitations/
│   └── billing/
│
├── workflows/
├── integration/
└── support/
```

Possible support structure:

```text
support/
├── factories/
├── fixtures/
└── test-app.ts
```

Tests do not have to reproduce the source tree perfectly.

They should make the behavior being verified obvious.

See `docs/development/testing-strategy.md` for normative testing guidance.

---

## 21. Web structure

The web application should separate routing from feature implementation.

Target shape:

```text
apps/web/src/
├── routes/
├── features/
├── components/
├── lib/
└── providers/
```

### `routes/`

Owns routing concerns.

A route should primarily:

- resolve navigation state;
- validate route-level parameters;
- load or delegate required data;
- render the corresponding feature/page.

Do not place the entire feature implementation inside the router tree.

### `features/`

Owns product-facing UI behavior.

Example:

```text
features/
├── authentication/
├── organizations/
├── memberships/
├── billing/
└── profile/
```

A feature may contain its own:

```text
components/
hooks/
queries/
schemas/
pages/
```

only when those groupings become useful.

Use the same flat-first principle used by API modules.

### `components/`

Contains components genuinely reused across features.

A component used by one feature should normally remain in that feature.

### `lib/`

Contains technical application utilities such as:

```text
api client
authentication client integration
browser/storage adapters
```

It must not become a location for miscellaneous business logic.

---

## 22. Mobile structure

Expo Router owns navigation.

Product behavior belongs outside the router tree.

Target shape:

```text
apps/mobile/
├── app/
│   ├── _layout.tsx
│   ├── (auth)/
│   └── (app)/
│
└── src/
    ├── features/
    ├── components/
    ├── lib/
    ├── providers/
    └── hooks/
```

`app/` should remain navigation-oriented.

Feature implementations belong in:

```text
src/features/
```

Examples:

```text
authentication/
organizations/
memberships/
billing/
membership-card/
profile/
```

The active organization selected by the UI is navigation/application state and must never be treated as server-side authorization proof.

---

## 23. Workspace packages

A new workspace package should not be created merely because some code may eventually be shared.

Create a package when:

- more than one workspace has a real need for it;
- ownership is stable;
- the public contract is reasonably clear;
- extracting it reduces coupling rather than increasing ceremony.

Existing dedicated packages should remain focused on their declared responsibility.

Potential future packages such as an API client or cross-runtime contracts should only be introduced after concrete shared usage exists.

Do not create broad packages such as:

```text
packages/utils
packages/common
packages/shared
```

without a clearly bounded responsibility.

---

## 24. Placement decision process

When creating a new file, classify it in this order.

### Business behavior owned by one domain

Place it in:

```text
apps/api/src/modules/<domain>/
```

or the corresponding frontend feature.

### Cross-domain application operation

Place orchestration in:

```text
apps/api/src/workflows/
```

### Physical database structure or database bootstrap

Place it in:

```text
apps/api/src/db/
```

### External provider or technology adapter

Place it in:

```text
apps/api/src/infra/
```

### Fastify-wide integration

Place it in:

```text
apps/api/src/plugins/
```

### Truly domain-independent reusable application primitive

Place it in:

```text
apps/api/src/shared/
```

### Frontend navigation

Place it in the framework router.

### Frontend product behavior

Place it in:

```text
features/
```

If none of these classifications fits cleanly, reconsider the responsibility before creating a new generic folder.

---

## 25. Dependency direction

The intended dependency direction is approximately:

```text
HTTP route
    ↓
application operation
    ↓
policy / repository / required capability
    ↓
database or external infrastructure
```

Cross-domain:

```text
route
    ↓
workflow
    ↓
module operations
    ↓
repositories / infrastructure
```

Forbidden dependency shapes include:

```text
db → module

shared → module

infra → Fastify route

repository → HTTP reply/request

pure domain policy → provider SDK

frontend UI state → server authorization decision
```

Dependency direction matters more than folder naming.

---

## 26. Architectural growth rule

Do not optimize the repository for a hypothetical future size.

At the same time, do not wait until one technical folder contains dozens of unrelated domains before introducing ownership boundaries.

Use this rule:

> Start flat inside a domain. Split by responsibility only when navigation or ownership becomes unclear.

Avoid both extremes:

```text
one giant services/ directory
```

and:

```text
eight architectural layers for a trivial operation
```

---

## 27. Moving existing code

Repository restructuring should be incremental.

Do not combine a large mechanical move with unrelated business behavior changes.

A preferred sequence is:

```text
documentation decision
    ↓
small structural refactor
    ↓
behavior implementation
```

Existing behavior should remain unchanged during a structure-only refactor.

Tests should prove that behavior remained equivalent.

---

## 28. Source-of-truth reminder

File placement is architecture.

Business policy remains domain documentation.

When architecture and domain requirements appear to conflict, preserve domain requirements and revise the implementation design.

When this document and a newer explicit architectural decision conflict, update this document before treating the new structure as canonical.
