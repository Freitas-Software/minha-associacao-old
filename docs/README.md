# Minha Associação — Project Documentation

This directory is the source of truth for the intended business behavior of **Minha Associação**.

The current codebase and database schema are evidence of the implementation state. They are **not allowed to silently redefine the business rules documented here**.

## How to use these docs

Read only the documents relevant to the task.

| Task | Start here | Also read |
|---|---|---|
| Tenant isolation, organization context | `domain/tenancy.md` | `architecture/multi-tenancy.md`, `architecture/authorization.md` |
| Organization onboarding/provisioning | `domain/organizations.md` | `domain/roles.md`, `domain/invitations.md`, `domain/organization-documents.md` |
| User identity or authentication | `domain/users.md` | `architecture/authentication.md` |
| Membership lifecycle | `domain/memberships.md` | `domain/roles.md`, `domain/billing.md` |
| Roles | `domain/roles.md` | `domain/permissions.md`, `architecture/authorization.md` |
| Permissions/guards | `domain/permissions.md` | `architecture/authorization.md` |
| Invitations | `domain/invitations.md` | `domain/users.md`, `domain/memberships.md`, `domain/roles.md` |
| Monthly dues / charges / payments | `domain/billing.md` | `domain/memberships.md`, `domain/audit.md` |
| Barter / settlement using goods or services | `domain/barter.md` | `domain/billing.md` |
| PAA | `domain/paa.md` | `domain/barter.md`, `domain/billing.md` |
| Membership card / delinquency restrictions | `domain/membership-cards.md` | `domain/billing.md` |
| Organization files | `domain/organization-documents.md` | `domain/organizations.md` |
| Audit/history | `domain/audit.md` | affected domain document |
| Schema/model changes | affected domain doc | `architecture/persistence.md`, `development/implementation-gap.md` |
| Tests | affected domain doc | `development/testing-strategy.md` |

## Rule identifiers

Normative business rules have stable identifiers such as `ORG-004`, `MBR-011`, and `BIL-026`.

When changing implementation:

1. identify the affected rule IDs;
2. inspect the current implementation;
3. report any conflict between implementation and docs;
4. design the change to satisfy the documented invariants;
5. update the docs first if the business rule itself is intentionally changing.

Tests should reference rule IDs when practical.

## Source-of-truth precedence

For **intended behavior**:

1. explicit current product decision from the project owner;
2. `docs/domain/*`;
3. `docs/architecture/*`;
4. current implementation and database schema;
5. prototypes, mocks, sample data, and UI assumptions.

For **what the software currently does**, inspect the code and schema directly.

A schema constraint can be stricter, looser, or simply older than the intended domain. Never infer a new business rule only because the current schema happens to encode it.

## Language

The documentation is written in English to match code, schema, identifiers, and agent instructions. Product discussions and user-facing copy may use Portuguese.

## Scope discipline

Do not invent rules for features that are not documented. See `domain/scope.md` for intentionally undefined or future areas.
