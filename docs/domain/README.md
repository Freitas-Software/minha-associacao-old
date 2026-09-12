# Domain Documentation

Files in this directory define **business semantics and invariants**.

They intentionally avoid binding the domain to a particular HTTP route layout, UI component, ORM table shape, or authentication library.

## Core domains

- `tenancy.md` — tenant boundary and organization context
- `organizations.md` — organization lifecycle and provisioning
- `users.md` — global identity
- `memberships.md` — user ↔ organization relationship
- `roles.md` — organization roles and special role flags
- `permissions.md` — configurable capability catalog
- `invitations.md` — individual and global onboarding links
- `billing.md` — charges, payments, delinquency, refunds, forgiveness
- `barter.md` — generic non-cash settlement
- `organization-documents.md` — statute, election record, and file history
- `membership-cards.md` — financial regularity and benefit restrictions
- `audit.md` — immutable domain history
- `scope.md` — deliberately undefined/future areas

## Design principle

A domain entity should have one authoritative representation for each fact.

Examples:

- board membership is derived from the membership's current role;
- current role is singular;
- current charge status belongs to the charge, while audit history explains how it changed;
- authentication proves identity, while authorization reads current domain state.
