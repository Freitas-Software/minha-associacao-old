# Tenancy

## Invariants

`TEN-001` Minha Associação is multi-tenant.

`TEN-002` `Organization` is the tenant boundary.

`TEN-003` A domain `User` is global and may exist without any organization.

`TEN-004` The same user may have memberships in multiple organizations.

`TEN-005` Tenant access must be validated explicitly for every tenant-scoped operation. Authentication alone never authorizes access to organization data.

`TEN-006` A client-selected or last-selected organization is UX state only. It is never authorization evidence.

`TEN-007` Roles are organization-scoped. A role from organization A has no authority in organization B.

`TEN-008` Role names must never be used as authorization identifiers.

`TEN-009` The legal/category type of an organization does not automatically change the tenancy model.

## Provisioning path

`TEN-010` Organization creation may be performed by a person who will not become a member.

`TEN-011` During organization setup, the creator/setup operator may receive temporary **provisioning access**.

`TEN-012` Provisioning access is not a membership and grants no institutional position.

`TEN-013` Provisioning access must be limited to actions required to complete onboarding.

`TEN-014` Provisioning access must end when the organization becomes operational.

`TEN-015` After provisioning is complete, ordinary organization access requires an applicable membership, except for explicitly documented self-service exceptions such as an inactive former member settling their own historical debt.

## Authorization paths

Operational organization access follows:

```text
authenticated identity
  -> organization
  -> membership relationship/state
  -> resource ownership OR role permissions/full-access
  -> domain invariants
```

Provisioning access follows:

```text
authenticated identity
  -> organization in provisioning
  -> active provisioning relationship/scope
  -> allowed provisioning action
```

These paths must remain conceptually distinct.
