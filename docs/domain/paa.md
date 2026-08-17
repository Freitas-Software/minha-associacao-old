# PAA — Programa de Aquisição de Alimentos

PAA support is modeled as a specialized economic source feeding the generic barter/settlement domain.

## Project

`PAA-001` PAA data is scoped to a specific PAA project/notice/contract context.

`PAA-002` A project's official price table is associated with that project.

`PAA-003` A new project/notice uses its own price table.

`PAA-004` The current product does not require versioning multiple price tables inside the same project; treat the project's accepted table as effectively immutable for the project unless a future business case requires versioning.

## Price table

`PAA-005` The source document may be a PDF containing rows such as product, commercialization form/unit, and official price.

`PAA-006` The system should store structured price-table rows that reference their documentary source.

`PAA-007` Delivery value must be computed from structured delivery items and official project pricing, not primarily from a freely typed total.

## Deliveries

`PAA-008` One delivery may contain multiple product items from the same project.

`PAA-009` Each delivery item references the applicable project price-table item plus quantity/commercialization form.

`PAA-010` Delivery item value is calculated from quantity × applicable official price according to the supported unit semantics.

`PAA-011` Delivery total is the sum of its valued items.

## Settlement into dues

`PAA-012` Eligible PAA delivery value may become the economic source for a barter operation.

`PAA-013` The producer decides how much of the eligible value is allocated to association dues.

`PAA-014` Charge selection and residual-value handling follow `barter.md`.

## Non-rule: contextual monetary limits

Examples discussed during product discovery about typical producer/project monetary limits are contextual experience, **not universal product or legal limits**. Do not hard-code them without an explicit rule tied to the relevant PAA program/notice.
