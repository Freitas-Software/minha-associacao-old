# External Integrations

## CNPJ registry/lookup

Organization onboarding depends on an external CNPJ-data source.

The integration must provide enough authoritative data to:
- validate the CNPJ;
- determine the legal nature/category used by initial onboarding;
- obtain the official/legal name;
- obtain trade name (`nome fantasia`) when available.

External service failure must not be treated as successful legal validation.

Exact provider selection, caching, retries, and fallback provider strategy are infrastructure decisions and are not fixed by the domain documentation.

## Payment gateway

The billing domain is provider-agnostic.

The selected payment gateway is authoritative for externally processed payment outcomes, including:
- confirmed payment;
- pending/failed payment;
- confirmed refund;
- provider-reported reversal/dispute state.

Use provider webhooks plus reconciliation rather than assuming synchronous API responses are final financial truth.

The product may use Mercado Pago, but provider-specific objects must not become the business model.

## Object storage

Institutional binary files live in S3-like object storage. Domain metadata remains in the application database.

Object-storage deletion semantics must respect document-history requirements.
