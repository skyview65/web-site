---
name: skills-collection
description: Router for a collection of founder and business skills covering startup strategy and decisions, prioritization, pitching, investors and hiring, marketing (SEO, copy, ads, CRO, pricing), finance (runway, contracts, negotiation), research (competitors, prospects, market intel), mental models and structured thinking frameworks, Stoic philosophy frameworks for resilience and motivation, e-commerce/UX reviews, plus calendar, task, and meeting helpers. Use when a founder asks open-ended, strategic, or stuck questions, or needs a specific business, thinking, or philosophy framework.
---

# Skills Index
#claudeai

Route to the right domain. The domain router finds the specific skill.

## Meta-Skill: Guided Thinking

**→ [[guided-thinking]]** - When a founder asks open-ended, existential, or "stuck" questions, this skill detects the need and walks them through an appropriate framework.

**Triggers:**
- "What's the point?" / "Is this worth it?" → philosophy frameworks
- "I have too much to do" / "I can't focus" → prioritization frameworks
- "I don't know what to do" / "I'm stuck" → problem-solving frameworks
- "I'm scared of..." / "What if it fails?" → anxiety/fear frameworks
- "I'm not good enough" / "I feel like a fraud" → self-compassion frameworks
- "Should I...?" / "I can't decide" → decision frameworks

---

## Domain Routers

| Domain | Use For | Skills |
|--------|---------|--------|
| **[[founder/_router\|Founder]]** | Priorities, pitching, investors, meetings, decisions, team | 24 |
| **[[marketing/_router\|Marketing]]** | SEO, copy, ads, CRO, email, pricing | 10 |
| **[[finance/_router\|Finance]]** | Runway, contracts, negotiations, invoicing, cash analysis | 8 |
| **[[research/_router\|Research]]** | Competitors, prospects, investors, market intel | 7 |
| **[[thinking/_router\|Thinking]]** | Mental models, structured problem-solving | 22 |
| **[[philosophy/_router\|Philosophy]]** | Resilience, meaning, imposter syndrome, life satisfaction | 13 |

---

## Quick Match

### Tactical Problems
- "prioritize" / "delegate" / "launch" → founder
- "landing page" / "copy" / "ads" / "SEO" → marketing
- "runway" / "contract" / "negotiate" / "expenses" → finance
- "research competitor" / "research investor" / "prep for call" → research

### Thinking & Analysis
- "break this down" / "why is this happening" → thinking (mece, issue-trees, five-whys)
- "first principles" / "assumptions" → thinking
- "what could go wrong" / "stress test" → thinking (premortem, inversion)
- "decide between" / "big decision" → thinking (regret-minimization, thinking-in-bets)

### Emotional & Existential
- "can't control" / "anxious" → philosophy (dichotomy-of-control)
- "imposter" / "not good enough" → philosophy (self-compassion, beginner-mind)
- "burned out" / "forcing it" → philosophy (wu-wei)
- "what's the point" / "meaningless" → philosophy (absurdist-resilience, eudaimonia)
- "success feels empty" → philosophy (eudaimonia, ikigai)
- "why me" / "unfair" → philosophy (amor-fati)

---

## Architecture

- Domain routers: ~150-300 tokens
- Micro-skills: ~250-450 tokens
- Guided thinking meta-skill: ~400 tokens
- Total for typical task: ~500-700 tokens (<10% of 8k context)

Built for context efficiency with local models.

---

## Total: 85 skills across 6 domains + 1 meta-skill

| Domain | Count |
|--------|-------|
| Founder | 24 |
| Marketing | 10 |
| Finance | 8 |
| Research | 7 |
| Thinking | 22 |
| Philosophy | 13 |
| Meta (guided-thinking) | 1 |
| **Total** | **85** |
