# Memberships

## Identity and uniqueness

`MBR-001` A membership is the lifetime relationship between one user and one organization.

`MBR-002` A user may have at most one membership per organization for the lifetime of that relationship.

`MBR-003` Reactivation reuses the existing membership; it never creates a second membership for the same user/organization pair.

`MBR-004` A user may have memberships in arbitrarily many different organizations.

## Role

`MBR-005` An active membership has exactly one current role.

`MBR-006` A membership must never have multiple simultaneous roles.

`MBR-007` A membership being made active must not be left without a valid active role.

## Lifecycle

`MBR-008` The business lifecycle currently uses only `ACTIVE` and `INACTIVE`.

`MBR-009` `SUSPENDED` is explicitly out of scope until a real use case justifies it.

`MBR-010` A pending invitation is not itself an active membership. An implementation-level `PENDING` membership state must not be treated as a new approved business lifecycle state.

`MBR-011` An inactive membership grants zero ordinary organization access.

`MBR-012` Deactivating a membership does not delete or deactivate the global user account.

## Deactivation

`MBR-013` A member cannot voluntarily deactivate/close their own membership.

`MBR-014` Membership deactivation requires an actor with the appropriate privileged permission.

`MBR-015` A deactivation reason is mandatory.

`MBR-016` Deactivation is auditable.

`MBR-017` The internal deactivation reason is not automatically exposed to the former member.

## Financial obligations during deactivation

`MBR-018` Historical charges survive membership deactivation.

`MBR-019` When deactivating a membership that has outstanding charges, the privileged actor must explicitly decide the treatment of each outstanding debt: leave open, mark/settle according to a valid payment, or forgive according to billing rules.

`MBR-020` Inactivation stops generation of new recurring charges.

`MBR-021` Reactivation restarts recurring charge generation from the reactivation point forward.

`MBR-022` No recurring charges are retroactively generated for the interval in which the membership was inactive.

`MBR-023` There is no automatic proportional proration for the inactive interval.

`MBR-024` A charge already materialized while the membership was active remains a full charge unless an explicitly supported adjustment/forgiveness operation changes its valid components.

## Reactivation

`MBR-025` A former member may reactivate through a valid invitation.

`MBR-026` When an invitation reactivates an inactive membership, the invitation's role becomes the membership's current role.

`MBR-027` A privileged organization actor may reactivate an inactive membership directly.

`MBR-028` For direct reactivation, the previous active role is preselected when it still exists and is active.

`MBR-029` The privileged actor may select a different active role during direct reactivation.

`MBR-030` If the previous role is inactive, another active role must be selected.

`MBR-031` Reactivation origin must be auditable and distinguish at least invitation, organization privileged actor, and platform administration.

## Financial state is separate

`MBR-032` Membership state and delinquency are independent concepts.

`MBR-033` Delinquency does not remove administrative authorization granted by the current role.

`MBR-034` A delinquent member may have benefits/resources restricted according to delinquency policy, but their RBAC permissions remain governed by role authorization.

## Inactive former-member self-service

`MBR-035` An inactive former member may authenticate to access their **own historical financial obligations** for the former organization.

`MBR-036` This exception is limited to self-service debt visibility, payment initiation, and payment-status tracking required to regularize those obligations.

`MBR-037` The exception does not restore access to organization operations, board/member data, institutional documents, benefits, or privileged functionality.

`MBR-038` Self-service access must validate ownership of the financial resource and must never be implemented as a general bypass of the inactive membership state.
