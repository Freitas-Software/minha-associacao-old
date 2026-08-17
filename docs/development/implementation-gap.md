# Known Domain ↔ Implementation Gaps

This file records known differences between the currently inspected Drizzle schema and the approved domain.

It is **not** permission to change the business rules to match the schema.

## High-priority structural gaps

### GAP-001 — Organization provisioning state

Current schema evidence: `organization_status` currently contains only `ACTIVE` and `INACTIVE`, and new organizations default to active.

Required domain:
- new organizations start in `PROVISIONING`;
- activation requires the provisioning invariants in `organizations.md`.

### GAP-002 — Membership `PENDING`

Current schema contains `PENDING`, `ACTIVE`, `INACTIVE`.

Approved business lifecycle is `ACTIVE` ↔ `INACTIVE`. A pending invitation is not an operational membership state.

The implementation needs a deliberate migration/model decision rather than treating `PENDING` as newly approved business semantics.

### GAP-003 — Multiple roles per membership

Current `membership_roles` uses a composite `(membership_id, role_id)` primary key and allows multiple roles.

Required domain: exactly one current role per membership (`MBR-005`, `ROL-005`).

### GAP-004 — Redundant board source of truth

Current schema has `board_members`.

Required domain: board membership is derived from the current role's `isBoardRole`. A second authoritative board relationship must be removed or repurposed so it cannot disagree.

### GAP-005 — Missing default join role

Current roles contain `is_board_role` and `is_full_access` but no explicit default-join flag.

Required domain: exactly one active eligible default join role per organization.

### GAP-006 — Provisioning access

No inspected schema representation exists for the temporary creator/setup authorization that is not a membership.

### GAP-007 — Invitation model

Current invitation rows are tied to a membership and a single recipient/channel and do not fully represent the approved distinction between:
- CPF-bound individual invitation;
- reusable global invitation;
- target role;
- global use limit/unlimited;
- exhausted state;
- one pending individual invitation per CPF/org;
- reactivation semantics.

### GAP-008 — Organization abbreviation uniqueness

Current schema imposes a global unique constraint on `abbreviation`.

No approved business rule requires global sigla uniqueness. Keep or remove only after treating it as an explicit technical/product decision; do not describe it as a domain invariant.

### GAP-009 — Billing

The inspected schema does not yet model the approved billing domain:
- billing config;
- role overrides;
- materialized charges;
- payments/allocations;
- refunds;
- forgiveness;
- delinquency policies/exceptions;
- advance payment.

### GAP-010 — Barter/PAA

The inspected schema does not yet model barter or PAA project/price-table/delivery data.

### GAP-011 — Audit actor semantics

Current audit rows have a nullable `actor_user_id` plus generic metadata.

The domain requires organization-user, platform-admin, and system action sources to remain distinguishable. The exact schema change is not prescribed here, but the resulting audit data must satisfy `AUD-004`–`AUD-005`.

## Existing alignment worth preserving

- stable string IDs and prefixed TypeID generation;
- CNPJ/document-number uniqueness concept;
- user email/phone nullable;
- role `is_board_role`;
- role `is_full_access`;
- global permission catalog + role-permission N:N;
- organization document types for statute and election record;
- document replacement link/history concept;
- audit log entity/action metadata pattern.

## Rule for agents/developers

Before proposing a migration, read the relevant domain file. The goal is convergence with approved behavior, not a mechanical rewrite based only on this gap list.
