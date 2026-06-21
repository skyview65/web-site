# Recovery Workflow: Reconstruct Course State

Triggered when .course-state.json or progress.md is missing, corrupted, or suspected inconsistent. Can be invoked via /recover command or suggested when validation fails.

<required_reading>
- references/metadata-system.md - For validation schemas
- templates/progress.md - For progress file structure
</required_reading>

<process>

## Step 1: Assess Damage

1. Check which state files exist and are readable:
   - .course-state.json -- exists? valid JSON?
   - progress.md -- exists? has YAML frontmatter?
   - curriculum/INDEX.md -- exists?
   - CLAUDE.md -- exists?
   - HANDOFF.md -- exists?

2. Scan detail files (these are the source of truth):
   - List all curriculum/module-*.md files (exclude INDEX.md)
   - List all exercises/module-*-ex-*.md files
   - For each file: extract YAML frontmatter, verify it has a status field

3. Report findings to learner:
   "Found [X] module files ([Y] completed, [Z] in-progress)
    Found [X] exercise files ([Y] completed)
    .course-state.json: [exists/missing/corrupted]
    progress.md: [exists/missing/corrupted]"

## Step 2: Reconstruct .course-state.json

From module frontmatter:
- totalModules = count of module files matching module-*.md pattern
- completedModules = count where status: completed
- currentModule = lowest module_number where status != completed (or totalModules + 1 if all complete)
- lastActivity = most recent completed_date across all module and exercise files

From exercise frontmatter:
- completedExercises = count where status: completed
- totalTimeMinutes = sum of time_spent_minutes across all exercises

From CLAUDE.md (parse the Course Context section):
- topic, level, style, mode, language

From .mcp.json (if exists):
- mcpInstalled = list of server names from mcpServers keys

Set permanentMode = mode, modeIsTemporary = false (cannot recover temporary switch context).

Preserve any fields from existing .course-state.json that are not reconstructible (contextUsage, started date). If .course-state.json is missing entirely, use defaults.

Validate reconstructed JSON against .course-state.json schema from metadata-system.md (Validation Schemas section).

## Step 3: Reconstruct progress.md

Use templates/progress.md for structure.

Populate frontmatter from reconstructed values:
- topic, learner_level, teaching_style, language from CLAUDE.md
- total_modules, completed_modules, current_module from reconstruction
- completed_exercises from reconstruction
- status: active (unless all modules completed, then: completed)
- session_count: 1 (cannot recover exact count)
- last_session: today's date

Session history section: Add a single entry:
"### Recovery Session - [today's date]
- **Note:** Progress reconstructed from curriculum and exercise files
- Previous session history could not be recovered
- Modules completed: [list module numbers and titles]
- Exercises completed: [count]"

## Step 4: Validate and Confirm

Cross-check reconstruction:
- completedModules count matches modules with status: completed
- currentModule follows sequentially from last completed (warn if gap found)
- completedExercises count matches exercises with status: completed

Present reconstruction summary to learner:
"**State Reconstructed:**
- Topic: [X]
- Progress: [Y] of [Z] modules complete
- [A] exercises completed
- Current position: Module [N]: [title]
- Mode: [mode]

**What was recovered:** Module and exercise completion status, current position, course settings.
**What could not be recovered:** Session history, exact time tracking, streak data, learner insights.

Does this match your memory of where you were? Type 'yes' to save, or describe what needs adjusting."

If learner confirms: write .course-state.json and progress.md.
If learner adjusts: apply their corrections, then write.

</process>

<success_criteria>
- All surviving module and exercise files scanned for frontmatter
- .course-state.json reconstructed with correct counts and position
- progress.md reconstructed with correct frontmatter values
- Reconstruction validated against schemas
- Learner confirms before state files are overwritten
- Clear report of what was and was not recoverable
</success_criteria>

<error_recovery>
- If no module files found: "No curriculum files found. This course folder may be empty or corrupted beyond recovery. Consider starting a new course."
- If module files exist but have no frontmatter: "Module files found but metadata is missing. I can reconstruct with defaults (all modules not-started). Continue?"
- If CLAUDE.md missing: "Course context file missing. I need to know the topic and your settings. What were you learning?"
</error_recovery>
