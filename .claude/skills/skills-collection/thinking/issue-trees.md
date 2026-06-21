---
name: issue-trees
description: Tunguz/consulting framework - map problems as hierarchical trees to find root causes and solutions
tokens: ~300
cloud-ok: true
---

# Issue Trees
#claudeai

## The Framework

An issue tree breaks down a complex problem into a hierarchy of sub-questions. Solve the leaves, and you solve the root.

```
[Main Question]
├── [Sub-question 1]
│   ├── [Sub-sub Q 1.1]
│   └── [Sub-sub Q 1.2]
├── [Sub-question 2]
│   ├── [Sub-sub Q 2.1]
│   └── [Sub-sub Q 2.2]
└── [Sub-question 3]
```

This is the backbone of consulting problem-solving and analytical VC work.

## Two Types

### 1. Diagnostic Tree (Why?)
"Why is [problem] happening?"

Breaks down possible causes. Used when something is broken.

### 2. Solution Tree (How?)
"How can we [achieve goal]?"

Breaks down possible solutions. Used when exploring options.

## How to Use

### Step 1: State the question
Be specific. "Why is churn high?" not "What's wrong?"

### Step 2: Break into MECE sub-questions
Each level should be mutually exclusive and collectively exhaustive.

### Step 3: Keep breaking down
Until you reach questions you can directly answer with data or action.

### Step 4: Prioritize branches
Not all branches matter equally. Focus on highest-impact areas.

### Step 5: Answer the leaves
Gather data, test hypotheses, take action on the lowest-level questions.

### Step 6: Synthesize up
Answers at leaves combine to answer the root question.

## Example: Diagnostic Tree

**Why is revenue declining?**

```
Why is revenue declining?
├── Volume problem (fewer customers)?
│   ├── Fewer new customers?
│   │   ├── Fewer leads?
│   │   └── Lower conversion?
│   └── More customers leaving?
│       ├── Product issues?
│       └── Competitive pressure?
└── Price problem (lower revenue per customer)?
    ├── Discounting more?
    └── Smaller deal sizes?
```

## Example: Solution Tree

**How can we grow revenue 50%?**

```
How can we grow revenue 50%?
├── Grow existing customers (expansion)?
│   ├── Upsell to higher tiers?
│   └── Cross-sell new products?
├── Acquire new customers?
│   ├── Scale existing channels?
│   └── Open new channels?
└── Enter new markets?
    ├── New customer segments?
    └── New geographies?
```

## Output Format

```
## Issue Tree: [Main Question]

**Type:** Diagnostic (why) / Solution (how)

**Tree:**
```
[Main Question]
├── [Branch 1]
│   ├── [Leaf 1.1]
│   └── [Leaf 1.2]
├── [Branch 2]
│   ├── [Leaf 2.1]
│   └── [Leaf 2.2]
└── [Branch 3]
    └── [Leaf 3.1]
```

**MECE check:** ✓ / Needs work

**Priority branches:**
1. [Branch] - Why: [Reason to focus here]
2. [Branch] - Why: [Reason]

**Next steps:**
For [priority branch]:
- [ ] [Data to gather]
- [ ] [Hypothesis to test]
- [ ] [Action to take]
```

## Tips

- **Start broad, then narrow** - Don't go deep too fast
- **Each level should be MECE** - No overlaps, nothing missing
- **3-5 branches per level** - More than 5 is usually too many
- **Stop when actionable** - Leaves should be things you can investigate or do
- **Iterate** - First tree is usually wrong; refine it

---

*"Give me six hours to chop down a tree, and I'll spend the first four sharpening the axe."* — Lincoln (probably not, but good advice)
