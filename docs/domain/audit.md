# Audit and Historical Trace

## General principles

`AUD-001` Meaningful domain history is append-oriented and must not be silently destroyed.

`AUD-002` Audit records are historical evidence; they are not the sole authoritative representation of current domain state.

`AUD-003` Current state belongs on the relevant domain entity. Audit explains how/why it changed.

Example: a forgiven charge must itself represent forgiveness; the audit record captures actor, reason, time, and context.

## Actor identity

`AUD-004` Audit context must distinguish ordinary organization user actions from platform administration and system-generated actions where relevant.

`AUD-005` A nullable `actor_user_id` alone is not sufficient if it makes platform/system actions indistinguishable. Storage may vary, but actor class/source must remain recoverable.

## Required audited actions

At minimum, audit must cover:

`AUD-010` membership deactivation and reason;

`AUD-011` membership reactivation and origin;

`AUD-012` role change;

`AUD-013` role deactivation and all resulting membership reassignments;

`AUD-014` permission changes that alter role authorization;

`AUD-015` individual invitation replacement;

`AUD-016` invitation revocation;

`AUD-017` organization provisioning completion;

`AUD-018` identity/CPF correction;

`AUD-019` billing configuration changes;

`AUD-020` charge recalculation;

`AUD-021` manual payment recording;

`AUD-022` forgiveness and mandatory reason;

`AUD-023` refund/reversal and mandatory reason;

`AUD-024` individual delinquency exception and mandatory reason;

`AUD-025` material barter settlement operations.

## Immutability

`AUD-030` Application flows must not edit old audit records to represent new facts.

`AUD-031` Corrections are represented by new events/current-state changes, preserving prior evidence.

## Data retention

`AUD-032` A second archival database is not currently required. If audit volume later becomes operationally problematic, archival may be introduced without changing the domain requirement that historical trace remain available.
