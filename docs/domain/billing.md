# Billing

Billing is a core product domain. It exists to provide reliable control over association dues, debt history, regularity, and settlement.

## Model separation

`BIL-001` Billing configuration defines how obligations are generated.

`BIL-002` A `Charge` is a persisted/materialized concrete financial obligation.

`BIL-003` A `Payment` is a separate settlement entity.

`BIL-004` Payment allocations connect payment value to one or more charges.

`BIL-005` Charges must not exist only as values computed when a screen is opened.

## Recurring charge generation

`BIL-006` Normal recurring charges are materialized 30 days before their due date.

`BIL-007` The organization defines the first due date, which acts as the recurrence anchor.

`BIL-008` The organization's due-date rule is organization-wide; roles do not override the due-date anchor.

`BIL-009` If a membership becomes active/reactivates after the normal 30-day materialization point but before the next applicable due date, the next applicable charge is generated immediately.

`BIL-010` No recurring charge is generated for a period before the membership became active.

`BIL-011` There is no automatic proration for partial periods.

`BIL-012` Inactive memberships do not generate new recurring charges.

`BIL-013` Reactivation restarts generation prospectively, with no retroactive charges for the inactive interval.

## Amount and periodicity

`BIL-014` Each organization has a default dues amount.

`BIL-015` The UI/product may suggest an initial amount such as R$ 15,00, but that value is not a domain invariant and is fully customizable.

`BIL-016` A role may override the organization default amount.

`BIL-017` There is no ordinary per-membership custom dues amount override.

`BIL-018` Each organization has a default periodicity.

`BIL-019` A role may override periodicity.

`BIL-020` Supported periodicities may include monthly, quarterly, semiannual, annual, and other explicitly supported recurrence models.

`BIL-021` A zero-value applicable amount still generates the cycle's charge.

`BIL-022` A zero-value charge counts as financially regularized for that cycle while remaining distinguishable in reporting.

## Role changes and charge recalculation

`BIL-023` Changing a member's role immediately changes the policy used for future billing behavior and delinquency interpretation.

`BIL-024` The organization chooses its role-change recalculation policy from supported product behaviors.

The approved policy choices are:

- future-only: existing eligible open charges keep their prior calculation;
- future + eligible open charges: eligible unpaid/open charges may be recalculated according to the new role.

`BIL-025` Paid, forgiven, or otherwise closed charges are never recalculated because of a later role change.

`BIL-026` A future charge that has already been paid in advance is locked against later role amount/period changes.

`BIL-027` Charge recalculations are auditable.

## Payment

`BIL-028` Partial payments are allowed.

`BIL-029` A charge may receive multiple payments/allocations using different methods.

`BIL-030` A partially settled charge remains semantically `OPEN`; remaining balance is computed from obligation components and allocations.

`BIL-031` The domain does not require a separate `PARTIALLY_PAID` charge status.

`BIL-032` One payment may allocate value across multiple distinct charges.

`BIL-033` Paying multiple charges at once does not merge or increase the nominal principal of those charges.

`BIL-034` Charge nominal obligation changes only through an explicitly supported recalculation/adjustment. Payments and refunds change settlement/balance, not the original identity of the charge.

## Gateway payments

`BIL-035` The payment gateway is authoritative for externally processed payment outcomes.

`BIL-036` A payment initiation or pending gateway state is not equivalent to confirmed payment.

`BIL-037` Financial regularity is recalculated after confirmed settlement state changes.

`BIL-038` Gateway-native retry behavior is followed for recurring gateway payments; the domain does not define a parallel hard-coded retry schedule.

`BIL-039` If recurring payment retries ultimately fail, the corresponding charge remains open.

`BIL-039A` Recurring payment is a product/domain capability; the payment provider is an implementation mechanism and must not define the core billing model.

`BIL-040` The integration must use webhook/reconciliation semantics so delayed provider state changes can update payment and charge settlement.

## Advance payment

`BIL-041` A member may request creation of eligible future charges in order to pay them in advance.

`BIL-042` At most **six future charges may be already paid at the same time** for a membership.

`BIL-043` The limit is six future charges/cycles, not six calendar months.

`BIL-044` The limit applies regardless of settlement source, including ordinary payments and barter.

`BIL-045` As time advances and previously future charges become current/past, advance-payment capacity becomes available again.

## Fine and interest

