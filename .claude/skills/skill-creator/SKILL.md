---
name: skill-creator
description: "Scaffold and improve Claude Code skills. Use when the user wants to create a new skill, write a SKILL.md, fix a skill that isn't triggering, or improve a skill's description. Covers folder layout, YAML frontmatter, triggering descriptions, and bundling scripts/data."
---

# Skill Creator

Author new Claude Code skills and fix existing ones.

> Note: an official `skill-creator` plugin skill may also be available with eval/benchmark tooling. This is a lightweight, dependency-free authoring guide.

## What a skill is
A skill is a folder under `.claude/skills/<name>/` (project) or `~/.claude/skills/<name>/` (personal) containing a `SKILL.md` with YAML frontmatter. Optional `scripts/`, `references/`, and `data/` subfolders hold supporting files.

## SKILL.md anatomy

```markdown
---
name: my-skill            # lowercase-hyphenated, matches the folder name
description: "<when to use + trigger keywords>"
---

# My Skill
<instructions the model follows when the skill activates>
```

## Writing a good `description` (the most important field)
The description is how the model decides when to activate the skill. Make it:
- **Action + trigger oriented** — say *when* to use it and include the words a user would actually type.
- **Specific** — name the tasks, file types, and verbs it covers; note what it does NOT cover if ambiguous.
- **Keyword-rich but honest** — include synonyms, but don't claim capabilities the body doesn't deliver.

## Process to create one
1. Define the single job the skill does and the moments it should trigger.
2. Create `.claude/skills/<name>/SKILL.md` with frontmatter + a focused body.
3. Keep the body actionable: a short "When to use", a process/checklist, and an output format if relevant.
4. Bundle only what's needed: `scripts/` for executable helpers, `references/` for docs the model reads on demand, `data/` for lookups.
5. Test triggering: describe a realistic user request and confirm the description would match.

## Common pitfalls
- Vague descriptions ("helps with code") → poor triggering. Be concrete.
- Giant SKILL.md → move detail into `references/` and point to it.
- Name/folder mismatch → the skill won't load.
