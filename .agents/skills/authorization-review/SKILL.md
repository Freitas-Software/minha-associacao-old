---
name: authorization-review
description: Review or design Minha Associação authorization, tenant guards, permissions, ownership checks, provisioning access, inactive-member billing access, or full-access behavior. Use whenever a route/action/data query is protected.
---

# Authorization review

Read:
- `docs/domain/tenancy.md`
- `docs/domain/memberships.md`
- `docs/domain/roles.md`
- `docs/domain/permissions.md`
- `docs/architecture/authorization.md`

For each operation classify exactly one primary path:

1. public/token-scoped;
2. provisioning;
3. active membership;
4. self/resource;
5. privileged permission/full-access.

Then verify in order:

- authenticated identity or operation-specific proof;
- exact target organization;
- required relationship/lifecycle;
- ownership or configurable capability;
- domain invariants;
- operation.

Never:
- authorize by role name;
- authorize by `isBoardRole`;
- trust selected organization state;
- let `isFullAccess` bypass tenant/lifecycle/invariants;
- require an RBAC permission for basic own-resource access;
- let inactive membership become ordinary organization access.

Special case:
An inactive former member may access only their own historical billing resources needed to view/pay/track settlement.

Return findings and proposed guard/code shape. Do not edit files.
