# Users

## Global identity

`USR-001` A domain `User` is distinct from an authentication-provider user/account.

`USR-002` The domain user has a stable internal ID that remains the technical identity even if human-facing identity data is corrected.

`USR-003` CPF is the primary familiar identity document for the initial product and the intended login identifier.

`USR-004` CPF is not the database primary key.

`USR-005` A user may exist before an authentication account exists.

`USR-006` A user may exist without any organization membership.

`USR-007` A user may be pre-registered because an individual invitation identifies them by CPF.

## CPF corrections

`USR-008` CPF correction is a controlled identity-correction operation, not ordinary profile editing.

`USR-009` Correcting CPF preserves the internal user ID and historical relationships.

`USR-010` Identity corrections must be auditable.

## Contact information

`USR-011` Email is optional in the business domain.

`USR-012` Phone is optional in the business domain.

`USR-013` A completed profile should have at least one supported contact method.

`USR-014` An authentication framework's technical requirement must not silently convert email into a mandatory business field.

## Identity convergence

`USR-015` Different onboarding paths must converge on one domain identity; the system must prevent duplicate domain users for the same CPF.

`USR-016` When an individual invitation references a CPF that already belongs to a domain user, the invitation resolves to that user.

`USR-017` When no user exists yet, the invitation remains bound to the CPF and resolves when a user with that CPF completes registration.

## Authentication integration

`USR-018` Better Auth or any future authentication provider is an infrastructure choice. It must adapt to the domain rather than redefine domain identity requirements.

`USR-019` Do not invent a synthetic user-facing email as a business requirement merely to satisfy an authentication library. Any technical adaptation that fabricates identity data requires an explicit architecture decision.

`USR-020` A global account remains valid even when the user has no active organization memberships.
