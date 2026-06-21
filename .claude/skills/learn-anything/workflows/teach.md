# Teach Workflow

<required_reading>
- `references/learning-modes.md` - For mode-specific teaching approach
- `references/socratic-method.md` - For Socratic mode (if active)
- `references/state-update.md` - For multi-file state update checklists
- `templates/exercise.md` - For exercise structure
- `templates/progress.md` - For progress file structure
- `references/metadata-system.md` - For YAML frontmatter in course files
</required_reading>

<process>

## Step 1: Begin Teaching (the core loop)

Read `.course-state.json` to load learner settings (language, level, style, **mode**).

**Inline mode validation:** After reading `.course-state.json`, verify the mode field contains a valid value (one of: direct, socratic, example-first, project-based, speed-run, deep-dive). If the value is unrecognized, default to 'direct' and warn the learner: "**Note:** Unrecognized learning mode `{value}`. Defaulting to direct mode. Use `/settings mode [mode]` to choose a different mode."

Read `references/learning-modes.md`.
If mode is Socratic, also read `references/socratic-method.md`.

**The teaching loop adapts based on the learner's chosen mode.**

For each module:

### 1a: Teach According to Mode

**IMPORTANT: Save module content immediately when delivered!**
- Write module response to `completed/module-{number}.md` as soon as you deliver it
- Use frontmatter with status: "in-progress" (user will mark "completed" with `/done`)
- This lets the user read it properly formatted instead of in the terminal

**Direct mode:**
1. Explain the concept clearly in the chosen teaching style
2. Show a concrete example
3. Save the module content to `completed/module-{number}.md`
4. Move to exercise

**Socratic mode:**
1. Introduce topic area briefly
2. Ask probing questions to guide discovery (see socratic-method.md)
3. Progressive hints if stuck (4 levels)
4. Confirm understanding when learner arrives at the answer

**Example-first mode:**
1. Present a complete, working example with comments
2. Walk through it piece by piece
3. Modify together ("What if we change this?")

**Project-based mode:**
1. Identify next project feature to build
2. Introduce concepts as the project needs them
3. Build incrementally, checkpoint after each feature

**Speed-run mode:**
1. State the concept in 2-3 sentences
2. Show one minimal example
3. "Clear? Any questions?" then move on
4. Skip optional exercises

**Deep-dive mode:**
1. Full context: what, why, history
2. Implementation details and internals
3. Edge cases and gotchas
4. Advanced patterns

**For ALL modes:**
- Use chosen language
- Draw from context7 docs for accuracy
- Progressive disclosure - no information dumps
- Monitor for signs that a mode switch would help

### 1b: Exercise

Read `templates/exercise.md`.

Generate exercise with YAML frontmatter:

```yaml
---
type: exercise
course: [topic-slug]
module: [number]
exercise_id: [descriptive-slug]
exercise_number: [1, 2, 3...]
difficulty: [easy/medium/hard]
points: [10, 20, 30...]
estimated_time: [minutes]
status: not-started
started_date: null
completed_date: null
attempts: 0
best_score: null
time_spent_minutes: 0
feedback_received: false
hints_used: 0
tags:
  - relevant-tags
hands_on: [true/false]
mcp_tools_used: []
---
```

Exercise content:
- If MCP available: hands-on using real tools
- If no MCP: conceptual (describe steps, quiz, explain-something)
- Save to: `exercises/module-[XX]-ex-[XX].md`
- Provide hints on request using progressive strategy

**Track hint usage:** Increment `hints_used` in frontmatter each time learner requests a hint.

### 1c: Evaluate & Adapt
- Evaluate exercise response
- Calculate score (0-100) based on correctness and understanding
- Provide constructive feedback in chosen teaching style

Follow the **Exercise Completion** checklist from `references/state-update.md` to update exercise metadata and progress.

- If struggled: note in progress.md session entry, slow pace for next module
- If excelled: note in progress.md session entry, increase difficulty

