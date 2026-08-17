# Glossary

## Organization
The tenant boundary. The domain uses the generic term `Organization` even though the first supported legal category is a Brazilian private association.

## Association
The first enabled organization category. During initial rollout, onboarding accepts only CNPJs whose legal nature is validated as **Associação Privada**.

## User
A global domain identity. A user is not the same thing as an authentication account and does not belong to a single organization.

## Membership
The lifetime relationship between one user and one organization. A user may have at most one membership per organization, but may belong to many organizations.

## Role
An organization-defined position or permission group. Each membership has exactly one current role.

## Board role
A role with `isBoardRole = true`. This is an institutional/UI classification, not an authorization shortcut.

## Full-access role
A role with `isFullAccess = true`. It receives every configurable permission, but still obeys tenant boundaries, ownership rules, lifecycle state, and domain invariants.

## Default join role
The single active non-board, non-full-access role used as the safe default for ordinary global invitation onboarding.

## Provisioning
The temporary organization setup phase before the organization becomes operational.

## Provisioning access
A temporary restricted authorization relationship allowing the organization creator/setup operator to complete onboarding without becoming a member.

## Charge
A persisted financial obligation for a membership and a billing cycle.

## Payment
A financial settlement event that can be allocated to one or more charges.

## Delinquency
A financial interpretation calculated from overdue obligations and organization/role policy. It is separate from membership status and RBAC authorization.

## Forgiveness
An irreversible administrative cancellation of eligible charge components.

## Refund
A full or partial reversal of a previously recorded payment. For gateway payments, the gateway-confirmed result is authoritative.

## Barter
A generic non-cash economic settlement mechanism that produces value/credit which may be allocated to charges.

## PAA
A specialized source of barter/credit associated with a Programa de Aquisição de Alimentos project, official price table, deliveries, and delivery items.

## Audit log
Immutable historical evidence of who/what performed a meaningful domain action, when, and with relevant context. It does not replace current domain state.
