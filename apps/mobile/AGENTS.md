# Mobile guidance

## Stack

- Expo + React Native + TypeScript.
- Routing uses Expo Router and file-based routes under the app's existing route tree.
- UI uses React Native Paper plus the repository's shared design tokens where applicable.

## Implementation

- Preserve Expo Router conventions; route structure and `_layout` files are architecture, not arbitrary folders.
- Inspect the current route tree before creating or moving screens.
- Do not duplicate route state in global state when the route itself can represent it cleanly.
- Prefer shared design tokens over hard-coded visual constants when a semantic token already exists.
- Reuse React Native Paper components and established variants before creating low-level replacements.
- Keep platform-specific code explicit and isolated.
- Do not invent production persistence, authentication, or API behavior from mocks; follow the currently implemented integration boundary.

## Validation

- Use the existing workspace scripts and Expo checks.
- Run scoped typecheck/lint/tests first.
- For routing/config/native changes, perform the relevant Expo validation/export/build check already defined by the repository instead of inventing a new command.
