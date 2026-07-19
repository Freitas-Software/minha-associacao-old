# UI system implementation handoff

Last updated: 2026-07-19

## Current state

PR [#12 — feat(ui-native): add foundational native primitives](https://github.com/Freitas-Software/minha-associacao/pull/12) was integrated into `main` on 2026-07-19. The current milestone is the shared form foundation.

- Active branch: `feat/form-foundation`
- Base branch: `main`
- Base commit: `3ebd771` (merge of PR #12)
- Scope: shared TanStack Form contexts, error normalization, Standard Schema contract, tests and documentation
- Explicitly out of scope: MUI/Paper adapters, DOM/React Native events, product forms and rendered subscription measurements

Do not begin `feat/form-web` until the pull request for this milestone has been reviewed and integrated into `main`.

## Completed work

### Native UI package

Created the source-first workspace package `@minha-associacao/ui-native`, consumed directly by Metro. It includes:

- `AppButton` with semantic variants, sizes, loading and disabled states;
- `AppTextField` with helper, error and loading states plus TalkBack and VoiceOver announcements;
- `StatusChip` with semantic status mappings;
- `AppCard` and `AppCardSection`;
- `EmptyState` with primary and secondary actions;
- tests for button configuration and semantic status appearance.

A shared `@minha-associacao/ts-config/react-native-library` preset was also added for React Native workspace packages.

### Mobile integration

The Expo app now contains a native integration screen that exercises the shared primitives and design tokens without introducing a form framework or a temporary manual validation flow.

The app is explicitly mobile-only:

- supported platforms are `ios` and `android`;
- the mobile package has no direct `react-dom` or `react-native-web` dependency;
- the export script produces only `dist/android` and `dist/ios`;
- no Expo web configuration, static HTML or browser-specific UI was retained.

`expo-web-browser` remains installed because it is an Expo native module for opening browser sessions from Android/iOS; it does not enable a web build target.

### Shared form foundation

Created `@minha-associacao/form-core` with:

- a single TanStack Form field/form context pair shared by future web and native adapters;
- platform-neutral normalization for field, form and server error shapes;
- direct Zod 4 validation through Standard Schema without a resolver;
- headless lifecycle tests for defaults, change, blur, submit, submitting and reset;
- documented validation conventions and boundaries for `form-web` and `form-native`.

See [form-foundation.md](form-foundation.md) for the public contract and follow-up responsibilities.

## Architectural decisions

- Keep shared semantic contracts in `ui-core` and platform rendering in `ui-native`.
- Keep `ui-native` source-first so Metro compiles workspace TypeScript directly.
- Use React Native Paper as the native component foundation.
- Use workspace dependencies and the monorepo catalogs; do not introduce local version drift.
- Use TanStack Form `1.33.2` for shared React form state. Do not introduce React Hook Form or a parallel manual form abstraction.
- Pass Zod schemas directly through Standard Schema; do not add a resolver that duplicates native support.
- Keep base inputs independent from TanStack Form and bind shared contexts only in platform adapter packages.
- Keep `form-core` source-first so both Vite and Metro resolve the checked-in TypeScript entrypoint.
- Preserve global and per-field error ownership during normalization so adapters can build accessible summaries and focus flows.
- Follow one branch and one pull request per milestone.
- Expo mobile is Android/iOS only unless the product decision is explicitly changed later.

## Validation completed

The following checks passed for `feat/form-foundation`:

- frozen lockfile installation;
- repository formatting and linting;
- TypeScript checks;
- all 54 monorepo tests, including 24 `form-core` tests;
- full coverage task, with `form-core` at 100% statements/functions/lines and 96.20% branches;
- generated-file checks and Turborepo dependency boundaries;
- full monorepo build;
- Expo Doctor: 20/20;
- Expo dependency compatibility check;
- Android production bundle export;
- iOS production bundle export.

Native simulators and physical devices were not available in this environment. Runtime visual and screen-reader validation on Android/iOS remains a review task.

## Resume procedure

When development resumes:

1. Inspect the pull request for `feat/form-foundation` and its CI/CodeQL results.
2. If a check failed or review feedback is actionable, fix only this milestone on `feat/form-foundation`, rerun proportionate validation and update the same pull request.
3. Confirm that the pull request has been merged into `main`.
4. Update local `main` from `origin/main` and create the next milestone branch from the updated commit.
5. Prefer `feat/form-web` as the next milestone, binding the shared contexts to `ui-web` with current TanStack Form APIs.
6. Keep native adapters and screens for `feat/form-native`; do not combine both platforms into one pull request.
7. Open only one pull request, stop after it is ready for review and wait for merge confirmation before continuing.

## Files intentionally outside version control

The following source instruction files are present locally and must not be added to feature commits unless explicitly requested:

- `UI System Implementation Guide.pdf`
- `Implementação Monorepo.pdf`
