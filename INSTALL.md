# Codex guidance install

This package is intentionally separate from `docs/`.

Copy the paths you want into the repository root:

```text
AGENTS.md
apps/api/AGENTS.md
apps/web/AGENTS.md
apps/mobile/AGENTS.md
packages/AGENTS.md

.codex/agents/domain-analyst.toml
.codex/agents/implementation-planner.toml
.codex/agents/code-reviewer.toml

.agents/skills/domain-change-analysis/SKILL.md
.agents/skills/authorization-review/SKILL.md
.agents/skills/schema-domain-drift/SKILL.md
```

The agent files use `sandbox_mode = "read-only"` because the intended operating model is:

> Codex is the project's eyes and brain. It inspects, reasons, plans, reviews, and drafts code; the human writes/applies changes.

The root `AGENTS.md` is kept relatively short because it is always-on guidance. Detailed repeatable workflows are skills so they are loaded only when relevant.