### 1d: Module Transition

Follow the **Module Completion** checklist from `references/state-update.md` for module-{N} completion.

- Summarize what was learned
- Preview what's next
- Ask if ready to continue or need break

**CHECK CONTEXT:** After completing every 2-3 modules, assess conversation length. If the conversation has been going for many modules or you notice responses getting slower, create HANDOFF.md. Rough guide: 3+ modules taught in one session usually warrants a handoff check.

## Step 2: Save Progress (after each module)

**Note:** If module completion and exercise completion were already handled via the State Update Checklists in Step 1c/1d, this step only needs to handle session-level updates (session_count, current_streak_days, last_session, totalTimeMinutes) and session entry notes. Do not double-update completedModules or completedExercises.

Read `templates/progress.md`.

**Update all tracking files:**

1. **Update module file** (`curriculum/module-XX.md`):
   ```yaml
   status: completed
   completed_date: 2026-02-07
   ```

2. **Update progress.md** with YAML frontmatter and session notes:
   ```yaml
   ---
   topic: [topic]
   learner_level: [level]
   teaching_style: [style]
   language: [lang]
   total_modules: 12
   completed_modules: 3  # increment
   current_module: 4  # increment
   total_exercises: 36
   completed_exercises: 9  # increment based on exercises done
   total_time_minutes: 195  # increment
   session_count: 4  # increment if new session
   current_streak_days: 3
   last_session: 2026-02-07
   started: 2026-02-05
   status: active
   ---
   ```

   Add session entry:
   - Mark module completed
   - Record struggling areas
   - Record strengths
   - Log session observations
   - Set next module

3. **Update .course-state.json**:
   ```json
   {
     "currentModule": 4,
     "completedModules": 3,
     "completedExercises": 9,
     "lastActivity": "2026-02-07",
     "totalTimeMinutes": 195
   }
   ```

If learner done for now:
- Save all progress files
- Remind: "Continue with `/learn continue` or `cd [topic-slug] && /learn continue`"

## Step 3: Context Handoff (when needed)

**Triggers:**
- After every 2-3 modules, assess conversation length and response speed
- 3+ modules taught in one session (handoff check recommended)
- Learner says "take a break"

Create `HANDOFF.md` with YAML frontmatter:

```yaml
---
generated: 2026-02-07T14:30:00Z
context_usage_tokens: 95000
reason: context-limit  # context-limit / user-break / session-end / construction-complete
session_number: 2
---
```

# [Topic] Course Handoff

**Generated:** [timestamp]
**Context usage:** [X]k / 200k tokens

## Resume Instructions
VSCode/Cursor: File → Open Folder → [path], reload window, /learn continue
Terminal: cd [topic-slug] && /learn continue

## Learner Profile
- Level: [beginner/intermediate/advanced]
- Style: [casual/etc]
- Mode: [direct/socratic/example-first/project-based/speed-run/deep-dive]
- Language: [English/etc]
- Focus: [full A-Z / specific]

## Progress
- Current module: [X] of [Y]
- Last completed: [Module name]
- Current exercise: [name or "none"]

## What We've Covered
[Bullet list of completed modules and key concepts]

## What's Next
[Next module name and description]

## Learner Insights
- Strengths: [what they grasped quickly]
- Struggles: [what they found challenging]
- Pace: [fast/medium/slow]
- Notes: [important observations]

## MCP Status
[List of installed MCPs]

## Teaching Notes
[Context for next instructor - strategies that worked, areas needing scaffolding]
```

Update `.course-state.json`: `contextUsage.handoffCreated: true`

Inform learner: "Context at [X]%. Created HANDOFF.md. To continue: open folder in VSCode/cd to folder, then `/learn continue`"

</process>

<success_criteria>
- Teaching adapts to chosen learning mode
- Exercises saved as individual files with metadata tracking
- Context monitored throughout (handoff at 50%+)
- Progress tracked in multiple files
- Course is resumable via /learn continue
</success_criteria>