`BIL-046` Penalty/fine and interest are optional and configurable at organization level.

`BIL-047` Fine/interest policy is not role-specific.

`BIL-048` Fine and interest accrue only over the relevant outstanding balance.

`BIL-049` Once the relevant balance is zero because of payment/forgiveness, accrual stops.

`BIL-050` Partial settlement allocation order is fixed product-wide:
1. penalty/fine;
2. accrued interest;
3. principal.

`BIL-051` Organizations cannot configure a different allocation order.

`BIL-052` Exact calculation models must come from supported, auditable product formulas. Do not implement arbitrary executable formulas from configuration without a new decision.

`BIL-053` Before enabling calculation settings in production, supported limits/formulas must be validated against applicable Brazilian law and the organization's governing rules.

## Forgiveness

`BIL-054` Forgiveness is a privileged action requiring a dedicated capability such as `BILLING:FORGIVE`.

`BIL-055` A mandatory reason is required.

`BIL-056` Forgiveness is irreversible/final.

`BIL-057` The supported forgiveness granularity is whole charge components, not arbitrary partial values inside a component.

Eligible component operations:

- forgive all penalty/fine;
- forgive all accrued interest;
- forgive all principal.

`BIL-058` Forgiving principal automatically forgives any associated penalty and interest and fully closes the charge obligation.

`BIL-059` Penalty or interest may be forgiven while principal remains open.

`BIL-060` The charge's current state must represent forgiveness; audit history explains who, why, and when.

`BIL-061` Forgiven obligations count as regularized for membership-card/delinquency purposes.

`BIL-062` Forgiveness is not revenue and must remain distinguishable from payment in financial reporting.

## Refunds and reversals

`BIL-063` Refund/reversal is a separate privileged capability such as `BILLING:REFUND`.

`BIL-064` A refund requires a mandatory reason and audit history.

`BIL-065` Refunds may be full or partial.

`BIL-066` A refund can reopen balance on a previously settled charge.

`BIL-067` A refund must not inflate the charge beyond the valid original/adjusted obligation.

`BIL-068` For externally processed payments, the application may initiate a refund, but must not consider it finalized until the gateway confirms the financial result.

`BIL-069` Provider-reported bank reversals, disputes, or similar settlement reversals must reconcile into payment/charge state.

## Delinquency

`BIL-070` Delinquency is distinct from membership status and RBAC.

`BIL-071` An organization defines a default delinquency policy.

`BIL-072` A role may define its own delinquency policy.

`BIL-073` A role-specific delinquency policy **fully replaces** the organization default policy. It does not partially inherit fields.

`BIL-074` Supported delinquency criteria include:
- days after due date;
- number of overdue charges;
- both.

`BIL-075` When both criteria are configured, the policy explicitly chooses:
- `ANY`: delinquent if either threshold is satisfied;
- `ALL`: delinquent only if both thresholds are satisfied.

`BIL-076` Changing a member's role immediately recalculates delinquency using the new role's policy.

`BIL-077` Any derived delinquency restrictions are applied immediately after the recalculation.

`BIL-078` Any confirmed settlement state change immediately recalculates delinquency.

`BIL-079` A partial payment can make the member regular again when the configured delinquency condition is no longer satisfied, even if some balance remains open.

`BIL-080` Pending/unconfirmed gateway payments do not regularize the member.

## Delinquency exceptions

`BIL-081` A privileged organization actor may create a temporary administrative delinquency exception for an individual membership.

`BIL-082` The exception has a start date, end date, mandatory reason, and audit history.

`BIL-083` The exception changes the interpretation/restriction result, not the underlying charges.

`BIL-084` After expiration, ordinary organization/role delinquency policy resumes automatically.

## Restrictions

`BIL-085` Delinquency restrictions may affect benefits/resources such as membership-card validity.

`BIL-086` Delinquency restrictions never remove role-based administrative authorization.

`BIL-087` Delinquency restrictions never block a member from viewing or settling their own debt.

`BIL-088` An inactive former member with surviving open obligations retains only the limited financial self-service access defined in `memberships.md`.

`BIL-089` Restriction types come from a product-supported catalog rather than arbitrary executable organization-defined behavior.

`BIL-090` The organization chooses which supported restrictions its default delinquency policy applies. A role-specific delinquency policy may choose its own supported restrictions and, like the rest of that role policy, fully replaces the organization default for members in that role.
