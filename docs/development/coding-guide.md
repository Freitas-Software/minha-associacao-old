# Minha Associação Coding Guide

This document defines the default coding conventions for the **Minha Associação** repository.

It is intended for both human developers and coding agents.

Its purpose is not to impose stylistic ceremony.

Its purpose is to make implementation predictable, reviewable, testable, and consistent with the documented domain.

---

## 1. Before writing code

Before implementing business-sensitive behavior:

1. Read `docs/README.md`.
2. Identify the smallest relevant `docs/domain/*` documents.
3. Identify the affected rule IDs.
4. Read referenced architecture documentation.
5. Inspect the current implementation and schema.
6. Check `docs/development/implementation-gap.md`.
7. Classify authorization when applicable.
8. Design the smallest coherent change.
9. Only then write implementation.

Do not infer intended behavior solely from existing code or schema.

If the requested product behavior intentionally changes a documented rule, update the rule before treating the new implementation as authoritative.

---

## 2. General coding principles

Code should optimize for:

- correctness;
- explicit ownership;
- clear dependencies;
- small reviewable changes;
- predictable failure behavior;
- domain invariants;
- testability;
- readability without excessive abstraction.

Prefer boring code that clearly expresses the rule over clever code that hides it.

Do not introduce an abstraction merely because similar projects commonly have one.

---

## 3. Repository tooling

The repository uses `pnpm` workspaces and Turborepo.

Do not substitute `npm` or Yarn for repository workflows.

Biome is the formatting and lint authority.

Formatting preferences that Biome can decide should not become manual style debates.

Use existing workspace scripts before creating new command variants.

---

## 4. TypeScript

Use TypeScript as a correctness tool rather than only as editor documentation.

### Avoid `any`

Prefer:

```ts
unknown
```

at untrusted boundaries and narrow or parse it.

Avoid:

```ts
const payload = value as SomeType;
```

when the cast exists only to silence the compiler.

Prefer validation or a real type guard.

### Assertions

Type assertions and non-null assertions are acceptable only when the invariant is genuinely established and not expressible conveniently in the type system.

They should not be the default way to resolve type errors.

### Exported contracts

Export types that represent meaningful module boundaries.

Do not export every internal implementation type.

Keep implementation details private by default.

---

## 5. ESM imports

The API uses TypeScript ESM.

Follow the existing ESM import convention, including `.js` runtime extensions where required by the current TypeScript configuration.

Example:

```ts
import { users } from '../../db/schema/users.js';
```

Do not introduce a new path alias system as a side effect of an unrelated feature.

Import-resolution changes should be deliberate architecture changes.

---

## 6. Naming

Use names that describe business meaning.

| Kind | Convention | Example |
|---|---|---|
| File | kebab-case | `create-organization.ts` |
| Function | camelCase | `createOrganization` |
| Variable | camelCase | `activeMembership` |
| Type | PascalCase | `AuthenticatedActor` |
| Interface | PascalCase | `PaymentProvider` |
| Constant | UPPER_SNAKE_CASE when truly constant | `MAX_UPLOAD_SIZE` |
| Database table/column | existing database convention | `organization_id` |
| API property | application convention | `organizationId` |

Do not prefix interfaces with `I`.

Prefer:

```ts
PaymentProvider
```

over:

```ts
IPaymentProvider
```

Avoid meaningless names such as:

```text
data
item
thing
manager
helper
utils
common
misc
```

when a more specific domain term exists.

---

## 7. File naming should reveal responsibility

Prefer:

```text
create-organization.ts
membership.repository.ts
billing.policy.ts
organizations.route.ts
organization.schema.ts
```

over:

```text
organization-manager.ts
organization-helper.ts
organization-utils.ts
service.ts
handler.ts
```

unless the generic term genuinely describes the responsibility.

A developer should normally be able to find an operation by searching for the business action name.

---

## 8. Functions

Functions should do one coherent thing.

This does not mean every function must be tiny.

It means the function should have one understandable reason to change.

Prefer an options/input object when positional arguments would become ambiguous.

Prefer:

```ts
await createMembership({
  userId,
  organizationId,
  roleId,
});
```

over:

```ts
await createMembership(userId, organizationId, roleId);
```

