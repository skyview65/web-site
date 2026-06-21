---
name: runway-calc
description: Calculate runway, burn rate, and when you'll run out of money
tokens: ~350
cloud-ok: true
---

# Runway Calculator
#claudeai

## When to Use
You need to know how long your money will last or how burn rate changes affect runway.

## What I Need
- Current cash balance
- Monthly expenses (or I can help estimate)
- Monthly revenue (if any)

## The Math

### Basic Runway
```
Runway (months) = Cash Balance / Monthly Burn
```

### Net Burn (if you have revenue)
```
Net Burn = Monthly Expenses - Monthly Revenue
Runway = Cash Balance / Net Burn
```

### Example
- Cash: $500,000
- Monthly expenses: $80,000
- Monthly revenue: $30,000
- Net burn: $50,000
- Runway: 10 months

## Quick Calculations

| Cash | Net Burn | Runway |
|------|----------|--------|
| $100k | $10k/mo | 10 months |
| $100k | $25k/mo | 4 months |
| $250k | $25k/mo | 10 months |
| $500k | $50k/mo | 10 months |
| $1M | $100k/mo | 10 months |

## Burn Rate Components

Typical startup burn breakdown:
- **Salaries:** 60-80% (your biggest lever)
- **Software/tools:** 5-10%
- **Office/remote:** 5-10%
- **Marketing:** 5-15%
- **Legal/accounting:** 2-5%
- **Everything else:** 5-10%

## Scenario Planning

```
## Runway Analysis

**Current State:**
- Cash: $___
- Monthly burn: $___
- Monthly revenue: $___
- Net burn: $___
- Current runway: ___ months

**Scenarios:**

| Scenario | Change | New Burn | New Runway |
|----------|--------|----------|------------|
| Current | - | $X | Y months |
| Cut 1 person | -$Xk | $Y | Z months |
| Lose customer | -$Xk rev | $Y | Z months |
| Win deal | +$Xk rev | $Y | Z months |
| Raise $Xk | +$Xk cash | $Y | Z months |
```

## Warning Thresholds

| Runway | Status | Action |
|--------|--------|--------|
| 18+ months | Green | Focus on growth |
| 12-18 months | Yellow | Start thinking about fundraise |
| 6-12 months | Orange | Actively fundraise or cut costs |
| <6 months | Red | Emergency mode - cut now |

## Default Alive vs Default Dead

**Default Alive:** Revenue growth will exceed expenses before money runs out
**Default Dead:** You'll run out of money before reaching profitability

Calculate: If revenue grows at current rate and costs stay flat, do you survive?

## Output Format

```
## Runway Analysis: [Company]

**Current Position:**
- Cash: $X
- Net burn: $Y/month
- Runway: Z months
- Status: 🟢/🟡/🟠/🔴

**Key Insight:** [Default alive/dead, main risk]

**Scenarios:**
[Table of what-ifs]

**Recommendation:**
[What to do given the numbers]
```
