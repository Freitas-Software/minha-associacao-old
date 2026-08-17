# Shared packages guidance

Inherits repository-root `AGENTS.md`.

- Shared packages have wider blast radius; keep them platform-neutral unless their responsibility is explicitly platform-specific.
- Do not move domain-specific behavior into a shared package merely to reduce local files.
- Preserve public exports and workspace boundaries unless a deliberate breaking change is part of the plan.
- Do not weaken TypeScript/config strictness to silence a consumer problem.
- Draft proposed package changes; do not edit files by default.
