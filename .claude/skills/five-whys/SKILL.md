---
name: five-whys
description: Find root cause by asking why five times
tokens: ~250
cloud-ok: true
---

# Five Whys
#claudeai

## The Framework

When something goes wrong, ask "Why?" five times to find the root cause.

Surface problems are usually symptoms. The real cause is deeper.

## How to Use

### Step 1: State the problem
"[Thing] happened" or "[Thing] isn't working"

### Step 2: Ask "Why?" and answer
Repeat 5 times, each answer becoming the subject of the next why.

### Example

**Problem:** Our customer churn increased this month.

1. **Why?** → Customers complained about slow support response.
2. **Why were responses slow?** → Support team is overwhelmed with tickets.
3. **Why are there so many tickets?** → The new feature has a confusing UI.
4. **Why is the UI confusing?** → We didn't do user testing before launch.
5. **Why didn't we do user testing?** → We were rushing to hit a deadline.

**Root cause:** Unrealistic deadline pressure is causing us to skip quality steps, which creates downstream problems.

**Fix:** Address the planning/deadline issue, not just hire more support people.

## Output Format

```
## Five Whys: [Problem]

**Surface problem:** [What you're seeing]

1. Why? → [Answer 1]
2. Why? → [Answer 2]
3. Why? → [Answer 3]
4. Why? → [Answer 4]
5. Why? → [Answer 5]

**Root cause:** [The underlying issue]

**Fix at the root:**
[Action that addresses root cause, not symptom]
```

## Tips

**Go until you hit something actionable**
Sometimes it's 3 whys. Sometimes it's 7. Stop when you reach a cause you can actually fix.

**Watch for blame loops**
If every answer is "because [person] messed up," you're not finding systemic causes.

**Multiple branches**
Sometimes there are multiple valid answers to "why." Follow the most important branch, then come back.

**Don't stop at the first reasonable answer**
The first why usually reveals a symptom, not a cause. Keep going.

## Root Cause Categories

Often the root cause falls into:
- **Process:** Missing or broken process
- **Training:** People don't know how
- **Resources:** Not enough time/people/tools
- **Incentives:** People are rewarded for wrong thing
- **Communication:** Information didn't flow
- **Culture:** "How we do things" is broken

---

*"If you don't ask the right questions, you don't get the right answers."* — Edward Hodnett
