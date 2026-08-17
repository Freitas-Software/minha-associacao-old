# Roles

## General model

`ROL-001` Roles are defined independently by each organization.

`ROL-002` Role names are completely organization-defined.

`ROL-003` Business logic and authorization must never infer semantics from role names such as "President", "Treasurer", or "Secretary".

`ROL-004` Every role has a stable ID and belongs to exactly one organization.

`ROL-005` A membership has exactly one current role.

`ROL-006` The current membership↔role relationship is singular even if the current database schema represents it as N:N.

## Full access

`ROL-007` `isFullAccess` is an explicit role property.

`ROL-008` A full-access role has every current and future **configurable** permission implicitly.

`ROL-009` Full access does not require materializing every role-permission row.

`ROL-010` More than one full-access role may exist.

`ROL-011` At least one active full-access role must be configured before an organization can become operational.

`ROL-012` An operational organization must also have at least one active membership using an active full-access role.

`ROL-013` Full access does not bypass tenant validation, resource ownership, lifecycle state, or domain invariants.

## Board roles

`ROL-014` `isBoardRole` is an explicit role property.

`ROL-015` The board flag represents institutional/UI classification and provisioning semantics only.

`ROL-016` `isBoardRole` grants no permission by itself.

`ROL-017` Board membership is derived from `membership -> current role -> isBoardRole`.

`ROL-018` There must not be a second authoritative board-membership relation.

`ROL-019` `isBoardRole` and `isFullAccess` are independent booleans. Any combination is valid unless another explicit provisioning invariant requires otherwise.

## Default join role

`ROL-020` Every organization has exactly one default join role.

`ROL-021` The default join role is represented explicitly, for example by `isDefaultJoinRole`; it must not be inferred from name, creation order, permission count, or perceived prestige.

`ROL-022` The default join role must be active.

`ROL-023` The default join role must have `isBoardRole = false`.

`ROL-024` The default join role must have `isFullAccess = false`.

`ROL-025` When the default join role is deactivated, the same logical operation must designate another eligible active role as the default.

## Deactivation

`ROL-026` Roles are not physically deleted by ordinary application flows.

`ROL-027` Roles are deactivated.

`ROL-028` A role with active memberships cannot be deactivated while leaving those memberships assigned to it.

`ROL-029` Deactivation must explicitly reassign every affected active membership to another active role in the same organization in the same logical transaction.

`ROL-030` Partial reassignment is invalid.

`ROL-031` The replacement role cannot be the role being deactivated.

`ROL-032` Deactivation of a full-access role must preserve the organization's full-access continuity invariant.

`ROL-033` Role deactivation and membership reassignment are auditable.

## Immediate authorization semantics

`ROL-034` Removing a permission from a role takes effect immediately for subsequent authorization checks.

`ROL-035` An existing authentication session does not freeze old role permissions.

`ROL-036` Authorization caches, if any, must not become authoritative after the underlying role/permission state changes.
