# Workflow: Mark Module Complete

**Trigger**: User runs `/done` command or says "mark this module complete"

## Context Required
- `.course-state.json` — current module number
- `curriculum/module-{number}.md` — module metadata and content reference
- Current conversation — the module response to save

## Process

### 1. Identify Current Module
Read `.course-state.json` to get `currentModule` number.

### 2. Create Completed Directory
If it doesn't exist, create `completed/` directory in the course root.

### 3. Save Module Response
Write the module response from the current conversation to:
```
completed/module-{number}.md
```

Include:
- Module title and number as header
- Full module content as delivered
- Date completed
- Key takeaways summary

Format:
```markdown
---
module_number: {number}
title: "{module title}"
completed_date: {ISO date}
status: completed
---

# Module {number}: {Title}

Completed: {date}

{full module content as delivered}

---

## Key Takeaways

- {bullet point summary of main concepts}
- {typically 5-7 key points}
```

### 4. Update State (Module Completion)

Read `references/state-update.md` and follow the **Module Completion** checklist for these files:
- `curriculum/module-{number}.md` -- set status: completed, completed_date: [today]
- `curriculum/INDEX.md` -- update Module {number} status label to "completed"
- `.course-state.json` -- increment completedModules, set currentModule to {number+1}, update lastActivity
- `progress.md` -- increment completed_modules, set current_module to {number+1}, add session entry

Follow the write order, verification, and failure recovery from the checklist.

### 5. Present Completion Summary
Show the user:
- Module number and title
- What was covered (3-5 key concepts)
- File saved location
- Progress indicator (e.g., "Module 1/10 complete — 10% done")
- Next module preview (title only)
- Reminder to run `/next` when ready

## Example Output

```
✓ Module 1 Complete: Architecture & Mental Model

Key concepts covered:
- The agentic loop (gather → act → verify)
- Tool inventory and selection patterns
- Context window as finite resource (40-50% quality threshold)
- Permission modes and trust gradient
- CLAUDE.md as persistent cross-session memory

Response saved to: completed/module-01.md

Progress: 1/10 modules complete (10%)

Next up: Module 2 — CLAUDE.md & Memory System

Run `/next` when you're ready to continue, or `/exercise` to practice Module 1 concepts.
```

## Edge Cases

- **Module already completed**: Warn user, ask if they want to overwrite the saved response
- **No module active**: Tell user to run `/next` first to start a module
- **Between modules**: If currentModule is 0 or undefined, no module to mark complete

## Success Criteria

✓ Module response saved to file
✓ Module metadata updated to "completed"
✓ Course state reflects completion
✓ INDEX.md shows completed status
✓ User sees clear completion summary with next steps
