---
name: hypothesis-driven
description: Tunguz/scientific method - form hypotheses first, then test them
tokens: ~300
cloud-ok: true
---

# Hypothesis-Driven Thinking
#claudeai

## The Framework

Don't boil the ocean. Start with a hypothesis and test it.

**Without hypothesis:** "Let me analyze all the data and see what I find" (slow, unfocused)
**With hypothesis:** "I believe X is causing Y. Let me test that." (fast, focused)

This is how VCs like Tomasz Tunguz evaluate companies and how scientists make discoveries.

## How to Use

### Step 1: Form a hypothesis
"I believe [cause] is driving [effect] because [reasoning]."

### Step 2: Identify the test
What data or experiment would prove or disprove this?

### Step 3: Define success criteria
Before looking at data, define what would confirm or reject the hypothesis.

### Step 4: Test it
Gather the specific data needed. Don't get distracted.

### Step 5: Conclude and iterate
Confirmed? Act on it.
Rejected? Form a new hypothesis.
Unclear? Refine the test.

## The Hypothesis Format

**Structure:**
"I believe [X] because [reasoning]. If true, we should see [evidence]. If false, we should see [counter-evidence]."

**Example:**
"I believe churn is high because customers aren't reaching the 'aha moment' in onboarding. If true, we should see that churned users have lower feature activation in week 1. If false, churned and retained users should have similar activation."

## Output Format

```
## Hypothesis Test: [Topic]

**Hypothesis:**
I believe [cause] is driving [effect].

**Reasoning:**
[Why I think this is true]

**Test:**
[What data or experiment will test this]

**Success criteria (define BEFORE testing):**
- Confirmed if: [Specific evidence]
- Rejected if: [Specific counter-evidence]
- Inconclusive if: [What would leave it unclear]

**Results:**
[What you found]

**Conclusion:**
[CONFIRMED / REJECTED / INCONCLUSIVE]

**Next hypothesis (if rejected/inconclusive):**
[What to test next]

**Action (if confirmed):**
[What to do with this knowledge]
```

## Generating Good Hypotheses

**Sources:**
- Patterns in data
- Customer conversations
- Industry knowledge
- Analogies from other situations
- Contrarian thinking (what if conventional wisdom is wrong?)

**Good hypotheses are:**
- Specific (not vague)
- Falsifiable (can be proven wrong)
- Actionable (if true, you'd do something different)
- Based on some reasoning (not random)

## Multiple Hypotheses

Often you have several possible explanations. Rank them:

| Hypothesis | Likelihood | Impact if True | Test Effort | Test Order |
|------------|------------|----------------|-------------|------------|
| [H1] | High | High | Low | 1st |
| [H2] | Medium | High | Medium | 2nd |
| [H3] | Low | High | High | 3rd |

Test the most likely, highest-impact, easiest-to-test hypotheses first.

## The Anti-Pattern

**Confirmation bias:** Looking for evidence that supports your hypothesis while ignoring evidence against it.

**Fix:** Actively seek disconfirming evidence. Ask "what would prove me wrong?"

---

*"The great tragedy of science—the slaying of a beautiful hypothesis by an ugly fact."* — Thomas Huxley
