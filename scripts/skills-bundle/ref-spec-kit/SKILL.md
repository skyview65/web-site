---
name: ref-spec-kit
description: Reference for GitHub Spec Kit — toolkit for Spec-Driven Development with AI agents (specify → plan → tasks → implement) via the `specify` CLI and slash commands. Use when structuring AI-assisted work around executable specs.
---
# Spec Kit (reference)
Process + CLI for Spec-Driven Development; generates spec/plan/task artifacts agents implement against.
- **Install:** `uvx --from git+https://github.com/github/spec-kit.git specify init <project>` (sets up commands for your agent).
- **Core flow:** `/constitution` → `/specify` (what/why) → `/plan` (stack) → `/tasks` → `/implement`.
- **Use when:** you want a disciplined spec-first loop instead of ad-hoc prompting.
