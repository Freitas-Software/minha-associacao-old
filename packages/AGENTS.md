# Shared packages guidance

## Scope

Current shared packages include configuration, design tokens, form-core, and shared TypeScript configuration. Changes here can affect multiple apps.

## Rules

- Keep a shared package focused on its declared responsibility.
- Do not move app-specific behavior into a shared package merely to avoid a local file.
- Preserve package public exports and `workspace:*` boundaries unless a breaking change is explicitly required.
- Prefer platform-neutral code in shared packages; isolate web/mobile-specific implementations when necessary.
- For design tokens, expose semantic tokens instead of duplicating raw values in consumers.
- For TypeScript/config packages, avoid relaxing strictness to silence a local error; fix the consumer unless the repository policy itself is intentionally changing.

## Validation

- Validate the changed package first.
- Then validate every directly affected consumer app/package.
- Review the diff for accidental generated output or unrelated lockfile churn.
