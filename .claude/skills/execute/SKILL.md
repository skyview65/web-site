---
name: execute
description: "Carry out an approved plan step by step with discipline. Use when the user says 'execute', 'implement the plan', 'start building', 'do it', or 'work through the tasks' — especially after a plan from the writing-plans skill. Works task-by-task, verifies each step, tracks progress, and reports outcomes honestly."
---

# Execute

Implement an approved plan one verifiable step at a time.

## When to use
- A plan exists (from `writing-plans` or supplied by the user) and is approved.
- The user asks to implement, build, carry out, or "just do it".

## Process

1. **Load the plan** — restate the current phase and the next task. If no plan exists, create a brief one first (or invoke the `writing-plans` skill).
2. **One task at a time** — implement the smallest next step. Match surrounding code style and conventions.
3. **Verify before moving on** — run the relevant test/lint/build or do a manual check. Do not mark a task done until it actually passes.
4. **Track progress** — keep a visible checklist; tick items only when verified. Note any deviation from the plan and why.
5. **Report honestly** — if a step fails, say so with the actual output. If you skipped or stubbed something, state it. Never claim success you haven't verified.

## Guardrails
- Confirm before destructive or hard-to-reverse actions unless already authorized.
- Keep changes scoped to the current task; resist unrelated edits.
- If the plan turns out wrong mid-flight, stop and revise it rather than forcing through.
- Commit/push only when asked; branch first if on the default branch.

## Done
All tasks verified, success criteria met, plus a short summary of what changed and how it was checked.
