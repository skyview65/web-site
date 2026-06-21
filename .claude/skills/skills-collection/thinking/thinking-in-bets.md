---
name: thinking-in-bets
description: Annie Duke's framework - think in probabilities, not certainties
tokens: ~300
cloud-ok: true
---

# Thinking in Bets
#claudeai

## The Framework

Every decision is a bet on an uncertain future. Treat it that way.

Instead of: "This will work" or "This won't work"
Think: "This has a 70% chance of working"

**Why it matters:**
- Good decisions can have bad outcomes (bad luck)
- Bad decisions can have good outcomes (good luck)
- Judging decisions by outcomes alone leads to wrong lessons

## How to Use

### Step 1: Assign probabilities
"I'm X% confident this will work"

Force yourself to put a number on it. Even rough numbers beat false certainty.

### Step 2: Consider the range of outcomes
Not just "success" or "failure" but the full range of possible results.

### Step 3: Evaluate expected value
Probability × Outcome for each scenario.

### Step 4: After the fact, separate decision quality from outcome
- Good decision + bad outcome = Bad luck (don't change the process)
- Bad decision + good outcome = Good luck (don't repeat the process)

## The Expected Value Calculation

```
Option A:
- 70% chance of $100k gain = $70k expected
- 30% chance of $50k loss = -$15k expected
- Expected value: +$55k

Option B:
- 90% chance of $30k gain = $27k expected
- 10% chance of $10k loss = -$1k expected
- Expected value: +$26k

Option A is better despite higher risk.
```

## Output Format

```
## Thinking in Bets: [Decision]

**The bet:** [What you're deciding]

**Possible outcomes:**

| Outcome | Probability | Impact | Expected Value |
|---------|-------------|--------|----------------|
| [Best case] | X% | +$Y | +$Z |
| [Base case] | X% | +$Y | +$Z |
| [Worst case] | X% | -$Y | -$Z |

**Total expected value:** [Sum]

**Confidence check:**
How confident am I in these probabilities? [High/Medium/Low]
What would change my estimates?

**The bet I'm making:**
"I'm betting X% that [outcome] because [reasoning]"

**Pre-commitment:**
If [outcome], I will conclude [lesson] about my decision process.
```

## Resulting vs. Process

**Resulting:** Judging decision quality by outcome
- "It worked, so it was a good decision" ❌
- "It failed, so it was a bad decision" ❌

**Process thinking:** Judging decision quality by process
- "I made the best decision with available information" ✓
- "The outcome doesn't change whether the process was good" ✓

## Calibration

Track your predictions over time:
- When you say 70%, are you right ~70% of the time?
- Most people are overconfident
- Tracking builds calibration

## The Poker Mindset

In poker, you can play perfectly and lose. You can play terribly and win.

One hand means nothing. The process over thousands of hands is everything.

Your startup decisions are the same. Don't overreact to individual outcomes.

---

*"What makes a decision great is not that it has a great outcome. A great decision is the result of a good process."* — Annie Duke
