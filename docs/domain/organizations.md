# Organizations

## Identity

`ORG-001` An organization has a stable internal ID.

`ORG-002` CNPJ is mandatory for the initial supported organization category.

`ORG-003` The same CNPJ cannot register more than one organization.

`ORG-004` Initial onboarding must validate the CNPJ through an external authoritative/business registry API.

`ORG-005` Initial onboarding accepts only a CNPJ whose returned legal nature is an enabled private-association classification. Cooperatives are not enabled in the first version.

`ORG-006` The organization's official/legal name is populated from the CNPJ lookup and is not a free-form onboarding field.

`ORG-007` The initial abbreviation/sigla is derived from the returned trade name (`nome fantasia`) when available, but the sigla may be edited by the setup operator.

`ORG-008` No business rule currently requires sigla/abbreviation to be globally unique. Do not infer that requirement from the current schema.

## Creator semantics

`ORG-009` Creating an organization does not automatically make the creator a founder, president, board member, member, administrator, or full-access user.

`ORG-010` The creator may be an external consultant or any other setup operator.

`ORG-011` A creator who is not a member uses temporary provisioning access only.

## Provisioning lifecycle

`ORG-012` Every new organization starts in a `PROVISIONING` domain state.

Provisioning is a sequential setup flow:

### Step 1 — Institutional data

`ORG-013` CNPJ validation must succeed before onboarding continues.

`ORG-014` Statute (`STATUTE`) is mandatory.

`ORG-015` Current election/appointment record (`ELECTION_RECORD`) is mandatory.

### Step 2 — Roles

`ORG-016` Organization roles are configured before the board is populated.

`ORG-017` Role setup must satisfy all role invariants, including exactly one eligible default join role and at least one active role marked `isFullAccess`.

### Step 3 — Board setup

`ORG-018` Board setup uses roles marked `isBoardRole`.

`ORG-019` Board people may already have a domain user or may be pre-registered/invited by CPF.

`ORG-020` Before provisioning can complete, every configured active board role must be represented in the board setup by at least one intended occupant, either through an active membership or a pending valid individual invitation.

`ORG-020A` Board setup may therefore create individual invitations for people who have not yet accepted.

## Becoming operational

`ORG-021` An organization may become `OPERATIONAL` only after steps 1–3 are configured.

`ORG-022` At least one **active membership assigned to an active `isFullAccess` role** must exist before the organization becomes operational.

`ORG-023` It is not necessary for every board invitation to have been accepted before becoming operational.

`ORG-024` Pending board invitations may remain after activation as long as `ORG-022` is satisfied.

`ORG-025` Provisioning authority ends when the organization becomes operational.

## Continuity

`ORG-026` An operational organization must never be left with zero active memberships that have full access.

`ORG-027` If an operation would remove the last active full-access member, the operation must be blocked until a successor is active.

`ORG-028` A successor may initially be invited by CPF. The existing full-access member remains active until the successor accepts and becomes an active full-access member.

`ORG-029` Acceptance of a valid individual invitation to a full-access role is sufficient to activate that authority; no additional approval is required.

## Deactivation and history

`ORG-030` Organizations are not physically deleted by ordinary application flows.

`ORG-031` An organization may become inactive while preserving historical institutional, membership, financial, document, and audit records.

`ORG-032` Platform administration may need visibility into inactive organizations and their history.

## Legal/statutory precedence

`ORG-033` Product configuration must not be used to bypass applicable law, the organization's statute, or another valid institutional rule when those sources impose a mandatory requirement.
