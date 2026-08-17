# Permissions

## Catalog

`PRM-001` Permissions are platform-defined atomic configurable capabilities.

`PRM-002` The global permission catalog is controlled by the product/development layer, not invented independently by organizations.

`PRM-003` Permissions have stable machine-readable codes.

`PRM-004` The existing `RESOURCE:ACTION` style is an acceptable machine-code convention.

`PRM-005` Unknown or unsupported permission codes fail closed.

## Assignment

`PRM-006` Ordinary configurable permissions are assigned to roles.

`PRM-007` Permissions are not assigned directly to users.

`PRM-008` Permissions are not assigned directly to memberships.

`PRM-009` A new permission added to the platform does not automatically appear on ordinary roles.

`PRM-010` A full-access role implicitly has all configurable permissions, including future permissions.

`PRM-011` `isBoardRole` has no authorization effect.

## Authorization categories

Not every protected action is an RBAC permission.

### Membership access

`PRM-012` Actions that every active member should be able to perform require authentication + the relevant active membership, not a synthetic permission attached to every role.

### Self/resource access

`PRM-013` Actions over a user's own resource require authentication plus the relevant ownership/resource relationship and applicable lifecycle rule.

Examples include viewing or paying one's own charge.

`PRM-014` The inactive-former-member settlement exception in `memberships.md` is a self/resource rule, not RBAC.

### Privileged access

`PRM-015` Organization-configurable privileged actions require an active membership plus the required permission, or a current `isFullAccess` role.

## Enforcement

`PRM-016` Backend authorization is authoritative.

`PRM-017` Hiding a UI control is not an authorization mechanism.

`PRM-018` Authorization must read current role/permission state; authentication sessions prove identity, not a permanent authorization snapshot.

`PRM-019` Full access means "all configurable permissions", not "skip all security checks".

## Initial billing capabilities

The following capability boundaries are approved conceptually:

- `BILLING:READ` — privileged read of other members' financial state;
- `BILLING:MANAGE_SETTINGS` — change organization-wide billing/delinquency settings;
- `BILLING:RECORD_PAYMENT` — record manual payments;
- `BILLING:FORGIVE` — forgive eligible charge components;
- `BILLING:REFUND` — initiate/record an authorized refund/reversal.

Own billing visibility/payment is self-service and does not require `BILLING:READ`.
