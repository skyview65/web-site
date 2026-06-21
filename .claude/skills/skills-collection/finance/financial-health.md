---
name: financial-health
description: Quick health check on your startup's finances
tokens: ~350
cloud-ok: true
---

# Financial Health Check
#claudeai

## When to Use
You want a quick read on whether your finances are in good shape or need attention.

## What I Need
- MRR/ARR (or revenue)
- Monthly expenses
- Cash in bank
- Growth rate (MoM)
- Churn rate (if SaaS)

## The Health Scorecard

### 1. Runway Health
| Months | Status |
|--------|--------|
| 18+ | 🟢 Healthy |
| 12-18 | 🟡 Watch |
| 6-12 | 🟠 Concern |
| <6 | 🔴 Critical |

### 2. Growth Health (MoM Revenue)
| Growth | Status |
|--------|--------|
| >15% | 🟢 Strong |
| 10-15% | 🟡 Good |
| 5-10% | 🟠 Slow |
| <5% | 🔴 Stalled |

### 3. Unit Economics
| Metric | Healthy | Warning |
|--------|---------|---------|
| LTV:CAC | >3:1 | <2:1 |
| CAC Payback | <12 mo | >18 mo |
| Gross Margin | >70% | <50% |
| Net Revenue Retention | >100% | <90% |

### 4. Churn Health (Monthly)
| Churn | Status |
|-------|--------|
| <2% | 🟢 Excellent |
| 2-5% | 🟡 Normal |
| 5-10% | 🟠 High |
| >10% | 🔴 Leaky bucket |

## Quick Ratio
Measures growth efficiency:
```
Quick Ratio = (New MRR + Expansion MRR) / (Churned MRR + Contraction MRR)
```

| Ratio | Status |
|-------|--------|
| >4 | 🟢 Excellent growth |
| 2-4 | 🟡 Good |
| 1-2 | 🟠 Struggling |
| <1 | 🔴 Shrinking |

## Output Format

```
## Financial Health: [Company]

**Snapshot:**
- MRR: $X
- Burn: $Y/month
- Cash: $Z
- Runway: N months

**Health Scores:**
| Area | Score | Status |
|------|-------|--------|
| Runway | X mo | 🟢/🟡/🟠/🔴 |
| Growth | X% | 🟢/🟡/🟠/🔴 |
| Churn | X% | 🟢/🟡/🟠/🔴 |
| Unit Econ | LTV:CAC X:1 | 🟢/🟡/🟠/🔴 |

**Overall:** 🟢 Healthy / 🟡 Monitor / 🟠 Action Needed / 🔴 Critical

**Top Concern:** [Biggest issue]

**Recommendations:**
1. [Action item]
2. [Action item]
```

## Red Flags to Watch

- Revenue growing but cash shrinking faster
- Churn accelerating month over month
- CAC increasing while LTV flat
- Margins compressing
- Key customer concentration (>30% from one customer)

## Green Flags

- Net revenue retention >100% (expansion > churn)
- Decreasing CAC over time
- Improving margins
- Diversified customer base
- Cash growing faster than burn
