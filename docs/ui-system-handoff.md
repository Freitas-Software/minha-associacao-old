# UI system implementation handoff

Last updated: 2026-07-18

## Current state

Development is intentionally paused after completing the native primitives milestone.

- Active branch: `feat/ui-native-primitives`
- Open pull request: [#12 — feat(ui-native): add foundational native primitives](https://github.com/Freitas-Software/minha-associacao/pull/12)
- Base branch: `main`
- PR state at pause: open, ready for review, with CI and CodeQL still running
- Commits in the milestone:
  - `23cb5a3 feat(ui-native): add foundational native primitives`
  - `0976b82 feat(mobile): integrate native UI primitives`

Do not begin another milestone until PR #12 has been reviewed and integrated into `main`.

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

## Architectural decisions

- Keep shared semantic contracts in `ui-core` and platform rendering in `ui-native`.
- Keep `ui-native` source-first so Metro compiles workspace TypeScript directly.
- Use React Native Paper as the native component foundation.
- Use workspace dependencies and the monorepo catalogs; do not introduce local version drift.
- Use TanStack Form for the future form foundation. Do not introduce React Hook Form or a parallel manual form abstraction.
- Follow one branch and one pull request per milestone.
- Expo mobile is Android/iOS only unless the product decision is explicitly changed later.

## Validation completed

The following checks passed before the pause:

- frozen lockfile installation;
- repository formatting and linting;
- TypeScript checks;
- all monorepo tests, including 7 `ui-native` tests and 4 mobile tests;
- generated-file checks and Turborepo dependency boundaries;
- full monorepo build;
- Expo Doctor: 20/20;
- Expo dependency compatibility check;
- Android production bundle export;
- iOS production bundle export.

Native simulators and physical devices were not available in this environment. Runtime visual and screen-reader validation on Android/iOS remains a review task.

## Resume procedure

When development resumes:

1. Check PR #12 and its CI/CodeQL results.
2. If a check failed or review feedback is actionable, fix only this milestone on `feat/ui-native-primitives`, rerun proportionate validation and update the same PR.
3. Confirm that PR #12 has been merged into `main`.
4. Update local `main` from `origin/main` and create the next milestone branch from the updated commit.
5. Start `feat/form-foundation` as the next milestone, using TanStack Form according to `Implementação Monorepo.pdf` and the UI system guide.
6. Keep the form foundation platform-neutral where specified; defer native adapters and screens to their dedicated milestone when the guide separates them.
7. Open only one PR, stop after it is ready for review and wait for merge confirmation before continuing.

## Files intentionally outside version control

The following source instruction files are present locally and must not be added to feature commits unless explicitly requested:

- `UI System Implementation Guide.pdf`
- `Implementação Monorepo.pdf`
