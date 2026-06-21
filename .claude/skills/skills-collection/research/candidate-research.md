---
name: candidate-research
description: Research job candidates before interviews
tokens: ~350
cloud-ok: true
---

# Candidate Research
#claudeai

## When to Use
You're interviewing someone and want to prepare good questions and verify their background.

## What I Need
- Candidate name
- Role they're applying for
- Their resume (if available)

## Research Checklist

### Basic Verification
- [ ] LinkedIn matches resume
- [ ] Employment dates align
- [ ] Company names/roles match
- [ ] Education credentials verify

### LinkedIn Deep Dive
- [ ] Full work history
- [ ] Recommendations (what do people say?)
- [ ] Skills endorsements (patterns?)
- [ ] Content they post (what do they care about?)
- [ ] Connections (who do they know in common?)

### Work Evidence
- [ ] GitHub/portfolio (if technical)
- [ ] Writing samples (blog, Medium, LinkedIn articles)
- [ ] Speaking/podcast appearances
- [ ] Projects mentioned on LinkedIn

### Company Context
For each previous company:
- What did the company do?
- What was happening during their tenure? (growth, layoffs, pivots)
- Team size / scope of role likely

### Red Flag Checks
- [ ] Short tenures across multiple roles (why?)
- [ ] Gaps in employment (explanation?)
- [ ] Title inflation (VP at 2-person company)
- [ ] Vague accomplishments (no metrics)

## Research-Informed Questions

**For vague resume claims:**
"You mentioned you 'improved sales.' Can you walk me through the specific numbers?"

**For interesting career moves:**
"I noticed you went from [Big Company] to [Startup]. What drove that decision?"

**For gaps or short tenures:**
"Tell me about your transition from [Company A] to [Company B]."

**For skill verification:**
"Your LinkedIn shows you're skilled in [X]. Can you describe a project where you used that?"

**For culture fit:**
"I saw you posted about [topic]. Tell me more about your interest there."

## Output Format

```
## Candidate Brief: [Name]

**Applying for:** [Role]
**LinkedIn:** [Link]

**Background Summary:**
[2-3 sentence overview of their career]

**Key Qualifications:**
✓ [Strength relevant to role]
✓ [Strength relevant to role]
✓ [Strength relevant to role]

**Concerns/Questions:**
? [Thing that needs clarification]
? [Potential red flag to explore]

**Verification:**
| Claim | Verified? | Notes |
|-------|-----------|-------|
| [Resume claim] | ✓/✗/? | [Note] |
| [Resume claim] | ✓/✗/? | [Note] |

**Questions to Ask:**
1. [Specific question based on research]
2. [Question about concern area]
3. [Question about relevant experience]
4. [Question about working style/culture]

**Reference Check Notes:**
[Who to ask for references, what to verify]

**Overall Impression:**
[Summary assessment before interview]
```

## What NOT to Research

- Personal social media (unless they share publicly for professional purposes)
- Political affiliations
- Family situation
- Anything you wouldn't ask in an interview

Stick to professional and publicly available information.
