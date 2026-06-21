# Add Resource Workflow

Triggered when learner uses `/add-resource <url>` to integrate an article, blog post, or documentation page.

<process>

## Step 1: Fetch Content

- Use WebFetch to retrieve the URL content
- If content unavailable, inform learner

## Step 2: Analyze Content

Create analysis file in `research/` with:
- Content Structure
- Key Concepts
- Practical Examples
- Curriculum Takeaways

Name file: `research/article-[slug].md`

## Step 3: Update Research Notes

- Add entry to `.research-notes.md`

## Step 4: Curriculum Review and Suggestions

Compare article insights against current `curriculum/INDEX.md` and module files. Identify:
- New concepts not yet in curriculum
- Existing modules that could be enriched
- Better examples or analogies to adopt
- New exercises or patterns worth adding

Present specific, actionable curriculum adjustments. Ask learner whether to apply changes. If approved, update relevant module files and INDEX.md.

</process>

<success_criteria>
- Content fetched and analyzed
- Analysis file saved to research/ folder
- Research notes updated
- Curriculum impact assessed with specific suggestions
- Changes only applied after learner approval
</success_criteria>
