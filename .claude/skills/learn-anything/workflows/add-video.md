# Add Video Workflow

Triggered when learner uses `/add-video <url>` to integrate a new YouTube video into the course.

<required_reading>
@references/transcript-sanitization.md
</required_reading>

<process>

## Step 1: Fetch Transcript

- Use `mcp__youtube-transcript__get_transcript` with the provided URL
- If transcript unavailable, inform learner and suggest alternatives
- **Apply transcript sanitization** (see required_reading) to the fetched transcript before proceeding to analysis.

## Step 2: Deep Analysis

Create detailed analysis file in `research/` following the standard format:
- Content Structure (all topics, in order)
- Key Concepts Explained (with examples from video)
- Specific Techniques/Workflows Demonstrated
- Teaching Methodology & Analogies
- Practical Exercises or Demos
- Tools/Features Mentioned
- Important Quotes & Philosophies
- Key Takeaways for Curriculum

Name file: `research/video-[slug].md`

## Step 3: Update Research Notes

- Add entry to `.research-notes.md` with summary and link to analysis file
- Note how this source complements existing research

## Step 4: Curriculum Review

Compare video insights against current `curriculum/INDEX.md` and module files. Identify:
- New concepts not yet in curriculum
- Existing modules that could be enriched
- Better examples or analogies to adopt
- New exercises or patterns worth adding

## Step 5: Suggest Changes

- Present specific, actionable curriculum adjustments
- Ask learner whether to apply changes
- If approved, update relevant module files and INDEX.md

</process>

<success_criteria>
- Transcript fetched and analyzed in depth
- Transcript sanitized before analysis (sanitization logged if content was stripped)
- Analysis file saved to research/ folder
- Research notes updated with new source
- Curriculum impact assessed with specific suggestions
- Changes only applied after learner approval
</success_criteria>
