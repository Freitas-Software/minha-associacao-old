# Authentication and Identity Architecture

## Domain vs authentication account

The authentication provider account and the domain `User` are separate concepts.

A robust integration should make the mapping explicit:

```text
authentication identity/session
    -> stable link
domain User
    -> CPF and profile
    -> memberships
```

## CPF login

The product intends CPF to be the familiar login identifier.

Email is optional in the domain. Therefore:

- do not make email mandatory merely because an auth library defaults to email;
- do not leak provider account IDs into domain relationships as the business identity;
- do not use CPF as the database primary key;
- keep CPF correction possible without replacing the domain user.

## Better Auth

Better Auth is an implementation choice, not a source of business policy.

If the selected Better Auth configuration cannot satisfy the required CPF-login / optional-email model cleanly, the integration must be adapted or reconsidered. Do not silently change `USR-011` to satisfy a plugin schema.

## Session semantics

A valid session proves who the caller is.

A session does **not** permanently prove:

- current membership is active;
- current role;
- current permissions;
- current organization authorization;
- current delinquency/card state.

Those facts can change while the session remains valid and must be checked at the appropriate request boundary.

## No-membership users

A user may authenticate with:

- no memberships;
- only inactive memberships;
- multiple active memberships.

The application must support the global account independent of tenant membership.

An inactive former member may use the narrow billing self-service path defined by `MBR-035`–`MBR-038`.
