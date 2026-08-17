# Multi-Tenancy Architecture

## Tenant key

Every tenant-scoped domain record must be attributable to an organization either directly or through an unambiguous relationship.

## Request handling

Never trust an organization ID because it came from:
- a route param;
- request body;
- frontend state;
- a "selected organization" cookie/local state;
- a cached query key.

The server resolves identity and validates the caller's relationship to the target organization.

## Multiple memberships

A user may switch between organizations in the UI. This must never turn into cross-tenant authorization leakage.

When a cache/query layer is introduced, tenant-scoped cache keys must include the organization identity where necessary.

## Provisioning

Provisioning access is tenant-scoped and must be validated against the exact organization being configured.

## Platform administration

Future platform-administration capability is distinct from organization membership authority. Platform interventions must be explicitly implemented and audited rather than hidden as a fake organization role.

## Historical self-service

Inactive membership debt access is narrowly scoped to resources owned by that former membership. It is not an alternative tenant-membership authorization path for ordinary organization resources.
