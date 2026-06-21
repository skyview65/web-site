# Generate Exercises Workflow

<required_reading>
- `references/learning-modes.md` - For mode-appropriate evaluation style
- `references/socratic-method.md` - Load only if Socratic mode is active
- `references/metadata-system.md` - For YAML frontmatter on exercise files
- `references/state-update.md` - For multi-file state update checklists
- `templates/exercise.md` - For exercise file structure
- `workflows/teach.md` - For evaluation approach consistency with the teaching loop
</required_reading>

<process>

## Step 1: Identify Context

Determine what exercises to generate:

### If course exists:
1. Read `.course-state.json` and `progress.md`
2. Read `curriculum/INDEX.md`
3. Identify:
   - Current module (exercises for current topic)
   - Struggling areas (targeted practice)
   - Completed modules (review exercises)

### If no course exists:
1. Ask what topic they want to practice
2. Ask about their skill level (use assessment-questions.md patterns)
3. Generate standalone exercises

## Step 2: Determine Exercise Type

Ask or infer what kind of practice they want:

"What kind of practice would help most?
1. **Build something** - Create a real [thing] from scratch
2. **Fix something** - Debug and fix a broken [thing]
3. **Explain something** - Teach back a concept to test understanding
4. **Quiz** - Quick-fire questions to test knowledge
5. **Explore** - Open-ended investigation of a concept
6. **Targeted practice** - Focus on areas where you struggled"

If "targeted practice": read progress.md struggling areas and generate exercises for those concepts.

## Step 3: Generate Exercises

Read `templates/exercise.md` for structure.
Read `references/metadata-system.md` for frontmatter spec.

For each exercise:

1. Create a realistic scenario (not academic toy examples)
2. Write a clear task description
3. Include 3 levels of progressive hints
4. Define evaluation criteria
5. Add reflection questions connecting to broader concepts

**Add YAML frontmatter:**
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

Exercise guidelines:
- If MCP tools available: hands-on exercises using real tools
- If no MCP: conceptual exercises answerable in conversation
- Vary difficulty based on learner level
- Target struggling areas when applicable
- Each exercise teaches one clear concept

Save to: `exercises/[descriptive-name].md`

Present exercises one at a time (not all at once).

## Step 4: Evaluate and Track

After learner attempts each exercise:

1. Evaluate response using exercise criteria
2. Adapt evaluation to the active learning mode from `.course-state.json`:
   - **Direct:** Give clear, straightforward feedback. "Correct" or "Not quite — here's why."
   - **Socratic:** Ask questions about their approach before confirming correctness
   - **Example-first:** Compare their solution to the reference example, highlight differences
   - **Project-based:** Evaluate in context of the project — does it work? What could improve?
   - **Speed-run:** Quick pass/fail with brief explanation if wrong
   - **Deep-dive:** Thorough analysis of correctness, edge cases missed, alternative approaches
3. Provide hints if needed (progressive, never direct answers)
4. Track hint usage: increment `hints_used` in frontmatter

Follow the **Exercise Completion** checklist from `references/state-update.md` to update exercise metadata, .course-state.json, and progress.md.

Additionally in progress.md:
- Update struggling areas (improved or new)
- Update strengths

Offer next exercise or ask if they want to stop.

</process>

<success_criteria>
- Exercises match learner's current level and needs
- Struggling areas specifically targeted when applicable
- Each exercise has realistic context, clear tasks, progressive hints
- Exercises saved as files with YAML frontmatter metadata
- Metadata updated immediately after completion (not batched)
- Evaluation style matches active learning mode
- Progress updated after each exercise
- Exercise types varied (not all same format)
</success_criteria>
