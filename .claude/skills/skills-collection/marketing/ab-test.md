---
name: ab-test
description: Design and analyze A/B tests properly
tokens: ~350
cloud-ok: true
---

# A/B Test Setup
#claudeai

## When to Use
You want to test a change to see if it actually improves results.

## What I Need
- What are you testing? (page, email, ad, feature)
- What's your hypothesis?
- What metric matters?
- Current traffic/volume

## The Process

### 1. Form a Hypothesis
**Format:** "If we [change], then [metric] will [improve] because [reason]."

Bad: "Let's test a new headline"
Good: "If we change the headline to focus on time savings instead of features, conversion rate will increase because our user research shows time is the #1 pain point."

### 2. Calculate Sample Size
You need enough data for statistical significance.

**Quick rule:** 
- ~400 conversions per variation minimum
- At 5% conversion rate = 8,000 visitors per variation
- At 2% conversion rate = 20,000 visitors per variation

**Too low volume?** Test bigger changes or pick higher-traffic pages.

### 3. Design the Test

| Element | Control (A) | Variation (B) |
|---------|-------------|---------------|
| [What's different] | [Current] | [New] |

**Rules:**
- Test ONE thing at a time
- Make the change meaningful (not "blue vs slightly different blue")
- Don't peek at results early (wait for significance)

### 4. Run the Test
- Split traffic 50/50
- Run for at least 1-2 full business cycles (usually 2 weeks)
- Don't stop early even if it "looks like" a winner

### 5. Analyze Results

**Statistical significance:** Need 95% confidence minimum
**Practical significance:** Is the lift worth the effort?

```
## Test Results

**Hypothesis:** [Your hypothesis]
**Duration:** [X days]
**Sample size:** [n per variation]

| Metric | Control | Variation | Lift | Confidence |
|--------|---------|-----------|------|------------|
| [KPI] | X% | Y% | +Z% | XX% |

**Winner:** [A/B/Inconclusive]
**Decision:** [Implement / Iterate / Abandon]
**Learnings:** [What we learned]
```

## Test Ideas by Area

### Landing Pages
- Headline (benefit vs feature)
- CTA copy and color
- Social proof placement
- Form length
- Hero image

### Emails
- Subject line
- Send time
- CTA placement
- Personalization
- Length

### Pricing
- Price point
- Anchoring (show higher price first)
- Annual vs monthly framing
- Free trial length

## Common Mistakes
- Testing too many things at once
- Stopping test early ("it's obviously winning")
- Not having enough traffic
- Testing trivial changes
- No clear hypothesis

## Attribution
Framework adapted from Corey Haines' ab-test-setup skill (MIT License)
