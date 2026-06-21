---
name: market-research
description: Research market size, trends, and dynamics for pitches or strategy
tokens: ~400
cloud-ok: true
---

# Market Research
#claudeai

## When to Use
You need to understand market size (TAM/SAM/SOM), trends, or dynamics for a pitch, strategy decision, or planning.

## What I Need
- What market/industry?
- Why do you need this? (pitch, strategy, planning)
- Any specific questions?

## Market Sizing Framework

### TAM, SAM, SOM

**TAM (Total Addressable Market)**
Everyone who could theoretically use your solution.
"All spending on [category] globally"

**SAM (Serviceable Addressable Market)**
The portion you could realistically serve.
"Companies in [segment] in [geography]"

**SOM (Serviceable Obtainable Market)**
What you can realistically capture in 3-5 years.
"[X]% of SAM based on [competitive position]"

### Sizing Methods

**Top-Down:**
Start with industry reports, narrow down.
"$50B global market × 20% in our segment × 10% in our geography = $1B"

**Bottom-Up:**
Start with unit economics, build up.
"10,000 target companies × $5k ACV = $50M addressable"

**Analog-Based:**
Compare to similar markets.
"Market X grew to $5B. We're solving similar problem for [segment]."

## Research Checklist

### Market Size
- [ ] Industry reports (Google "[industry] market size")
- [ ] Analyst reports (Gartner, Forrester, IDC if available)
- [ ] Public company filings (revenue of players = floor)
- [ ] Census/government data
- [ ] Industry associations

### Growth & Trends
- [ ] Historical growth rate
- [ ] Projected growth
- [ ] Drivers of growth
- [ ] Headwinds / risks
- [ ] Regulatory changes

### Competitive Landscape
- [ ] Major players and market share
- [ ] New entrants / disruptors
- [ ] Consolidation trends
- [ ] Funding activity in space

### Customer Dynamics
- [ ] How do they buy today?
- [ ] What's changing about their needs?
- [ ] Budget trends
- [ ] Decision-making process

## Where to Look

| Source | What You'll Find |
|--------|------------------|
| Statista | Market size, basic stats |
| IBISWorld | Industry reports |
| Crunchbase | Funding trends |
| Google Scholar | Academic research |
| Industry publications | Trends, news |
| Public company 10-Ks | Market descriptions from insiders |
| Job postings | Hiring trends = market activity |
| Earnings calls | How leaders describe market |

## Output Format

```
## Market Research: [Market/Industry]

**Market Definition:**
[What we're measuring]

**Market Size:**
- TAM: $[X]B - [Source]
- SAM: $[X]B - [How calculated]
- SOM: $[X]M - [Realistic capture]

**Growth:**
- Historical: [X]% CAGR (20XX-20XX)
- Projected: [X]% CAGR (20XX-20XX)
- Key drivers: [What's fueling growth]

**Market Dynamics:**
- Stage: [Emerging / Growing / Mature / Declining]
- Key trend 1: [Trend and impact]
- Key trend 2: [Trend and impact]

**Competitive Landscape:**
| Player | Est. Share | Notes |
|--------|------------|-------|
| [Name] | [X]% | [Positioning] |
| [Name] | [X]% | [Positioning] |

**Opportunities:**
- [Gap or trend to exploit]
- [Underserved segment]

**Risks:**
- [Market risk]
- [Competitive risk]

**For Your Pitch:**
[1-2 sentences on how to position this market in a pitch]

**Sources:**
- [Source 1]
- [Source 2]
```

## Common Mistakes

- Using TAM when you mean SAM (investors will call you out)
- Citing old data (markets change fast)
- Single source (triangulate multiple sources)
- Confusing revenue vs transactions vs users
- Not explaining your assumptions
