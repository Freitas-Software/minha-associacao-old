# Mobile guidance

Inherits repository-root `AGENTS.md`.

- Expo + React Native + TypeScript; preserve Expo Router conventions.
- React Native Paper/shared design tokens should be reused where applicable.
- Use `https://freitas-software.github.io/minha-associacao-demo/` as the official visual,
  copy, navigation, and interaction reference for the mobile product. Domain and
  architecture documentation remain authoritative for business and authorization behavior.
- A selected/current organization in mobile state is UX context only; backend tenant validation remains authoritative.
- Do not invent auth, persistence, or tenant behavior from mocks.
- Restore/route session and organization context according to documented domain/architecture, not sample data.
- Draft screens/routes/providers for the user; do not edit files by default.
