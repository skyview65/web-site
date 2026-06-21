# Step 3: Research

<required_reading>
@references/transcript-sanitization.md
</required_reading>

<process>

**IMPORTANT: All research files must be written in the language confirmed in Step 2.**
**IMPORTANT: Tailor research to the learner profile from Step 2:**
- **Beginner** -> beginner-friendly tutorials, introductory videos, getting-started guides
- **Intermediate** -> practical tutorials, real-world use cases, best practices
- **Advanced** -> advanced techniques, architecture patterns, edge cases, expert content
- **Focus areas** -> prioritize sources covering the learner's specific interests

The system always researches ALL resource types (documentation, articles, AND videos). The learner chooses which specific videos to use after seeing what's available.

### Recency Preference

Before launching searches, ask the user:

"How recent should the video tutorials be?
1. **Last month** (fast-moving topics like AI, LLMs)
2. **Last 2-3 months**
3. **Last 6 months**
4. **Last 12 months** (most tech topics)
5. **Any time** (stable topics like SQL, Git basics)

Pick a number, or I'll choose based on how fast [topic] moves."

**Auto-detect if no answer:** Fast-moving topics -> last 2-3 months. Stable topics -> last 12 months.
Store in `.course-state.json` as `"videoRecency": "[selected]"`.

### Phase A: Concurrent Research

**Execute ALL of the following searches in a SINGLE turn using parallel tool calls. Do NOT wait for one group to complete before starting others.**

**MCP Discovery:**
- WebSearch: "[topic] MCP server GitHub"
- Save GitHub URLs for Step 4 evaluation; look for tools that provide documentation

**Official Documentation:**
- context7: `resolve-library-id "[topic]"` -> query docs for key concepts (source of truth)
- WebSearch: "[topic] official documentation guide"

**Learning Paths:**
- LinkUp: "[topic] learning path", "[topic] tutorial roadmap"
- Note common concepts and typical order. DO NOT copy any course structure.

**Video Discovery** (adapt queries to recency window with date terms):
- WebSearch: "[topic] tutorial [recency-adapted date] youtube"
- WebSearch: "best [topic] course [recency-adapted date] youtube"
- WebSearch: "site:youtube.com [topic] tutorial"
- If learner provided preferred channels: WebSearch "site:youtube.com [channel name] [topic]" for each (these get priority, marked "user-preferred")

**Article Discovery:**
- WebSearch: "[topic] tutorial [level] [recency-adapted date]"

After ALL searches complete, consolidate results and proceed to Phase B.

### Phase B: Sequential Processing

**1. Present found videos** -- show ALL found videos (user-preferred first) with clickable links:

"Found these top [topic] tutorials:
[star = from your preferred channels]
1. [star] [Title] - [channel] ([year]) -- [URL]
2. [Title] - [channel] ([year]) -- [URL]
...
Which ones should I analyze? Say numbers, 'all', or skip and I'll analyze all."

**Rules:** User picks specific -> analyze those. User says "all" -> analyze all. No response -> analyze all. Always proceed.

**2. URL verification (MANDATORY)** -- every video MUST have a verified YouTube URL:
1. Use URL from search results
2. If no URL: WebSearch "[exact title]" "[channel]" site:youtube.com
3. If still no URL: WebSearch "[title]" youtube.com/watch
4. After 3 failed attempts: Log the video to `research/dropped-videos.md` and continue to the next video.

**NEVER list a video without a clickable youtube.com URL.**

**Dropped video log format** (`research/dropped-videos.md`):
```
# Dropped Videos
Videos that failed URL verification during research. Logged for manual follow-up.
---
## [Video Title] - [Channel Name]
**Reason:** [why URL verification failed]
**Searches attempted:**
1. `[exact search query 1]`
2. `[exact search query 2]`
3. `[exact search query 3]`
**Original discovery:** [which search result first mentioned this video]
**Topic covered:** [subject for manual follow-up]
---
```

**3. Manual URL recovery** -- if any videos were dropped, present:

"I couldn't verify URLs for [N] video(s):
1. **[Title]** - [Channel] (reason: [reason])
2. ...

If you have the correct YouTube links, paste them here.
Otherwise, say 'skip' to continue with the [M] verified videos."

- If user provides URLs: verify each with WebSearch/WebFetch. If valid, add to verified list, remove from dropped-videos.md, mark as "user-provided". If invalid, inform user, keep in dropped-videos.md.
- If user says "skip" or no response: proceed with verified videos only. Dropped videos remain logged.

**4. Fetch and analyze video transcripts** using the YouTube transcript MCP (installed in Step 1):
- Verify MCP loaded with ToolSearch
- Fetch transcripts for selected videos
- **Apply transcript sanitization** (see required_reading) to each fetched transcript BEFORE analysis. Use ONLY the sanitized version for deep analysis. Log any sanitization actions in the analysis file.
- **DEEP ANALYSIS REQUIRED** for each transcript in `research/`:
  - Complete content structure (all topics, in what order)
  - Key concepts with examples given
  - Specific techniques/workflows demonstrated
  - Teaching methodology and analogies
  - Practical exercises or demos shown
  - Tools/features mentioned, important quotes
  - NOT ENOUGH: Just noting "teaching style" -- must extract ALL substantive content

**5. Ask user for additional resources:** "Have any other videos or articles? Share URLs or say 'no'."
If provided: fetch, analyze deeply, flag as "user-preferred".

**6. Compile research summary**

Create `research/` folder structure:
```
research/
  video-primary-analysis.md | video-[name].md | official-docs-analysis.md
  article-[name].md | mcp-analysis.md
```

Update `.research-notes.md` with links to all analysis files, overview of each source, key takeaways, how sources complement each other, available MCPs and their learning value.

**Save all research to `research/` folder BEFORE any context reset.**

**CHECK CONTEXT: If >= 50% (100k tokens), create HANDOFF.md now.**

</process>

<success_criteria>
- All resource types researched (docs, articles, videos)
- Preferred channels searched first
- Research tailored to learner level
- Video recency preference asked and applied
- Video URLs verified (3-attempt process)
- Dropped videos logged to research/dropped-videos.md with reason and search queries
- User prompted to provide manual URLs for dropped videos
- Deep video analysis with substantive content extraction
- Research saved in structured research/ folder
</success_criteria>

<error_recovery>
**No videos found for the topic:**
Skip video research entirely. Note in research-notes.md. Proceed with docs + web articles.

**context7 doesn't have the library:**
Fall back to WebSearch for official documentation. Use WebFetch to pull key docs directly.

**YouTube transcript MCP fails to load:**
Try fetching via alternative means (WebFetch on transcript services). If fails, use video titles/descriptions only for curriculum inspiration. Never block course creation on transcript availability.

**All videos dropped during verification:**
Inform user that no videos could be verified. Ask if they want to provide URLs manually, search for different videos, or skip video research entirely. Proceed with docs + articles if user chooses to skip.
</error_recovery>
