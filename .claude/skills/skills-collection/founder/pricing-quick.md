---
name: pricing-quick
description: Make pricing decisions without overthinking
tokens: ~400
cloud-ok: true
---

# Pricing Quick
#claudeai

## When to Use
You need to price something - new product, new tier, custom deal - and don't have time for deep analysis.

## What I Need
- What are you pricing?
- Who's the buyer?
- Any existing reference points? (competitors, current pricing)

## The Fast Framework

### 1. Anchor to Value, Not Cost

**Wrong question:** "What does it cost us to deliver?"
**Right question:** "What is this worth to the customer?"

Value signals:
- Time saved: [hours/week] × [hourly rate] = value floor
- Revenue generated: [expected lift] × [their revenue] = value ceiling
- Cost avoided: [what they'd pay otherwise]

### 2. Quick Pricing Models

| Model | Best For | Example |
|-------|----------|---------|
| **Flat rate** | Simple product, clear scope | $99/month |
| **Per seat** | Tools used by teams | $20/user/month |
| **Usage-based** | Variable consumption | $0.01/API call |
| **Tiered** | Different customer sizes | Starter/Pro/Enterprise |
| **Value-based** | High-touch, custom | % of revenue or savings |

### 3. The 10x Rule

Price should be ≤10% of the value delivered.
- If you save them $10k/month → can charge $1k/month
- If you generate $50k in revenue → can charge $5k

If you can't articulate 10x value, you have a positioning problem, not a pricing problem.

### 4. Quick Gut Checks

- **Too cheap:** Customers don't ask about price at all
- **Too expensive:** >50% push back hard on price
- **About right:** ~20-30% negotiate, rest accept
- **Leaving money:** Enterprise wants to pay more for support/SLA

## For Custom Deals

### Discovery Questions
1. What's your budget for this? (they often tell you)
2. What are you paying for [alternative] now?
3. What would solving this be worth to you?

### Anchoring
Always let them anchor first if possible.
If you must anchor, start high - you can always come down.

### Quick Quote Structure
```
**Option A (Recommended):** $X
Includes: [everything they need]

**Option B:** $Y (lower)
Includes: [reduced scope]
Doesn't include: [what they'd miss]
```

Give them two options. Option A should be obvious choice.

## Output Format

```
## Pricing Recommendation: [Product/Deal]

**Buyer:** [Who]
**Value delivered:** [Quantified if possible]

**Recommended price:** $X [model: flat/seat/usage]

**Reasoning:** 
- Value anchor: [calculation]
- Competitive reference: [if any]
- Gut check: [too high/low/right]

**Positioning:** [How to present this]

**Negotiation floor:** $Y (don't go below)
```

## Common Mistakes
- Pricing based on competitor (you might both be wrong)
- Underpricing to "win" customers (attracts wrong customers)
- Same price for all segments (enterprise can pay more)
- Not raising prices annually (you should)
