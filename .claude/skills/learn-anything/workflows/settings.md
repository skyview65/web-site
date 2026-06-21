# Settings Workflow

Triggered when learner uses `/settings [setting value]`.

<process>

## If No Arguments -- Display Current Settings

1. Read `.course-state.json` and `CLAUDE.md`
2. Show all current settings:
   - Teaching style
   - Learning mode (and whether a temporary switch is active)
   - Level
   - Language
   - Focus areas
   - Scope
   - Video recency preference
3. Ask what to change

## If Arguments Provided -- Apply Change

1. Parse the setting and value (e.g., "style technical", "language fr")
2. Validate the value against allowed options
3. Apply the change using the appropriate path below
4. Confirm the change

**Valid settings:**
- `mode <direct|socratic|example-first|project-based|speed-run|deep-dive>`
- `style <eli5|casual|standard|academic|technical>`
- `level <beginner|intermediate|advanced>`
- `language <ISO code>` (e.g., en, fr, es, de)
- `recency <last-month|2-3-months|6-months|12-months|any>`

### Mode Switch: Permanent (via `/settings mode X`)

The `/settings mode X` command is ALWAYS a permanent switch. When the learner explicitly requests a mode change via `/settings`:

1. Validate the new mode against allowed values: direct, socratic, example-first, project-based, speed-run, deep-dive
2. Record the old mode for logging
3. Update `.course-state.json`:
   - Set `mode` to the new value
   - Set `permanentMode` to the new value
   - Set `modeIsTemporary` to `false`
4. Update `CLAUDE.md` "Learning mode" line to reflect the new mode
5. Log in `progress.md`: "**Mode changed (permanent):** [old mode] -> [new mode]"
6. Briefly demonstrate the new mode applied to the current topic (2-3 sentences showing how teaching will differ)

### Mode Switch: Temporary (instructor-initiated during teaching)

Temporary switches are ONLY initiated by the instructor (Claude) during teaching when it detects a pedagogical reason to switch modes. The learner does NOT trigger these via `/settings`.

1. Update `.course-state.json`:
   - Set `mode` to the new value
   - Keep `permanentMode` unchanged
   - Set `modeIsTemporary` to `true`
2. Log in `progress.md`: "**Mode switch (temporary):** [permanentMode] -> [new mode] (for [reason])"
3. Continue teaching in the new mode

**When the temporary switch ends** (instructor decides the pedagogical reason is satisfied, or the learner asks to go back):

1. Record the temporary mode for logging
2. Update `.course-state.json`:
   - Set `mode` to the value of `permanentMode`
   - Set `modeIsTemporary` to `false`
3. Log in `progress.md`: "**Mode restored:** [temporary mode] -> [permanentMode]"
4. Continue teaching in the restored permanent mode

### Other Settings (style, level, language, recency)

1. Update `.course-state.json` with the new value
2. Update `CLAUDE.md` with the new value
3. Confirm the change

**If style changed:** Briefly demonstrate the new style with a sample explanation from the current module.

</process>

<success_criteria>
- Settings displayed accurately when no arguments given
- Setting changes validated against allowed values
- Both .course-state.json and CLAUDE.md updated consistently
- Mode switches distinguish permanent from temporary and update all three fields in .course-state.json (mode, permanentMode, modeIsTemporary)
- Permanent switch (via /settings mode X) sets mode and permanentMode to the new value and modeIsTemporary to false
- Temporary switch (instructor-initiated) sets mode to new value, keeps permanentMode unchanged, sets modeIsTemporary to true
- Mode/style changes demonstrated with a brief example
</success_criteria>
