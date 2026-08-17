# Persistence and Data Modeling

## Purpose

Persistence should encode domain invariants where database constraints improve correctness, while application/domain logic handles cross-row and workflow invariants that cannot be represented cleanly with a simple constraint.

## Current implementation evidence

The current Drizzle schema already includes organizations, users, memberships, roles, role permissions, invitations, files/documents, audit logs, and prefixed TypeID generation.

Some current structures intentionally need to change because the domain was refined after the schema was written. See `../development/implementation-gap.md`.

## Modeling guidance

### Membership role

Persist exactly one current role for a membership.

Acceptable technical shapes include:
- `memberships.role_id`, or
- a relationship table constrained to one current role per membership.

An unconstrained N:N relationship is not acceptable for the intended model.

### Board

Do not persist a second authoritative `board_members` membership set.

Board status is derived from the membership's current role.

If a future table stores board-specific metadata, it must not become a competing source of truth for whether someone belongs to the board.

### Invitations

Invitation persistence must distinguish individual CPF-bound invitations from global reusable invitations, including role target, usage semantics, expiration/revocation/exhaustion, and audit context.

### Billing

Persist:
- billing configuration;
- role billing overrides;
- charges;
- payments;
- allocations;
- refunds/reversals;
- forgiveness/current component state;
- delinquency exceptions;
- barter/PAA entities when implemented.

Do not reconstruct obligations only from current configuration.

### Money

Use a deterministic exact money representation (for example integer centavos or fixed-precision decimal according to the repository convention). Never use binary floating point as the source of truth for monetary values.

### History

Meaningful domain records are deactivated/replaced/reversed rather than destructively deleted when history is required.

## Transactions

Operations that preserve cross-entity invariants should be atomic, including:
- role deactivation + all membership reassignments;
- default-role replacement;
- last-full-access transitions;
- invitation replacement;
- payment/refund allocation changes;
- provisioning completion.
