---
name: metrics-setup
description: Figure out what to track and how to set up simple dashboards
tokens: ~400
cloud-ok: true
---

# Metrics Setup
#claudeai

## When to Use
You need to figure out what metrics to track, or you're drowning in data and can't find the signal.

## What I Need
- What stage are you? (pre-revenue, early revenue, scaling)
- What's your business model? (SaaS, marketplace, services, etc.)
- What decisions are you trying to make?

## The Core Principle

**Only track metrics that change decisions.**

If a number going up or down wouldn't change what you do, don't track it.

## Stage-Appropriate Metrics

### Pre-Revenue / Pre-PMF
Track only:
- **Engagement:** Are users coming back? (DAU/WAU, retention)
- **Value signal:** Are users getting to the "aha moment"?
- **Qualitative:** What are users saying? (NPS, interviews)

Don't track: Revenue metrics (you don't have product-market fit yet)

### Early Revenue (<$10k MRR)
Track:
- **MRR** and MoM growth
- **Churn rate** (monthly)
- **Conversion rate** (trial → paid or lead → customer)
- **Qualitative:** Why do people buy? Why do they churn?

Don't track: CAC/LTV ratios yet (too noisy with small numbers)

### Scaling ($10k+ MRR)
Add:
- **CAC** by channel
- **LTV** (or proxy: monthly churn × average revenue)
- **LTV:CAC ratio** (target: 3:1 or better)
- **Payback period** (target: <12 months)
- **Net Revenue Retention** (target: >100%)

## The One-Page Dashboard

You need exactly ONE dashboard with these sections:

```
## [Company] Metrics Dashboard

### North Star
[The ONE metric that matters most right now]
Current: ___ | Target: ___ | Trend: ↑↓→

### Health Metrics (check weekly)
| Metric | This Week | Last Week | Trend |
|--------|-----------|-----------|-------|
| MRR | $X | $Y | ↑↓ |
| Active Users | X | Y | ↑↓ |
| Churn | X% | Y% | ↑↓ |
| NPS/CSAT | X | Y | ↑↓ |

### Growth Metrics (check monthly)
| Metric | This Month | Last Month | Target |
|--------|------------|------------|--------|
| New Customers | X | Y | Z |
| Revenue Growth | X% | Y% | Z% |
| CAC | $X | $Y | $Z |
| Conversion Rate | X% | Y% | Z% |

### Watchlist
[Metrics you're monitoring but not optimizing yet]
```

## Quick Setup Guide

**Cheapest path to a dashboard:**
1. Google Sheets + manual weekly update (seriously, start here)
2. Spreadsheet + Zapier to auto-pull from Stripe/Mixpanel
3. Metabase/Looker Studio when you have time to set up properly

Don't buy expensive BI tools until you know what you're measuring.

## Output Format

```
## Recommended Metrics: [Company]

**Stage:** [Your stage]
**North Star:** [The one metric]

**Track Weekly:**
1. [Metric] - Source: [where to get it]
2. [Metric] - Source: [where to get it]
3. [Metric] - Source: [where to get it]

**Track Monthly:**
1. [Metric] - Source: [where to get it]
2. [Metric] - Source: [where to get it]

**Ignore For Now:**
- [Metric] - Why: [not relevant yet]

**Dashboard Setup:**
[Recommended tool + setup steps]
```

## Anti-Patterns
- Tracking 50 metrics (you'll look at none)
- Vanity metrics: pageviews, followers, downloads (meaningless alone)
- Measuring before you can act (data for data's sake)
- Waiting for perfect data (good enough > perfect)
