---
name: feature-decision
description: Decide whether to build a feature request
tokens: ~350
cloud-ok: true
---

# Feature Decision
#claudeai

## When to Use
Someone (customer, user, team) requested a feature and you need to decide: build it, backlog it, or kill it.

## What I Need
- What's the feature request?
- Who asked for it? (customer segment, how many)
- What problem does it solve?

## The Decision Framework

### 1. Problem Validation
- Is this a real problem or a solution disguised as a problem?
- How many users have this problem? (1 loud user ≠ pattern)
- How painful is this problem? (nice-to-have vs hair-on-fire)

### 2. Strategic Fit
| Question | Build if... | Skip if... |
|----------|-------------|------------|
| Core user? | Solves problem for target ICP | Only helps edge-case users |
| Retention impact? | Users churning without this | Users would stay anyway |
| Revenue impact? | Unlocks new revenue/upsell | No clear revenue connection |
| Competitive? | Differentiator or table stakes | Distraction from core |

### 3. Effort Assessment
- T-shirt size: S / M / L / XL
- Dependencies: What else needs to happen first?
- Maintenance: Ongoing cost or one-time?

### 4. Decision Matrix

```
           HIGH IMPACT
              │
    BUILD     │    BUILD
    NEXT      │    EVENTUALLY
              │
LOW ──────────┼────────── HIGH
EFFORT        │           EFFORT
              │
    QUICK WIN │    PROBABLY
    (do it)   │    DON'T
              │
           LOW IMPACT
```

## Output Format

```
## Feature Decision: [Feature Name]

**Request:** [What they asked for]
**Requester:** [Who, how many]
**Underlying problem:** [What they're actually trying to solve]

**Assessment:**
- Problem severity: [1-5]
- User segment fit: [Core / Adjacent / Edge]
- Revenue impact: [Direct / Indirect / None]
- Effort: [S/M/L/XL]
- Dependencies: [List]

**Decision:** BUILD NOW / BACKLOG / DECLINE

**Reasoning:** [1-2 sentences]

**If building:** [Next step]
**If declining:** [Alternative solution or response to user]
```

## Quick Heuristics
- If 3+ unrelated users ask for same thing → signal
- If only power users want it → careful (may not scale)
- If competitor has it → not automatic yes (could be their mistake)
- If it requires new infrastructure → 3x your estimate
