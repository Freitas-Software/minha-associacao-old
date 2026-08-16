# Web guidance

## Stack

- TypeScript web app using TanStack Start/Router conventions.
- Use existing shared packages such as design tokens and form-core where they already cover the requirement.
- Biome is the lint/format authority.

## Implementation

- Follow the nearest existing route, loader, action, component, and data-flow patterns before introducing a new pattern.
- Keep routing decisions in TanStack Router conventions; do not introduce Next.js-style assumptions or APIs.
- Prefer shared design tokens/components over app-local copies when the behavior is genuinely shared.
- Keep feature-specific code local to the feature until reuse is demonstrated.
- Do not couple UI components directly to backend implementation details when an existing client/type boundary exists.
- Preserve accessibility, loading, error, and empty states when modifying user flows.

## Validation

- Use the existing package scripts from this workspace.
- Run the narrowest relevant typecheck/lint/test/build check first.
- For changes to a shared package, also validate the affected shared package and any directly impacted consumer.
