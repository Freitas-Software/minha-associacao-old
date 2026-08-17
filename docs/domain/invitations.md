# Invitations

Minha Associação has two conceptually different invitation types.

## Shared rules

`INV-001` Invitations expire; the current product default is 30 days unless a future documented configuration changes it.

`INV-002` A pending invitation may be revoked at any time by any actor with the appropriate permission.

`INV-003` Revocation is not limited to the actor who created the invitation.

`INV-004` Invitation replacement, revocation, acceptance, expiration, and exhaustion must preserve historical/audit context.

`INV-005` Accepting a valid invitation is sufficient to activate the resulting membership/role relationship; there is no additional approval step.

`INV-006` An already active member must never receive a duplicate membership from accepting any invitation.

## Individual invitation

`INV-010` An individual invitation is bound to a CPF.

`INV-011` CPF is mandatory for an individual invitation. Without CPF pre-binding, the invitation is global.

`INV-012` Email/phone are invitation delivery channels, not identity authority.

`INV-013` If the CPF already belongs to a domain user, the invitation links/resolves to that user.

`INV-014` If no user exists, the invitation remains bound to the CPF until registration resolves that identity.

`INV-015` Only an account/domain identity matching the bound CPF may accept the invitation.

`INV-016` An individual invitation may target a board role.

`INV-017` An individual invitation may target a full-access role.

`INV-018` There may be at most one pending individual invitation per CPF per organization.

`INV-019` Creating a replacement pending individual invitation automatically invalidates/revokes the previous pending invitation and records the replacement in audit history.

`INV-020` When an inactive former member accepts a valid individual invitation, the existing membership is reactivated.

`INV-021` On invitation-based reactivation, the invitation's role becomes the membership's current role, replacing the previous role.

`INV-022` If an active member somehow accepts an individual invitation for the organization, the invitation is closed/ignored without changing membership or role.

## Global invitation

`INV-030` A global invitation has no CPF pre-binding.

`INV-031` A global invitation is reusable.

`INV-032` A global invitation may specify an eligible role.

`INV-033` A global invitation must never target a role with `isBoardRole = true`.

`INV-034` A global invitation must never target a role with `isFullAccess = true`.

`INV-035` If the global invitation does not specify another eligible role, the organization's explicit default join role is used.

`INV-036` A global invitation has a configurable usage limit from 2 uses through unlimited.

`INV-037` Reaching the usage limit produces an `EXHAUSTED` semantic state, distinct from expiration or revocation.

`INV-038` An active member opening/accepting a global invitation receives no membership/role change and does not consume a use.

`INV-039` An inactive former member may use a global invitation to reactivate the existing membership with the invitation/default role.

`INV-040` Reactivation by global invitation consumes one use.

## State semantics

Implementation may choose exact enum names, but history must distinguish at least:

- active/pending invitation;
- accepted/consumed individual invitation;
- expired;
- revoked;
- exhausted global invitation.

A pending invitation must not be modeled as proof of operational membership.
