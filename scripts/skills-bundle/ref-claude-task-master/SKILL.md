---
name: ref-claude-task-master
description: Reference for Task Master (claude-task-master) — AI task-management system that parses a PRD into structured, dependency-aware tasks for AI coding workflows. Use for breaking specs into trackable tasks; runs as a CLI and an MCP server.
---
# Task Master (reference)
Turns a PRD into ordered, dependency-aware tasks and drives AI coding agents through them.
- **Install:** `npm i -g task-master-ai`; init with `task-master init`. Also exposes an MCP server (`task-master-ai`) for editors/Claude.
- **Core:** `task-master parse-prd <file>` → tasks; `task-master next` / `list` / `expand`. Configure model providers via env keys.
- **Use when:** large features that benefit from explicit task decomposition and progress tracking.