when argument meaning is not immediately obvious.

Avoid boolean arguments that hide semantics.

Prefer:

```ts
updateMembership({
  preserveDebtHistory: true,
});
```

over:

```ts
updateMembership(true);
```

---

## 9. Pure business logic

When a business decision can be calculated from supplied state, prefer a pure function.

Example:

```ts
export function wouldRemoveLastFullAccessMember(input: {
  activeFullAccessCount: number;
  targetHasFullAccess: boolean;
}): boolean {
  return input.targetHasFullAccess && input.activeFullAccessCount === 1;
}
```

Pure functions are especially useful for:

- state-transition rules;
- billing calculations;
- eligibility decisions;
- permission-independent domain invariants;
- date calculations;
- financial status calculations.

Do not pass Fastify requests, database clients, or provider SDK objects into a function that only needs domain data.

---

## 10. Business rule IDs

Stable rule IDs should be referenced when they materially improve traceability.

Good:

```ts
// ORG-xxx: an operational organization must retain at least one
// active full-access member.
```

Avoid attaching rule comments to trivial implementation details.

Rule IDs are especially useful in:

- invariant enforcement;
- tests;
- migrations involving domain semantics;
- authorization decisions;
- non-obvious state transitions.

The code should still be understandable without requiring comments for every line.

---

## 11. Routes

Fastify routes are transport boundaries.

A route should normally:

1. validate transport input;
2. execute required authentication/authorization hooks;
3. call an application operation;
4. map the outcome to HTTP;
5. return an explicitly defined response shape.

Example:

```ts
const organizationsRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/organizations',
    {
      preHandler: app.requireAuth,
      schema: {
        body: createOrganizationBodySchema,
        response: {
          201: organizationResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await createOrganization({
        database: app.database!.db,
        actor: request.actor!,
        input: request.body,
      });

      return reply.status(201).send({
        organization: result.organization,
      });
    }
  );
};

export default organizationsRoute;
```

The exact dependency wiring may evolve, but the route should remain primarily an HTTP adapter.

Do not place a multi-step domain workflow directly inside the route handler.

---

## 12. Route schemas

Validate untrusted input at the application boundary.

Use Zod according to the project's Fastify type-provider conventions.

Normalize input when normalization is an input-boundary concern.

Example:

```ts
const registrationBodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  documentNumber: z
    .string()
    .transform(normalizeCpf)
    .refine(isValidCpf),
});
```

After validation, internal code should operate on normalized typed input instead of repeatedly validating the same transport payload.

Response schemas should describe intentional API contracts.

Do not expose raw database rows simply because their shape is convenient.

---

## 13. Application operations

Important behavior should have an explicit application operation.

Example:

```ts
export interface CreateOrganizationInput {
  legalName: string;
  documentNumber: string;
}

export interface CreateOrganizationOptions {
  database: Database;
  actor: AuthenticatedActor;
  input: CreateOrganizationInput;
}

export async function createOrganization(
  options: CreateOrganizationOptions
) {
  // application behavior
}
```

Class-based use cases are not required.

Use classes only when object lifecycle or state genuinely makes them useful.

A plain function is usually preferable for stateless application operations.

---

## 14. Services

Do not create a `service` layer by default.

A service is acceptable when it represents a real cohesive capability.

Avoid generic files that become dumping grounds:

```text
organization.service.ts
billing.service.ts
user.service.ts
```

If a service starts collecting unrelated commands, split those commands into explicit operations.

---

## 15. Repositories

Database queries required by an application module should be isolated when doing so improves ownership, reuse, or testability.

A repository should express application-oriented persistence operations.

Good:

```text
findActiveMembership()
countActiveFullAccessMembers()
insertMembership()
findOrganizationByDocument()
```

Less useful:

```text
get()
save()
find()
update()
```

when the meaning is ambiguous.

Do not place business policy inside repositories merely because the policy depends on database state.

Fetch the required state, then make the decision at the appropriate application/policy layer.

---

## 16. Database access

Routes should not perform arbitrary Drizzle queries.

Database access should normally live in:

- repositories;
- explicitly database-oriented infrastructure;
- narrowly scoped application operations when extracting a repository would add no real value.

The repository architecture is pragmatic, not dogmatic.

