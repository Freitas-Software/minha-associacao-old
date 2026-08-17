# Web guidance

Inherits repository-root `AGENTS.md`.

- Follow current TanStack routing/data-flow patterns.
- UI state is not authorization state.
- Never hide/disable controls as the sole enforcement of a permission.
- Do not infer business behavior from prototype screens when domain docs specify otherwise.
- Preserve loading, error, empty, and inaccessible states.
- For organization switching, ensure tenant identity is explicit in data requests/cache keys where required.
- Draft UI/components/routes for the user; do not edit files by default.
