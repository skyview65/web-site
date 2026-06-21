# State Update Checklists

Reference for multi-file state updates. All workflows that update course state across multiple files MUST follow these checklists to ensure consistency.

**Key principle:** Write source-of-truth files FIRST (module/exercise frontmatter), derived views SECOND (INDEX.md), aggregates THIRD (.course-state.json, progress.md). If any write fails, the source-of-truth files are already correct and the recovery workflow can reconstruct aggregates.

## Checklist: Module Completion

**Files to update (in order):**
1. `curriculum/module-{N}.md` frontmatter (status: completed, completed_date)
2. `curriculum/INDEX.md` (status label for module N)
3. `.course-state.json` (currentModule, completedModules, lastActivity)
4. `progress.md` frontmatter (completed_modules, current_module) + session entry

**Procedure:**
1. Read all 4 files BEFORE making any changes (snapshot current state)
2. Write file 1: module frontmatter -- set status: completed, completed_date: [today YYYY-MM-DD]
3. Write file 2: INDEX.md -- find the line for Module {N} and change status label to "completed"
4. Write file 3: .course-state.json -- increment completedModules, set currentModule to {N+1}, update lastActivity
5. Write file 4: progress.md -- increment completed_modules, set current_module to {N+1}, add session entry

**Verification (fast path):** Re-read .course-state.json and confirm completedModules matches expected value.

**If verification fails:**
1. Re-read all 4 files to determine which writes succeeded
2. Attempt the failed write(s) ONE more time
3. If retry fails: inform learner which files updated and which did not
4. Suggest: "Run /recover to reconstruct state from your course files"
5. DO NOT silently continue with inconsistent state

## Checklist: Exercise Completion

**Files to update (in order):**
1. `exercises/module-{M}-ex-{N}.md` frontmatter (status, completed_date, attempts, best_score, time_spent_minutes, feedback_received)
2. `.course-state.json` (completedExercises, totalTimeMinutes, lastActivity)
3. `progress.md` (completed_exercises, session notes)

**Procedure:**
1. Read all 3 files BEFORE making any changes
2. Write file 1: exercise frontmatter -- set status: completed, completed_date, increment attempts, update best_score (max of current and previous), set time_spent_minutes, feedback_received: true
3. Write file 2: .course-state.json -- increment completedExercises, add time to totalTimeMinutes, update lastActivity
4. Write file 3: progress.md -- increment completed_exercises, add exercise completion note to session entry

**Verification (fast path):** Re-read .course-state.json and confirm completedExercises matches expected value.

**If verification fails:** Same recovery procedure as Module Completion.

## When to Use Each Checklist

| Trigger | Checklist | Called From |
|---------|-----------|------------|
| Learner completes a module (/done) | Module Completion | workflows/mark-complete.md |
| Teaching loop completes a module (Step 1d) | Module Completion | workflows/teach.md |
| Exercise evaluated and scored | Exercise Completion | workflows/teach.md, workflows/generate-exercises.md |

## INDEX.md Update Format

Module lines in INDEX.md follow this format:
`{N}. Module {N}: [Title] -- [status] -- [time] min`

When updating status, find the line starting with `{N}.` and replace the status token between the two `--` delimiters. If the line cannot be found or parsed, log a warning but do NOT fail the entire update -- INDEX.md is a derived view and can be regenerated.