For a trivial one-use query, an extra abstraction may not be necessary.

For shared, security-sensitive, tenant-sensitive, or complex queries, explicit ownership is strongly preferred.

---

## 17. Transactions

Use a database transaction when several persistence operations form one logical domain change.

Examples include:

- provisioning an organization;
- changing state while preserving a required invariant;
- allocating or settling financial resources;
- changes where partial completion would create invalid domain state.

The transaction boundary belongs around the application operation that requires atomicity.

Do not start independent nested transactions in lower-level helpers unless the persistence strategy explicitly supports and requires them.

---

## 18. Database constraints

Use database constraints to reinforce invariants that can be safely represented physically.

Do not rely on database constraints as the sole representation of complex product policy.

Application checks provide meaningful behavior and error handling.

Database constraints provide final consistency protection against races or invalid persistence.

Both may be necessary.

---

## 19. IDs

Use the repository's existing domain ID helper and established prefixed ID convention unless an explicit architecture decision changes it.

Do not introduce a second ID generation strategy for a new module.

External provider IDs are not replacements for internal domain IDs.

Store provider identifiers separately when needed.

---

## 20. Money

Never perform monetary calculations with ordinary JavaScript floating-point assumptions.

Follow the billing and persistence architecture for the specific representation used by the domain.

Provider-specific monetary representation must be converted explicitly at integration boundaries.

Do not silently mix:

```text
reais
cents
decimal strings
provider integer amounts
database numeric values
```

---

## 21. Dates and time

Distinguish business dates from timestamps.

Examples:

```text
birth date
competence/month
due date
```

are not automatically timestamps.

Events such as:

```text
created at
paid at
revoked at
accepted at
```

are timestamps.

Do not apply timezone conversion to a date-only concept as if it were an instant.

When an instant is required, use a consistent UTC-based representation internally and convert only at presentation boundaries.

---

## 22. Authentication

Authentication establishes identity.

It does not automatically establish tenant authority.

Code must preserve the distinction between:

```text
authenticated global user
```

and:

```text
authorized organization operation
```

An authenticated actor may have:

- zero memberships;
- inactive memberships;
- memberships in several organizations;
- different authorization state in each organization.

Never infer tenant permission from authentication alone.

---

## 23. Authorization

Every protected operation must be classified according to `docs/architecture/authorization.md`.

Authorization must use current server-side domain state.

Never authorize an organization operation solely from:

- selected organization UI state;
- a client-provided role name;
- `isBoardRole`;
- cached stale permissions;
- an old session claim;
- existence of an invitation.

`isFullAccess` may satisfy configurable permission requirements but must not bypass:

- tenant boundaries;
- membership state;
- ownership rules;
- domain invariants;
- non-configurable restrictions.

Unknown privileged operations or permission codes must fail closed.

---

## 24. Tenant scoping

Organization is the tenant boundary.

Queries for organization-owned resources must be scoped using trusted server-side organization context.

Bad:

```ts
const invoice = await findInvoice(request.params.invoiceId);
```

followed by an assumption that the client chose the correct organization.

Prefer a query or operation that makes the tenant boundary explicit:

```ts
const invoice = await findOrganizationInvoice({
  organizationId,
  invoiceId,
});
```

when the resource belongs to an organization.

Resource ownership must still be validated when required by the authorization category.

---

## 25. Errors

Expected business rejection and unexpected system failure are different concepts.

Expected examples:

```text
duplicate organization
inactive membership
permission denied
invalid state transition
invitation expired
```

Unexpected examples:

```text
database connectivity failure
provider outage not mapped to an expected result
programming error
invariant impossible under documented state
```

Do not expose raw database/provider errors to API clients.

Use stable machine-readable error codes where the client needs to distinguish outcomes.

Example:

```json
{
  "error": "Authentication required",
  "code": "AUTH_REQUIRED"
}
```

Sensitive identity flows should avoid error responses that unnecessarily disclose account existence or authentication internals.

---

## 26. Logging

Use the repository's structured logger/Fastify request logger.

Do not use `console.log` for application diagnostics.

Prefer:

```ts
request.log.error(
  { err: error, organizationId },
  'Failed to provision organization'
);
```

over concatenated strings containing serialized data.

