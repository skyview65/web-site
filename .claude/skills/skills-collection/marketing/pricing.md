---
name: pricing
description: Design pricing strategy - tiers, packaging, positioning
tokens: ~400
cloud-ok: true
---

# Pricing Strategy
#claudeai

## When to Use
Designing pricing from scratch, restructuring tiers, or evaluating if current pricing is right.

## What I Need
- What's the product/service?
- Who are the customer segments?
- Current pricing (if any)
- Competitors' pricing (if known)

## Pricing Principles

### 1. Value-Based, Not Cost-Based
Price based on value to customer, not your costs.
Your costs are a floor, not the price.

### 2. The 10x Rule
Customers should get 10x value vs what they pay.
If your tool saves $10k/month, you can charge $1k/month.

### 3. Segment by Willingness to Pay
Different customers will pay different amounts.
Don't leave money on the table with one-size-fits-all.

## Pricing Models

| Model | Best For | Example |
|-------|----------|---------|
| Flat rate | Simple product, clear value | $99/month |
| Per seat | Team tools | $20/user/month |
| Usage-based | Variable consumption | $0.01/API call |
| Tiered | Different customer sizes | Starter/Pro/Enterprise |
| Freemium | Growth through free users | Free + paid upgrade |

## Tier Design (3-Tier Framework)

### Tier 1: Entry / Starter
- **Purpose:** Get people in the door
- **Price:** Low enough to be impulse
- **Features:** Core value, limited scale
- **Target:** Small users, try-before-buy

### Tier 2: Growth / Pro (Most Popular)
- **Purpose:** Where most customers land
- **Price:** Sweet spot for target customer
- **Features:** Full product, reasonable limits
- **Target:** Your ICP
- **Highlight this tier** (most common choice)

### Tier 3: Scale / Enterprise
- **Purpose:** Capture high willingness to pay
- **Price:** 3-5x mid-tier (or "Contact us")
- **Features:** Everything + premium support, compliance
- **Target:** Larger companies with budget

## Feature Gating Strategy

| Gate By | Example | Good For |
|---------|---------|----------|
| Usage limits | 1k/10k/unlimited records | Clear value scaling |
| Features | Basic/advanced reports | Natural segmentation |
| Seats | 1/5/unlimited users | Team-based products |
| Support | Email/priority/dedicated | Enterprise extraction |

## Pricing Page Best Practices

- Show 3 options (4 max)
- Highlight recommended tier
- Annual discount: 15-20% (not more)
- Show monthly price even for annual
- Include social proof per tier
- FAQ to handle objections

## Common Mistakes

- **Too cheap:** Attracts wrong customers, hard to raise later
- **Too complex:** Confusion = no purchase
- **No enterprise tier:** Leaving money on table
- **Free tier too generous:** No reason to upgrade
- **Discounting too much:** Trains customers to wait

## Output Format

```
## Pricing Recommendation: [Product]

**Model:** [Flat/Per seat/Usage/Tiered]

**Tier Structure:**

| | Starter | Pro | Enterprise |
|---|---------|-----|------------|
| Price | $X/mo | $Y/mo | Custom |
| [Feature 1] | ✓ / limit | ✓ | ✓ |
| [Feature 2] | ✗ | ✓ | ✓ |
| [Feature 3] | ✗ | ✗ | ✓ |
| Support | Email | Priority | Dedicated |

**Positioning:**
- Starter: [Who it's for]
- Pro: [Who it's for] ← Most will choose this
- Enterprise: [Who it's for]

**Annual discount:** X%

**Rationale:** [Why this structure]
```

## Attribution
Framework adapted from Corey Haines' pricing-strategy skill (MIT License)
