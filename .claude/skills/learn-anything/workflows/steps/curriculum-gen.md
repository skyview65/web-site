# Step 5: Generate Curriculum

<required_reading>
- `.claude/skills/learn-anything/templates/curriculum.md`
- `.claude/skills/learn-anything/references/metadata-system.md`
</required_reading>

<process>

Read `.claude/skills/learn-anything/templates/curriculum.md`
Read `.claude/skills/learn-anything/references/metadata-system.md`

Using all gathered info (research, MCP availability, personalization):

1. Create MODULAR curriculum:
   - `curriculum/module-01.md`, `module-02.md`, etc.
   - Each module: objectives, concepts, exercises
   - `curriculum/INDEX.md`: overview and module list

2. Match learner's level (skip basics for advanced, add fundamentals for beginners)

3. Adjust depth based on scope

4. Mark which exercises will be hands-on (MCP) vs conceptual

5. Create ORIGINAL structure -- do NOT copy existing courses

**6. Add YAML frontmatter to each module file:**

Each module file must include:
```yaml
---
module_number: 1
title: "Module Title"
difficulty: beginner  # beginner/intermediate/advanced
estimated_time: 45  # minutes
status: not-started  # not-started/in-progress/completed
started_date: null
completed_date: null
tags:
  - relevant
  - keywords
prerequisites: []  # or [module-1, module-2]
next_module: module-2
concepts_covered:
  - concept-1
  - concept-2
exercises_count: 3
hands_on: true  # true if MCP tools available
mcp_tools_used:
  - context7  # list MCPs used in this module
---
```

Update `.course-state.json` with `totalModules`.

Present: "Here's your personalized curriculum: [summary from INDEX.md]"

"Want to adjust anything before we begin?"

Wait for approval.

</process>

<success_criteria>
- Curriculum is modular (separate module files + INDEX.md) with YAML frontmatter
- Teaching adapts to chosen learning mode
- Exercises saved as individual files with metadata tracking
- .course-state.json updated with totalModules
</success_criteria>

<error_recovery>
If curriculum generation produces too many or too few modules for the learner's scope, ask the learner if they want to adjust before proceeding.
</error_recovery>
