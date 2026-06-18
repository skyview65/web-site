---
name: future-dev
description: "Forward-looking development planning. Use when the user asks 'what's next', 'roadmap', 'future improvements', 'where could this go', 'tech debt', 'how do we scale this', or wants to brainstorm next features and iterations. Produces prioritized, forward-looking recommendations grounded in the current codebase."
---

# Future Dev

Look beyond the current task: propose where the project should go next.

## When to use
- The user asks for a roadmap, "what's next", future features, or long-term direction.
- After shipping something, to plan the next iteration.
- To audit tech debt, scalability, or maintainability and turn it into actionable items.

## Process

1. **Understand the present** — briefly map what exists today: core features, architecture, and obvious gaps. Ground everything in the actual codebase, not generic advice.
2. **Generate directions** across these lenses:
   - **Features** — natural next capabilities users will want.
   - **Quality** — tech debt, refactors, test coverage, reliability.
   - **Scale & performance** — bottlenecks that appear with growth.
   - **DX & tooling** — what would speed up future work.
   - **Security & compliance** — risks worth addressing early.
3. **Prioritize** — score each idea by impact vs effort; flag quick wins and high-leverage bets.
4. **Make it actionable** — for the top items, sketch a one-line approach and rough size (S/M/L).

## Output format

```
# Future Dev: <project>

## Where we are
<2-3 lines>

## Recommendations (prioritized)
| Idea | Lens | Impact | Effort | Notes |
|------|------|--------|--------|-------|
| ...  | ...  | High   | S      | ...   |

## Quick wins
- ...

## Bigger bets
- ...
```

## Principles
- Tie every suggestion to something concrete in the repo.
- Separate "should do soon" from "nice someday" — don't flatten priorities.
- Prefer reversible, incremental steps over big-bang rewrites.
