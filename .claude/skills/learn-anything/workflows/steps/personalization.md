# Step 2: Learner Profile

<required_reading>
- `~/.claude/skills/learn-anything/references/teaching-styles.md`
- `~/.claude/skills/learn-anything/references/learning-modes.md`
- `~/.claude/skills/learn-anything/references/assessment-questions.md`
</required_reading>

<process>

**Why before research:** Knowing the learner's level and style determines WHAT to search for -- beginner tutorials vs advanced deep-dives, visual content vs documentation-heavy resources.

Read:
- `~/.claude/skills/learn-anything/references/teaching-styles.md`
- `~/.claude/skills/learn-anything/references/learning-modes.md`
- `~/.claude/skills/learn-anything/references/assessment-questions.md`

Send ONE intake message:

"Before we start, a few quick questions:

**1. Language:** I detected [language]. Teach in [language]? (or specify another)

**2. Teaching style:**
1. ELI5 - [one-sentence topic example]
2. Casual - [one-sentence topic example]
3. Standard - [one-sentence topic example]
4. Academic - [one-sentence topic example]
5. Technical - [one-sentence topic example]

**3. Learning mode:**
1. Direct - I explain, you practice (fast)
2. Socratic - I guide with questions (deeper)
3. Example-first - See it working, then understand why
4. Project-based - Build something real, learn as we go
5. Speed-run - Essentials only, maximum speed
6. Deep-dive - One concept at a time, maximum depth

**4. Your experience with [topic]:** [one natural probing question]

**5. Focus:** Full A-to-Z course, or specific areas? (which?)

**6. Preferred channels/creators:** Any YouTube channels or creators you already follow for [topic]? (optional -- say 'skip' if none)

Pick numbers for style and mode. Answer the rest however you like.
Default if you skip anything: Standard style, Direct mode, comprehensive scope."

If needed, ask 0-1 follow-up assessment question to calibrate level (use assessment-questions.md patterns).

Update `.course-state.json` and `CLAUDE.md` with all settings (language, level, style, mode, focus, scope, preferredChannels).
Code examples, node names, and technical terms stay in English regardless.

**Do NOT proceed to research until language and learner profile are confirmed.**

</process>

<success_criteria>
- Language detected and confirmed
- Teaching style selected
- Learning mode selected
- Experience level assessed
- Focus/scope defined
- Preferred channels asked
- .course-state.json and CLAUDE.md updated with all settings
</success_criteria>

<error_recovery>
**Learner abandons personalization (no response after 2 messages):**
Apply defaults: Direct mode, Standard style, auto-detected language, Beginner level, Comprehensive scope.
</error_recovery>
