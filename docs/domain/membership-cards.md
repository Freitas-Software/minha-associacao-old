# Membership Cards and Financial Regularity

## Separation of concerns

`CARD-001` Membership-card validity/benefits may depend on financial regularity according to organization policy.

`CARD-002` Membership-card/benefit restriction is not an RBAC authorization mechanism.

`CARD-003` A financially delinquent president or other privileged member keeps their administrative permissions according to their role.

## Regularized obligations

`CARD-004` A fully paid charge counts as regularized.

`CARD-005` A forgiven charge counts as regularized.

`CARD-006` A zero-value charge counts as regularized.

`CARD-007` Reporting must still distinguish paid, forgiven, and zero-value charges even when all three count as regularized for benefit/card purposes.

## Dynamic state

`CARD-008` Card/benefit restrictions are recalculated when the member's delinquency state changes.

`CARD-009` A role change that changes delinquency interpretation may immediately change card/benefit restrictions.

`CARD-010` A confirmed payment or other confirmed settlement change may immediately restore card/benefit eligibility when the configured delinquency rule is no longer satisfied.

`CARD-011` Pending gateway payment state is not enough to restore regularity.
