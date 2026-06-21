# Step 6: Show Commands + Send to New Window

**This step is ALWAYS executed. Never skip it.**

<required_reading>
None -- this step uses data already in the course folder.
</required_reading>

<process>

The construction phase is now complete. Everything before this point (research, MCP setup, video analysis, curriculum generation) was setup work.

1. **Update HANDOFF.md** with full current state (see `workflows/teach.md` Step 3 format), with `reason: construction-complete`

2. **Present the full transition message with ALL commands:**

"Your course is ready! Here's what was built:

**[X] modules** covering [scope description]
**[X] video sources** analyzed and integrated _(if applicable)_
**[X] MCP tools** installed for hands-on practice
**Research folder** with [X] analysis files

---

**Your course folder:** `[full-path]`

**All available commands:**

| Command | What it does |
|---------|-------------|
| `/learn continue` | Resume your course from where you left off |
| `/next` | Continue to the next module |
| `/exercise` | New exercise for current module |
| `/hint` | Progressive hint (not the answer!) |
| `/progress` | Progress dashboard |
| `/recap` | Quick recap of last module |
| `/review [module]` | Quiz on completed module |
| `/challenge` | Harder exercise combining modules |
| `/explain-differently [style]` | Same concept, different style |
| `/add-video <url>` | Add a YouTube video and integrate its insights |
| `/add-resource <url>` | Add an article/docs URL to course research |
| `/settings mode [mode]` | Switch learning mode |
| `/settings [setting value]` | View or change course settings |
| `/help` | Show all commands |

---

**To start learning, open a fresh window:**

**Conductor:** Open a new workspace pointing to `[full-path]`
**VSCode/Cursor:** Open a new window -> File -> Open Folder -> `[topic-slug]`
**Terminal:** Open a new terminal -> `cd [full-path] && claude`

Then run **`/learn continue`** to begin Module 1.

A fresh window gives you a clean learning experience without all the setup context taking up space. See you there!"

**STOP. Do not begin teaching in this context. The learner must start fresh.**

</process>

<success_criteria>
- HANDOFF.md updated with construction-complete state
- Full commands table displayed to user
- User instructed to open new window
- Course is resumable via /learn continue
</success_criteria>

<error_recovery>
This step is mandatory and must always execute. If previous steps failed partially, still present whatever was built and provide the transition instructions.
</error_recovery>
