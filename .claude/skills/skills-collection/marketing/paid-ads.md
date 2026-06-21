---
name: paid-ads
description: Create and optimize paid ad campaigns - Google, Meta, LinkedIn
tokens: ~450
cloud-ok: true
---

# Paid Ads
#claudeai

## When to Use
Setting up or improving paid advertising on Google, Meta (Facebook/Instagram), or LinkedIn.

## What I Need
- Platform (Google, Meta, LinkedIn)
- Goal (leads, sales, awareness)
- Budget (daily or monthly)
- Target audience

## Platform Selection

| Goal | Best Platform | Why |
|------|---------------|-----|
| High-intent leads | Google Search | They're actively looking |
| B2B decision makers | LinkedIn | Best targeting for titles/companies |
| Broad awareness | Meta | Cheapest reach |
| Retargeting | Meta | Best pixel/audience tools |
| Local business | Google | Maps + local intent |

## Google Ads Quick Setup

### Search Campaign Structure
```
Campaign: [Product/Service]
├── Ad Group: [Keyword Theme 1]
│   ├── Keywords: [3-5 related keywords]
│   └── Ads: [2-3 ad variations]
├── Ad Group: [Keyword Theme 2]
│   ├── Keywords: [3-5 related keywords]
│   └── Ads: [2-3 ad variations]
```

### Ad Copy Formula
**Headline 1:** [Keyword + Benefit]
**Headline 2:** [Proof/Specificity]
**Headline 3:** [CTA]
**Description:** [Expand benefit + overcome objection + CTA]

### Key Settings
- Match types: Start with phrase match, add exact for winners
- Negative keywords: Add from day 1
- Bidding: Start with Maximize Clicks, switch to Target CPA once you have conversions

## Meta Ads Quick Setup

### Campaign Structure
```
Campaign: [Objective]
├── Ad Set: [Audience 1]
│   └── Ads: [3-5 creative variations]
├── Ad Set: [Audience 2]
│   └── Ads: [3-5 creative variations]
```

### Creative Formula
**Hook (first 3 seconds):** Pattern interrupt or bold claim
**Body:** Problem → Solution → Proof
**CTA:** Clear action + reason to act now

### Audiences to Test
1. Lookalike of customers (1%)
2. Interest-based (competitors, related topics)
3. Retargeting (site visitors, engaged)

## LinkedIn Ads Quick Setup

### Best Performing Formats
1. Single image ads (thought leadership style)
2. Document ads (carousel/PDF)
3. Message ads (for high-value targets only)

### Targeting Stack
- Job titles + Company size + Industry
- Keep audience 50k-500k for testing

## Optimization Checklist

### Weekly
- [ ] Check search terms (Google) - add negatives
- [ ] Pause ads with CTR <1%
- [ ] Pause audiences with high CPA
- [ ] Test new ad variations

### Monthly
- [ ] Review budget allocation by campaign
- [ ] Refresh creative (fatigue sets in ~4-6 weeks)
- [ ] Expand or contract audiences based on data

## Key Metrics

| Metric | Good | Investigate |
|--------|------|-------------|
| CTR (Search) | >3% | <1.5% |
| CTR (Display/Social) | >0.5% | <0.2% |
| Conversion Rate | >3% | <1% |
| CPA | <1/3 LTV | >1/2 LTV |

## Output Format

```
## Ad Campaign: [Name]

**Platform:** [Google/Meta/LinkedIn]
**Objective:** [Goal]
**Budget:** [Amount/period]

**Targeting:**
[Audience definition]

**Ad Copy:**
[Headlines/body/CTA]

**Creative Direction:**
[Image/video guidance]

**Success Metrics:**
- Target CPA: $X
- Target ROAS: X:1

**Test Plan:**
1. [Variation to test]
2. [Variation to test]
```

## Attribution
Framework adapted from Corey Haines' paid-ads skill (MIT License)
