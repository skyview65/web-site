---
name: writing-plans
description: "Create clear, structured implementation plans before writing code. Use when the user asks to plan, design, spec, scope, or break down a feature, project, refactor, or task — or says 'make a plan', 'how should we approach this', 'write a design doc', or 'break this into steps'. Produces phased plans with goals, tasks, risks, and success criteria."
---

# Writing Plans

Turn a goal or feature request into a concrete, reviewable plan **before** implementation begins.

## When to use
- The user asks to "plan", "design", "spec out", "scope", or "break down" work.
- A task is large or ambiguous enough that jumping straight to code is risky.
- Before invoking the `execute` skill (which carries out an approved plan).

## Process

1. **Clarify the goal** — restate the objective in one sentence. List explicit requirements and any assumptions. Ask the user only about decisions you genuinely cannot resolve yourself.
2. **Survey the ground** — identify the files, modules, and existing patterns the change touches. Note constraints (stack, conventions, dependencies).
3. **Break into phases** — split the work into ordered phases, each with a clear outcome. Within a phase, list concrete tasks small enough to verify.
4. **Surface risks** — call out unknowns, edge cases, migration/compat concerns, and how you'll de-risk each.
5. **Define done** — state measurable success criteria and how each will be verified (tests, manual check, metric).

## Output format

```
# Plan: <title>

## Goal
<one-sentence objective>

## Requirements & assumptions
- ...

## Phases
### Phase 1 — <outcome>
- [ ] task
- [ ] task
### Phase 2 — <outcome>
- [ ] task

## Risks & mitigations
- <risk> → <mitigation>

## Success criteria
- [ ] <verifiable outcome>
```

## Principles
- Prefer the smallest plan that delivers the goal; avoid speculative scope.
- Make every task verifiable — if you can't tell when it's done, rewrite it.
- Keep the plan a living document; update it as reality diverges.
- Hand off to the `execute` skill once the user approves.
