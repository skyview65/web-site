---
name: ref-tdd-guard
description: Reference for TDD Guard — enforces test-driven development for AI coding agents (Claude Code) by blocking edits that violate red-green-refactor. Use when you want to enforce test-first discipline on an agent.
---
# TDD Guard (reference)
Hook/guard that intercepts an agent's file edits and rejects changes lacking a failing test first.
- **Install:** `npm i -g tdd-guard`; wire it as a Claude Code hook (PreToolUse on Edit/Write) per the repo README; configure your test runner (vitest/jest/pytest reporters).
- **Core:** monitors test state; enforces write-test → see-fail → implement → pass.
- **Use when:** you want strict TDD guarantees on AI-generated code.