Do not log:

- passwords;
- session tokens;
- authorization headers;
- secrets;
- raw payment credentials;
- unnecessary personal documents;
- full sensitive identity data.

Include identifiers and context needed for diagnosis without leaking sensitive information.

---

## 27. External integrations

Provider-specific behavior belongs behind an explicit integration boundary.

Examples:

```text
Better Auth
object storage
payment gateway
CNPJ registry
email provider
```

Do not allow provider response objects to become domain models.

Convert them into application-owned shapes.

This makes provider replacement and failure handling more explicit.

---

## 28. Provider interfaces

Do not introduce elaborate ports/adapters architecture by default.

When a module needs an external capability, a narrow structural TypeScript interface is sufficient.

Example:

```ts
export interface OrganizationRegistry {
  findByCnpj(cnpj: string): Promise<RegistryOrganization | null>;
}
```

The infrastructure adapter may satisfy that interface without requiring inheritance or framework-specific base classes.

Interfaces should reflect what the consuming application behavior needs, not everything the provider SDK offers.

---

## 29. Cross-domain behavior

Do not solve cross-domain behavior by importing internal repositories from several unrelated modules into a route.

Create an explicit workflow when the application operation genuinely spans domains.

Example:

```text
provision organization
```

may coordinate:

```text
organizations
memberships
roles
permissions
documents
audit
```

The workflow owns orchestration.

Each participating module retains ownership of its local behavior.

---

## 30. Dependency injection

Dependencies should be explicit enough that important application behavior can be tested without hidden global state.

Acceptable patterns include passing dependencies through an options object or composing them during application bootstrap.

Avoid introducing a dependency-injection container solely for architectural appearance.

Prefer simple TypeScript composition until complexity proves otherwise.

---

## 31. Frontend features

Web and mobile UI should be organized by product feature.

A feature owns its feature-specific:

```text
components
hooks
schemas
queries
mutations
presentation state
```

when those abstractions are needed.

Do not move a component into a global shared directory merely because another screen might theoretically reuse it later.

Promote code to shared ownership only after real reuse exists.

---

## 32. Frontend server state

Server-authoritative data should have a clear synchronization strategy.

Do not duplicate server truth in several unrelated local state stores.

Examples of server-authoritative data include:

- memberships;
- permissions;
- financial state;
- organization state;
- invitations.

Local UI state may control presentation and navigation but must not redefine those server states.

---

## 33. Frontend authorization

The frontend may hide or disable controls for user experience.

That is not authorization.

Every privileged operation must still be authorized by the API.

The client must assume its local authorization view may become stale.

---

## 34. Components

Prefer components with explicit responsibilities.

A page component should not become a large mixture of:

```text
data fetching
business calculations
form validation
navigation
presentation
provider calls
```

Extract behavior when it has an identifiable responsibility.

Do not split trivial markup into dozens of components merely to reduce line count.

Cohesion is more important than file size.

---

## 35. Shared workspace packages

Do not create a workspace package for code used by only one application unless there is another strong architectural reason.

Extraction to `packages/*` should represent real stable reuse.

Public package APIs should be intentionally small.

Avoid package-level deep imports into implementation details.

---

## 36. Comments

Comments should explain:

- why a surprising decision exists;
- which domain invariant requires behavior;
- why a workaround exists;
- why an external provider requires special handling.

Avoid comments that merely translate code into English.

Bad:

```ts
// increment count
count++;
```

Useful:

```ts
// MBR-xxx: historical membership identity is preserved instead of
// creating a second membership for the same user+organization pair.
```

---

## 37. Documentation comments

Use JSDoc when it adds value to a reusable/public contract.

Do not add JSDoc mechanically to every function.

Names and types should normally explain ordinary internal functions.

---

## 38. Imports and module boundaries

Inside a module, import the concrete file that owns the behavior.

Avoid giant barrel files that re-export every implementation detail.

A module-level public entry point may be introduced when real cross-module consumers exist.

Cross-module consumers should depend on the intended public surface rather than internal helpers.

Do not add barrel files solely to shorten import paths.

---

## 39. Avoid circular dependencies

If two modules require each other's internals, treat it as an architectural signal.

Possible solutions include:

