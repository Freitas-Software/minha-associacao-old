# Product Scope

## Initial organization category

`SCP-001` The domain model uses the generic concept `Organization`.

`SCP-002` Initial production onboarding supports **Brazilian private associations only**.

`SCP-003` A CNPJ whose external legal-nature validation does not classify it as an accepted private association must be rejected during initial onboarding.

`SCP-004` Cooperatives are a planned future organization category. Their future support must extend the accepted legal categories and only introduce domain differences when real business requirements justify them.

`SCP-005` Current code must not branch behavior by future organization categories that are not enabled.

## Explicitly deferred

The following areas may exist later but do not yet have enough approved business rules to be implemented from assumptions:

- events and assemblies;
- organization-wide communications and notices;
- generic member benefits beyond delinquency restrictions/card validity;
- AI workflows over organization documents;
- detailed approval workflows for every possible non-PAA barter source;
- cooperative-specific governance;
- advanced document taxonomy beyond the mandatory institutional documents;
- arbitrary custom formulas for penalties/interest;
- a `SUSPENDED` membership state.

When work touches these areas, collect a product decision instead of inventing behavior.
