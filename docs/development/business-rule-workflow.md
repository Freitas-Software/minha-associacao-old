# Business Rule Change Workflow

Use this process when implementation work changes business behavior.

## 1. Identify the domain

Read `docs/README.md` and the minimum relevant domain documents.

## 2. Name the affected rules

List the exact rule IDs affected by the task.

Example:

```text
MBR-005, ROL-005, ROL-028, AUD-013
```

## 3. Inspect implementation

Read the narrowest relevant:
- schema;
- domain/application service;
- route/handler;
- UI;
- tests.

Do not assume the current implementation is correct merely because it exists.

## 4. Check for drift

If code/schema conflicts with a documented rule:
- state the conflict explicitly;
- treat the doc as intended behavior;
- design migration/compatibility work deliberately.

See `implementation-gap.md` for known drift.

## 5. Classify authorization

For protected behavior, classify it as:
- membership access;
- self/resource access;
- privileged permission/full-access;
- provisioning;
- public/token-scoped.

Do not default every protected endpoint to an RBAC permission.

## 6. Preserve invariants

Before proposing a write operation, identify cross-entity invariants such as:
- exactly one current role;
- last active full-access membership;
- unique default join role;
- one membership per user/organization;
- financial allocation limits;
- tenant isolation.

## 7. Test by rule

Tests should demonstrate the rule and the failure path, especially for invariants.

## 8. Update documentation first when product policy changes

If the product owner intentionally changes a documented rule, update the rule text/ID references before treating new code as the source of truth.
