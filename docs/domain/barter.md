# Barter

Barter (`permuta`) is a generic financial mechanism. PAA is one specialized source, not the definition of barter itself.

## Core model

`BRT-001` Barter represents non-cash economic value generated from goods, services, production, or another supported agreement.

`BRT-002` A barter operation may generate a confirmed credit/value that can be allocated to membership charges.

`BRT-003` PAA is one possible source of barter value; the billing core must not depend on PAA-specific entities.

`BRT-004` Future non-PAA barter sources must be able to reuse the same allocation model without changing the core charge model.

## Allocation

`BRT-005` The member/producer decides how much eligible value from the operation is used to settle association dues.

`BRT-006` The member/producer may choose which charges receive the allocation.

`BRT-007` The UI should recommend oldest overdue obligations first when that helps regularization, but FIFO allocation is not mandatory.

`BRT-008` Barter may settle one or multiple charges.

`BRT-009` Barter may partially settle a charge.

`BRT-010` Barter allocations obey the same charge component allocation order as other payments.

`BRT-011` Barter may prepay future charges subject to the same maximum of six future paid charges.

## Residual value

`BRT-012` Any value not allocated to charges is handled according to the agreement for that specific barter operation.

`BRT-013` Residual value may be returned to the member/producer, retained as future credit, or split between supported dispositions.

`BRT-014` There is no organization-wide mandatory default disposition for every barter operation.

`BRT-015` The selected residual-value disposition must be recorded on the operation.

## Auditability

`BRT-016` The system must preserve the economic source, calculated/recognized value, selected allocations, residual disposition, actors, and relevant supporting evidence.

## Intentionally unspecified

The exact approval workflow for every future non-PAA barter source is not yet standardized. Do not invent one universal approval process. PAA-specific valuation rules are defined in `paa.md`.
