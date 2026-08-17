---
name: domain-change-analysis
description: Analyze a Minha Associação feature or behavior change against docs/domain rules before implementation; use for new features, changed business behavior, onboarding, membership, roles, invitations, billing, barter, PAA, or organization lifecycle. Do not use for purely mechanical formatting.
---

# Domain change analysis

1. Read `docs/README.md`.
2. Load only the minimum relevant `docs/domain/*` and referenced `docs/architecture/*`.
3. State the affected rule IDs.
4. Inspect current implementation only after the intended behavior is understood.
5. Separate:
   - approved business rule;
   - current implementation;
   - implementation drift;
   - direct consequence/inference;
   - genuinely unresolved product decision.
6. Do not ask questions whose answer is already a direct consequence of the documented rules.
7. If a missing choice materially changes product semantics, ask one focused question.
8. Otherwise produce:
   - domain impact;
   - invariant checklist;
   - data/API impact;
   - authorization category;
   - proposed implementation shape;
   - test cases.
9. Do not modify files. Draft code/diffs only in the response.
