# Barter

Barter (`permuta`) is a generic financial mechanism configured by the organization and the producer.

## Core model

`BRT-001` Barter represents non-cash economic value generated from goods, services, production, or another supported agreement.

`BRT-002` A barter operation may generate a confirmed credit/value that can be allocated to membership charges.

`BRT-003` The barter model must not depend on a specific external program, notice, sector, product, or valuation table.

`BRT-004` The organization and producer define the agreement, recognized value, eligible value, evidence, and residual-value disposition for each operation.

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

`BRT-016` The system must preserve the agreement description, recognized value, selected allocations, residual disposition, actors, and relevant supporting evidence.

## Intentionally unspecified

The exact approval workflow for each organization is not standardized. Do not invent one universal approval process.
