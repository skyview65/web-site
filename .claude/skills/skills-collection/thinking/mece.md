---
name: mece
description: McKinsey/Tunguz framework - mutually exclusive, collectively exhaustive breakdown
tokens: ~300
cloud-ok: true
---

# MECE
#claudeai

## The Framework

**MECE = Mutually Exclusive, Collectively Exhaustive**

When breaking down a problem:
- **Mutually Exclusive:** Categories don't overlap (no double-counting)
- **Collectively Exhaustive:** Categories cover everything (nothing missing)

This is the foundation of structured problem-solving used at McKinsey, Bain, and by analytical VCs like Tomasz Tunguz.

## How to Use

### Step 1: State the problem or question
"Why is [X happening]?" or "How can we [achieve Y]?"

### Step 2: Break into MECE categories
Each bucket must not overlap with others (ME)
Together, buckets must cover all possibilities (CE)

### Step 3: Check yourself
- Is there any overlap between categories? (fix ME)
- Is there anything not captured? (fix CE)

### Step 4: Go deeper
Apply MECE again within each category as needed.

## MECE Examples

**Why is revenue down?**

❌ Not MECE:
- Marketing isn't working
- Sales team is weak
- Product issues
- Bad economy
(Overlaps, not exhaustive)

✅ MECE:
- Volume down (fewer customers)
  - Fewer leads
  - Lower conversion
  - Higher churn
- Price down (same customers, less revenue)
  - Lower prices
  - Smaller deals
  - Worse mix

**How can we grow?**

✅ MECE:
- Sell more to existing customers (expansion)
- Sell to new customers (acquisition)
- Enter new markets (new segments/geos)

## Common MECE Structures

| Problem | MECE Breakdown |
|---------|----------------|
| Revenue | Volume × Price |
| Profit | Revenue - Costs |
| Costs | Fixed + Variable |
| Growth | New + Expansion - Churn |
| Traffic | Paid + Organic + Direct |
| Market | Segment A + B + C + Other |
| Time | Past + Present + Future |
| Control | Things we control + Things we don't |

## Output Format

```
## MECE Breakdown: [Problem/Question]

**Question:** [What you're analyzing]

**Level 1 breakdown:**
```
[Problem]
├── [Category A]
├── [Category B]
├── [Category C]
└── [Category D (or "Other")]
```

**ME check:** Do any categories overlap? [Yes/No]
**CE check:** Is anything missing? [Yes/No]

**Deeper breakdown (if needed):**
```
[Category A]
├── [Sub-category A1]
├── [Sub-category A2]
└── [Sub-category A3]
```

**Where to focus:**
Based on this structure, the highest-impact area is [X] because [reason].
```

## The Power of MECE

Once you have a MECE structure:
- You can systematically eliminate possibilities
- You know you're not missing anything
- You can prioritize based on complete information
- Communication becomes clearer

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Categories overlap | Redefine boundaries |
| "Other" is too big | Break it down further |
| Not exhaustive | Ask "what else could it be?" |
| Too many categories | Group into higher-level buckets |
| Too abstract | Make categories concrete and measurable |

---

*"The first step to solving any problem is defining it precisely."* — Tomasz Tunguz
