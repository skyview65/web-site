# Continue Course Workflow

<required_reading>
- `workflows/teach.md` - Teaching loop (mode-specific instruction, exercises, progress, handoff)
- `templates/progress.md` - To understand progress file structure
- `references/metadata-system.md` - To parse YAML frontmatter in course files
</required_reading>

<process>

## Step 0: Workspace Check (First - before anything else)

**CRITICAL:** Verify the user is in the correct workspace before proceeding.

1. Check current working directory
2. Look for course files in current directory: `.course-state.json`, `CLAUDE.md`, `progress.md`
3. If files NOT found in current directory:

   "**Workspace Issue Detected**

   I can't find your course files in the current directory.

   **VSCode/Cursor users:** You need to open the course folder as your workspace:
   1. File → Open Folder
   2. Select your course folder (e.g., `n8n/`, `python/`, etc.)
   3. Run `/learn continue` again

   **Terminal users:** Navigate to your course folder:
   ```bash
   cd [course-folder-name]
   /learn continue
   ```

   Where is your course folder located? I can help you find it."

   - **STOP** - Do not proceed until user resolves workspace issue

## Step 1: Find Existing Course

1. Look for `.course-state.json` in current directory
2. If found, read it to get course details
3. If not found, search subdirectories for course folders
4. If multiple courses exist, list them and ask which to continue
5. If no courses found, inform learner and suggest starting new course

Read the course files:
- `.course-state.json` - Machine state
- `CLAUDE.md` - Course-specific context
- `progress.md` **frontmatter** - Learner stats, session history
- `HANDOFF.md` **frontmatter** if exists (context usage, session number)
- Current module file: `curriculum/module-[XX].md` and its **frontmatter**
- Check for in-progress exercises: search `exercises/*.md` for `status: in-progress`

**Auto-migrate pre-Phase 4 state:** If `.course-state.json` does not contain `permanentMode`, add: `permanentMode` = current `mode` value, `modeIsTemporary` = false. Write the updated JSON back immediately. This is a non-breaking migration for existing courses.

## Step 1.3: Validate Course Files

After reading .course-state.json and before proceeding, validate against the schemas in `references/metadata-system.md` (Validation Schemas section):

**Validate .course-state.json:**
- Check all REQUIRED fields are present (topic, level, style, mode, permanentMode, modeIsTemporary, language, currentModule, totalModules, completedModules, mcpInstalled)
- Check enum fields have allowed values (case-insensitive comparison)
- Check number fields are numbers (not strings)

**Validate current module file** (if curriculum/module-{currentModule}.md exists):
- Check required fields: module_number, title, difficulty, status
- Check enum values for difficulty and status

**Validation behavior:**
- **Missing REQUIRED field in .course-state.json:** Warn the learner. Suggest running /recover.
  "**State issue detected:** .course-state.json is missing the `{field}` field. This may cause tracking issues. Run `/recover` to reconstruct your course state, or I can add a default value."
- **Wrong enum value:** Warn and suggest correction.
  "**Metadata issue:** `{field}` has value `{value}`, expected one of [{allowed}]. Want me to fix this?"
- **Missing optional field:** Silently use default. No message to learner.
- **All fields valid:** Continue normally. No validation message.

Do NOT halt the workflow for validation issues unless .course-state.json itself is missing or unparseable JSON. Validation is advisory -- the learner should still be able to continue their course.

## Step 1.5: Check for Incomplete Course Setup

After loading `.course-state.json`, check if course construction is incomplete:

**If `totalModules == 0` (course created but setup not finished):**

This means the learner completed Step 1 (folder creation) but Steps 2-6 (personalization, research, MCP evaluation, curriculum generation, handoff) have not yet run. This is expected after the MANDATORY STOP in Step 1.

**Verify MCP Tools Available (non-blocking):**

Before routing to Steps 2-6, check if MCP tools loaded correctly in this workspace:

1. Use ToolSearch to search for "youtube" (single keyword -- multi-word queries may miss deferred tools)
2. If YouTube transcript tools found: MCP is working. Continue below.
3. If YouTube transcript tools NOT found: warn the user but do NOT halt:

   "**Note:** YouTube transcript MCP tools were not detected. The course will work normally, but `/add-video` may not function until MCP tools are available. If you need video features, try reopening this workspace from the course folder."

   Continue to Steps 2-6 regardless -- MCP tools are helpful but not required for course setup.

