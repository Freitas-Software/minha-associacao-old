# Architecture Overview

## Domain shape

```text
Global User
   |
   +-- Membership -- Organization (tenant)
          |
          +-- exactly one current Role
                  |
                  +-- configurable Permissions
                  +-- isBoardRole
                  +-- isFullAccess
                  +-- isDefaultJoinRole
```

Organization setup has a separate temporary path:

```text
Creator/Setup operator
   |
   +-- Provisioning Access -- Organization(PROVISIONING)
```

Billing:

```text
Organization billing policy
   +-- role overrides
   |
Membership
   +-- materialized Charges
          |
          +-- Payment Allocations <-- Payments
          +-- Forgiveness
          +-- penalty / interest
```

Barter:

```text
Economic source
  -> Barter operation / credit
  -> allocations
  -> Charges

```

## Architectural principles

1. **One source of truth per fact.**
2. **Authentication and authorization are separate.**
3. **Tenant validation occurs server-side.**
4. **Current authorization is evaluated from current domain state.**
5. **Financial obligations are persisted, not reconstructed only at read time.**
6. **History is preserved without making audit logs the current-state database.**
7. **Infrastructure libraries do not redefine business requirements.**
8. **The schema must converge toward the documented domain, not the reverse.**

## IDs

The implementation currently uses prefixed TypeID-style IDs for domain entities. This is a valid technical convention. Business rules depend on stable internal IDs, not on the specific ID library.
