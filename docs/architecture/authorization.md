# Authorization Architecture

Authorization must classify an operation before choosing a guard.

## 1. Public/token-scoped operation

Examples:
- login/registration;
- valid invitation acceptance.

Authorization comes from the operation-specific proof (session/token/CPF binding), not an active membership.

## 2. Provisioning operation

Required:
- authenticated identity;
- organization in provisioning;
- valid provisioning relationship/scope;
- operation allowed during provisioning.

Provisioning is not a hidden full-access membership.

## 3. Membership access

Required:
- authenticated identity;
- matching organization;
- active membership.

Use for functionality every active member receives.

Do **not** invent a permission such as `MEMBER:OPEN_HOME` just to represent basic membership access.

## 4. Self/resource access

Required:
- authenticated identity;
- resource belongs to the caller or their membership;
- applicable lifecycle rule allows the action.

Examples:
- read own charge;
- pay own charge;
- inactive former member settles own historical obligation.

Ownership validation is mandatory.

## 5. Privileged access

Required:
- authenticated identity;
- active membership in target organization;
- current role;
- required permission **or** current role `isFullAccess = true`;
- domain invariants.

## Guard order

A useful server-side ordering is:

```text
identity
-> target organization/tenant
-> relevant relationship/state
-> ownership OR capability
-> domain invariant
-> operation
```

## Full access

Full access only replaces the "does this role have configurable capability X?" check.

It never bypasses:
- target tenant validation;
- ownership where ownership is semantically required;
- invitation CPF binding;
- organization/membership lifecycle;
- last-full-access continuity;
- financial state-machine constraints.

## Board role

`isBoardRole` is never an authorization shortcut.

## Immediate permission changes

Authorization decisions must reflect current persisted role/permission state. If caching is used, invalidation/freshness must ensure removed authority cannot remain usable because of an old session or stale permission cache.

## Deny by default

Unclassified privileged operations and unknown permission codes must fail closed.
