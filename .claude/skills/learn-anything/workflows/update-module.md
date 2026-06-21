# Workflow: Update Module File

**Trigger**: User asks questions, requests clarifications, changes learning mode, or requests re-explanation during an active module

## Purpose

When a module is in progress, the saved module file should be a **living document** that captures:
- The original module delivery
- Follow-up questions and answers
- Re-explanations in different styles
- Mode changes and re-deliveries
- User insights and "aha moments"

This makes the completed module file a complete reference for that learning session.

## When to Update

Update `completed/module-{number}.md` whenever:

1. **User asks a question** about the current module content
2. **User requests `/explain-differently`** for the current module
3. **User changes learning mode** and asks to re-deliver current module
4. **User requests clarification** on a concept
5. **User shares an insight** ("Oh I get it now, it's like...")
6. **You provide additional examples** beyond the original delivery

## Process

### 1. Check if Module File Exists

Read `completed/module-{number}.md` to see if it exists and what's already there.

### 2. Append New Content

Add a new section to the existing file using this format:

```markdown

---

## Follow-up: {Question/Topic}
**Asked:** {timestamp}

{User's question or request}

### Answer

{Your response}

```

### 3. Special Cases

**Mode change re-explanation:**
```markdown

---

## Re-explained in {New Mode} Mode
**Changed from:** {old mode} → {new mode}
**Date:** {timestamp}

{Full re-explanation in new mode}

```

**Different teaching style:**
```markdown

---

## Same Concept, Different Style: {Style Name}
**Original style:** {original} → **New style:** {new style}
**Date:** {timestamp}

{Re-explanation in new style}

```

**User insight:**
```markdown

---

## User Insight
**Date:** {timestamp}

> {User's insight or "aha moment" in their own words}

This shows understanding of: {concept it demonstrates}

```

## Example Flow

**Initial delivery** (via `/next`):
```markdown
---
module_number: 1
title: "Architecture & Mental Model"
completed_date: null
status: in-progress
---

# Module 1: Architecture & Mental Model

{Module content...}
```

**User asks: "What's the difference between Glob and Grep?"**

Append:
```markdown

---

## Follow-up: Glob vs Grep Clarification
**Asked:** 2026-02-11T14:30:00Z

User asked: "What's the difference between Glob and Grep?"

### Answer

- **Glob**: Searches by *filename pattern*. Fast, uses filesystem index.
  - Example: `**/*.ts` finds all TypeScript files
  - Use when: you know the file type or naming pattern

- **Grep**: Searches *file contents* using regex. Powered by ripgrep.
  - Example: `pattern: "function main"` finds files containing that string
  - Use when: you know what's *inside* the file but not the filename

Think: Glob = phone book (find by name), Grep = full-text search (find by what they said)

```

**User runs `/explain-differently casual`**

Append:
```markdown

---

## Same Concept, Different Style: Casual
**Original style:** Technical → **New style:** Casual
**Date:** 2026-02-11T14:35:00Z

Yo, so Claude Code isn't just a fancy chatbot. It's more like an autonomous robot that loops until your task is done.

Here's the vibe:
1. **Gather** - reads your code, searches files, asks questions
2. **Act** - makes edits, creates files, runs commands
3. **Verify** - runs tests, checks if it worked, loops back if it failed

{Rest of re-explanation...}

```

**User says "Oh! So it's like the context window is RAM and CLAUDE.md is the hard drive!"**

Append:
```markdown

---

## User Insight
**Date:** 2026-02-11T14:40:00Z

> "Oh! So it's like the context window is RAM and CLAUDE.md is the hard drive!"

Excellent analogy! This shows understanding of:
- Context window = volatile memory (cleared each session)
- CLAUDE.md = persistent storage (survives across sessions)
- The importance of writing important things to CLAUDE.md

```

## Success Criteria

✓ Module file becomes a complete learning artifact
✓ All Q&A captured for future reference
✓ Mode changes and re-explanations preserved
✓ User insights documented
✓ File remains readable and well-organized
✓ Timestamps allow reconstructing the learning journey