4. Optionally check for Context7: Use ToolSearch to search for "context7" (single keyword)
   - If found: Context7 is available for documentation research
   - If not found: proceed without it (Context7 is optional -- courses work without it but benefit from official docs access)

Route back to the start-course coordinator to continue from Step 2:

Read `.claude/skills/learn-anything/workflows/start-course.md` and follow it **starting from Step 2** (skip Step 1 -- the course folder already exists).

**STOP here -- do not continue with the rest of continue-course.md.**

**If `totalModules > 0` (course setup complete -- normal resume):**

**Lightweight MCP Check (non-blocking):**

Use ToolSearch to search for "youtube" (single keyword -- multi-word queries may miss deferred tools). This is a quick health check, not a hard gate:

- If YouTube transcript tools found: MCP is working. Continue to Step 2.
- If YouTube transcript tools NOT found: warn the user but do NOT halt:

  "**Note:** YouTube transcript MCP tools were not detected in this workspace. Teaching and exercises will work normally, but some features (like `/add-video`) may not function until MCP tools are available. If you need video features, try reopening this workspace from the course folder."

Continue to Step 2 below (normal resume flow).

## Step 2: Parse Metadata and Adapt Greeting

**Mode Restoration Check (FIRST -- before greeting):**

If `modeIsTemporary` is `true` in `.course-state.json`:
1. Record the temporary mode for logging: `tempMode = mode`
2. Set `mode` = `permanentMode`
3. Set `modeIsTemporary` = `false`
4. Write updated `.course-state.json`
5. Log in `progress.md`: "**Mode restored on resume:** [tempMode] (temporary) -> [permanentMode] (permanent)"
6. Inform learner: "Note: Your mode has been restored to [permanentMode] (the temporary [tempMode] mode from last session has ended)."

If `modeIsTemporary` is `false`: No action needed. Continue normally.

Extract from frontmatter:
- `progress.completed_modules`
- `progress.current_streak_days`
- `progress.last_session`
- `currentModule.status` (in-progress/not-started)
- Any in-progress exercises

### If completedModules == 0 (first learning session):

This is the learner's first time in the actual learning context (construction was in a previous session). Give a warm, concise welcome:

- "Welcome to your [topic] course! [X] modules ready, [X] video sources integrated, [X] MCP tools for hands-on practice."
- "You're starting with Module 1: **[title]**"

**Introduce commands explicitly** — the learner may not know what slash commands are or how to use them:

- "This course comes with built-in commands you can type anytime. Here are the key ones to know:"
- Show a short table of the most important commands:

  | Command | What it does |
  |---------|-------------|
  | `/next` | Move to the next module |
  | `/exercise` | Get a new practice exercise |
  | `/hint` | Get a hint (won't give the answer!) |
  | `/progress` | See your progress dashboard |
  | `/help` | See all available commands |

- "Just type the command (e.g. `/hint`) and press Enter."
- After the table, mention there are more commands: "There are more commands beyond these — like `/add-video` to integrate a YouTube tutorial into your course, `/challenge` for harder exercises, or `/explain-differently` to hear a concept taught in a different style. Type `/help` to see the full list."

Jump straight into teaching Module 1.

### If completedModules > 0 (returning learner):

- "You've completed **[progress.completed_modules]** of **[progress.total_modules]** modules"
- "Last session: **[progress.last_session]**"
- "Current streak: **[progress.current_streak_days]** days"
- "You're on Module **[currentModule.module_number]**: **[currentModule.title]**"
- If in-progress exercise found: "You were working on exercise: **[exercise name]**"

## Step 3: Quick Recap (returning learners only)

Brief recap of last completed module (2-3 sentences):
- What they learned
- Key concepts covered
- How it connects to next module

Ask: "Ready to continue with [next module], or review [last module] first?"

## Step 4: Resume Teaching

Read `.claude/skills/learn-anything/workflows/teach.md` and follow the teaching loop from Step 1.

If learner's skill seems changed since last session:
- Re-calibrate with a quick question about last module's topic
- Adjust pacing accordingly
- Note adjustment in progress.md

</process>

<success_criteria>
- Workspace verified before loading course
- Correctly found and loaded existing course progress from metadata
- First-session learners get welcome with command introduction
- Returning learners get accurate progress summary
- Provided concise recap without re-teaching (returning only)
- Resumed at correct module with appropriate difficulty
- Maintained consistency with original course settings
- Progress continues to be tracked and saved
- If modeIsTemporary was true, mode restored to permanentMode before any teaching begins
- Pre-Phase 4 courses without permanentMode are auto-migrated on load
</success_criteria>
