---
name: premortem
description: Imagine the project failed - why? Find and prevent failure modes before they happen.
tokens: ~250
cloud-ok: true
---

# Premortem
#claudeai

## The Framework

**Before starting, imagine the project has failed spectacularly. Now ask: why did it fail?**

This is a premortem - like a postmortem, but before the disaster happens.

It's easier to prevent failure than to conduct an autopsy.

## How to Use

### Step 1: Set the scene
"It's [date in future]. This project has failed completely."

### Step 2: Ask the team (or yourself)
"What went wrong? Why did it fail?"

### Step 3: List every failure mode
No filter. Write down every way it could have failed.

### Step 4: Prioritize the risks
Which failures are most likely? Most catastrophic?

### Step 5: Prevent or mitigate
For the top risks, what can you do NOW to prevent them?

## Output Format

```
## Premortem: [Project/Decision]

**The scenario:** 
It's [future date]. [Project] has failed. What happened?

**Failure modes brainstorm:**
1. [Way it failed]
2. [Way it failed]
3. [Way it failed]
4. [Way it failed]
5. [Way it failed]

**Prioritized risks:**

| Risk | Likelihood | Impact | Priority |
|------|------------|--------|----------|
| [Risk] | H/M/L | H/M/L | [1-5] |
| [Risk] | H/M/L | H/M/L | [1-5] |
| [Risk] | H/M/L | H/M/L | [1-5] |

**Prevention plan:**

| Risk | Prevention | Owner |
|------|------------|-------|
| [Top risk] | [What we'll do] | [Who] |
| [Risk #2] | [What we'll do] | [Who] |
| [Risk #3] | [What we'll do] | [Who] |

**Early warning signs:**
- [Signal that risk is materializing]
- [Signal that risk is materializing]

**Kill criteria:**
If [condition], we stop/pivot.
```

## Why It Works

- **Overcomes optimism bias:** We naturally focus on how things will go right
- **Creates permission to criticize:** "Imagine it failed" is safer than "tell me what's wrong with my plan"
- **Surfaces hidden concerns:** People often have doubts they don't voice
- **Turns anxiety into action:** Vague worry becomes concrete mitigation

## Common Failure Modes

**Startups:**
- Ran out of money
- Built wrong thing
- Key person left
- Market shifted
- Couldn't sell it
- Execution too slow

**Projects:**
- Scope creep
- Dependencies failed
- Wrong assumptions
- Stakeholder conflict
- Resource pulled
- Timeline unrealistic

## When to Use

- Before starting any significant project
- Before making a big bet
- At the start of a new quarter
- When something feels risky but you're not sure why

---

*"The best time to fix the roof is when the sun is shining."* — John F. Kennedy
