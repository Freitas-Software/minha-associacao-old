# Domain Testing Strategy

Tests should focus on invariants and authorization boundaries, not only happy-path CRUD.

## Tenancy

- user in organization A cannot read/write organization B resources (`TEN-005`);
- selected organization UI state cannot bypass membership validation (`TEN-006`);
- provisioning access is scoped to exactly one organization (`TEN-013`).

## Membership and roles

- one membership per user/organization (`MBR-002`);
- exactly one current role (`MBR-005`);
- role deactivation performs complete reassignment atomically (`ROL-028`–`ROL-030`);
- default join role remains exactly one and eligible (`ROL-020`–`ROL-025`);
- role names and board flag do not grant authority (`ROL-003`, `ROL-016`);
- removing a permission takes effect without requiring logout (`ROL-034`).

## Full-access continuity

Test every operation that could remove the last active full-access membership:
- membership deactivation;
- role change;
- role deactivation;
- organization transitions.

It must fail unless a successor is already active (`ORG-026`–`ORG-029`).

## Provisioning

Activation fails when:
- CNPJ validation has not succeeded;
- mandatory documents are missing;
- role invariants are unsatisfied;
- no active full-access membership exists.

Activation may succeed while other board invitations remain pending.

## Invitations

Test:
- CPF binding for individual invitations;
- only one pending individual invitation per CPF/org;
- replacement invalidates old token;
- global invite rejects board/full-access target;
- active member does not consume global use;
- inactive member reactivation consumes use;
- exhausted vs expired vs revoked semantics.

## Billing

Test:
- charge materialization 30 days before due date;
- late activation creates next applicable charge immediately;
- inactive interval creates no recurring charges;
- zero-value charge exists and regularizes cycle;
- partial payment leaves charge open with reduced balance;
- allocation order fine -> interest -> principal;
- one payment across multiple charges;
- six-future-paid-charge limit;
- paid future charge is not recalculated after role change;
- refund can reopen balance without inflating obligation;
- principal forgiveness also forgives fine/interest;
- role delinquency policy fully replaces organization policy;
- `ANY` and `ALL` threshold semantics;
- permission changes and payment confirmation trigger fresh calculations.

## Authorization

For every privileged action, test:
- wrong tenant;
- inactive membership;
- missing permission;
- full access allowed only after tenant/membership validation.

For own-charge actions, test ownership rather than `BILLING:READ`.

For inactive former-member settlement, test that:
- own historical billing is reachable;
- unrelated organization resources remain forbidden.

## Audit

Test that mandatory reasons and actor/source information are recorded for sensitive operations.
