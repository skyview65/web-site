---
name: email-sequence
description: Build email sequences and drip campaigns
tokens: ~400
cloud-ok: true
---

# Email Sequence
#claudeai

## When to Use
Creating welcome sequences, nurture campaigns, onboarding emails, or any automated email flow.

## Process

### 1. Define the Sequence Goal
- Welcome/onboarding → Activation
- Nurture → Sale or demo booking
- Re-engagement → Return to product
- Post-purchase → Upsell or referral

### 2. Map the Journey
```
Trigger → Email 1 (Day 0) → Email 2 (Day 2) → ... → Final CTA
```

Typical cadences:
- Welcome: Days 0, 1, 3, 5, 7
- Nurture: Days 0, 3, 7, 14, 21
- Re-engagement: Days 0, 3, 7 (then stop)

### 3. Email Framework (per email)

**Subject line:** Curiosity or benefit (no clickbait)
**Opening:** Hook in first line (preview text matters)
**Body:** One idea, one CTA
**CTA:** Single clear action

### 4. The 5-Email Welcome Sequence Template

| Email | Day | Goal | Subject Pattern |
|-------|-----|------|-----------------|
| 1 | 0 | Deliver value, set expectations | "Welcome + here's [thing]" |
| 2 | 1 | Quick win or tutorial | "Quick tip: [benefit]" |
| 3 | 3 | Social proof / case study | "How [person] got [result]" |
| 4 | 5 | Address objection | "[Common concern]? Here's the truth" |
| 5 | 7 | Clear CTA | "Ready to [action]?" |

### 5. Output Format
```
## Email Sequence: [Name]

**Goal:** [What success looks like]
**Trigger:** [What starts the sequence]

### Email 1: [Title] (Day 0)
Subject: 
Preview:
Body:
CTA:

### Email 2: [Title] (Day X)
...
```

## Quick Tips
- 40-60 char subjects perform best
- Preview text is free real estate - use it
- P.S. lines get read - put secondary CTA there
- One CTA per email, max

## Deep Dive
For templates and psychology: [[email-sequence-reference]]

## Attribution
Adapted from Corey Haines' email-sequence skill (MIT)