- move orchestration to a workflow;
- extract a narrow independent capability;
- invert a dependency through an interface;
- reconsider which module actually owns the behavior.

Do not resolve circular dependencies by moving arbitrary business logic into `shared/`.

---

## 40. Tests

Tests should emphasize business invariants and security boundaries.

For meaningful behavior, cover at least the relevant combinations of:

```text
allowed path
business rejection
authorization rejection
boundary state
invalid state transition
provider failure when applicable
transactional failure when applicable
```

Tests should reference rule IDs when that improves traceability.

Do not test implementation details that can change without changing observable behavior.

---

## 41. Mocking

Prefer mocking external boundaries over mocking large parts of the application's own logic.

Good mock candidates:

```text
payment provider
email provider
object storage
registry API
clock when time-dependent
```

Pure domain functions generally do not need mocks.

Repository mocking is appropriate for isolated application-operation tests when database behavior itself is not what the test is proving.

Use database integration tests when database constraints, transaction semantics, or query scoping are the actual behavior under test.

---

## 42. Security-sensitive code

Security-sensitive implementation requires explicit scrutiny.

This includes:

```text
authentication
authorization
tenant resolution
payments
personal documents
financial history
invitation tokens
provider webhooks
password/account recovery
```

Prefer explicit code over compact abstractions when compactness would make the security boundary harder to inspect.

Fail closed when privileged state is unknown.

---

## 43. Do not encode product policy in magic values

Avoid:

```ts
if (role.name === 'President') {
  // privileged action
}
```

unless the domain explicitly defines that exact name as normative, which current authorization architecture generally does not.

Prefer explicit permission/invariant evaluation.

Likewise, do not hard-code contextual financial values from examples as universal product limits.

---

## 44. Refactoring

Separate structural refactors from business behavior changes whenever practical.

Good:

```text
PR 1: move identity behavior into the identity module
PR 2: add new organization onboarding behavior
```

Harder to review:

```text
one PR moves 40 files, changes authorization,
rewrites persistence, and adds a feature
```

A refactor should preserve observable behavior unless the PR explicitly states otherwise.

---

## 45. Adding dependencies

Before adding a dependency:

1. confirm the repository does not already provide the capability;
2. confirm the standard library or existing stack cannot solve it clearly;
3. evaluate runtime and maintenance cost;
4. confirm the package is appropriate for every workspace that will depend on it.

Do not add a large dependency to avoid writing a small straightforward function.

---

## 46. Generated code

Generated files should remain clearly identifiable.

Do not manually maintain generated output when the authoritative source is another file.

Do not edit generated database/auth artifacts to encode business policy that belongs elsewhere.

---

## 47. Implementation checklist

Before considering a business-sensitive change complete:

- [ ] Relevant domain documentation was identified.
- [ ] Affected rule IDs were identified.
- [ ] Current implementation was inspected.
- [ ] Known domain/schema drift was checked.
- [ ] Authorization category was identified when applicable.
- [ ] Tenant boundary is explicit when applicable.
- [ ] Input is validated at the appropriate boundary.
- [ ] Business logic is outside the transport/UI boundary.
- [ ] Database access has clear ownership.
- [ ] Required transaction boundaries are explicit.
- [ ] External provider objects do not leak into domain contracts.
- [ ] Expected failures have intentional error behavior.
- [ ] Sensitive data is not unnecessarily logged.
- [ ] Relevant invariant tests exist.
- [ ] Formatting/lint/typecheck pass.
- [ ] Documentation was updated first if product policy changed.

---

## 48. Review question

A reviewer or coding agent should be able to answer these questions from the change:

```text
What business behavior changed?
Which documented rules apply?
Where does the behavior live?
Why does that module own it?
How is it authorized?
What tenant owns the resource?
What persistence state changes?
What happens if part of the operation fails?
What external system is involved?
What tests prove the invariant?
```

If those answers are difficult to discover, the implementation is probably hiding too much responsibility.

---

## 49. Final rule

Architecture should make correct code easier to write.

Do not preserve an abstraction merely because this guide names it.

When the codebase demonstrates that a different structure is clearer, make an explicit architectural decision, update the relevant documentation, and then change the implementation.

The documentation should describe the architecture we intentionally operate—not become a fossilized template.
