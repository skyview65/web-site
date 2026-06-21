# Step 1: Create Course Environment + MCP Setup

<required_reading>
None -- this step creates the initial folder structure.
</required_reading>

<process>

Create course folder structure in current working directory:

```bash
mkdir -p [topic-slug]/{curriculum,exercises,research,.claude/commands}
```

Copy local course commands from skill templates:
```bash
cp .claude/skills/learn-anything/templates/commands/*.md [topic-slug]/.claude/commands/
```

**Write `[topic-slug]/.course-state.json`:**
```json
{
  "topic": "[topic]",
  "level": "",
  "style": "",
  "mode": "direct",
  "permanentMode": "direct",
  "modeIsTemporary": false,
  "language": "en",
  "currentModule": 0,
  "totalModules": 0,
  "mcpInstalled": ["youtube-transcript", "context7"],
  "contextUsage": {"lastCheck": 0, "handoffCreated": false}
}
```

**Write `[topic-slug]/.mcp.json` (YouTube transcript MCP + Context7 MCP - installed immediately):**
```json
{
  "mcpServers": {
    "youtube-transcript": {
      "command": "npx",
      "args": ["-y", "@alexspalato/youtube-transcript-mcp"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY:-}"
      }
    }
  }
}
```

Both MCPs are installed now so they're ready when needed -- YouTube for video transcripts, Context7 for official documentation. Context7 works without an API key (rate-limited). Users who want higher limits can set `export CONTEXT7_API_KEY=your-key` in their shell profile. No reload needed yet -- the user will move into this folder next.

**Write `[topic-slug]/.gitignore`:**
```
# MCP server configuration (contains server details and env var references)
.mcp.json

# Environment variables (actual credential values)
.env
.env.*
.env.local

# Credential files
*.key
*.pem
credentials.json

# Claude Code local state
.claude/
```

This protects credentials from accidental git commits. The .gitignore itself is safe to commit. If `.gitignore` already exists (edge case), append these entries rather than overwriting.

**Write `[topic-slug]/CLAUDE.md`:**
```markdown
# [Topic] Learning Course

## Course Context
- Topic: [topic]
- Learner level: [TBD]
- Teaching style: [TBD]
- Learning mode: [TBD]

## Quick Commands

| Command | What it does |
|---------|-------------|
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
| `/settings mode [mode]` | Switch learning mode (direct/socratic/example-first/project-based/speed-run/deep-dive) |
| `/settings [setting value]` | View or change other course settings |
| `/recover` | Reconstruct state from course files |
| `/help` | Show all commands |

## Resume Instructions
VSCode/Cursor: File -> Open Folder -> [topic-slug], then /learn continue
Terminal: cd [topic-slug] && claude, then /learn continue
```

**CRITICAL -- MANDATORY STOP**: After creating the folder, `.mcp.json`, and all files, present this message:

"Course folder created at `[full-path]` with YouTube transcript MCP pre-installed.

**You need to open this folder as your workspace so the MCP and course commands load correctly.**

**Conductor:** Open a new workspace pointing to `[full-path]`
**VSCode/Cursor:** File -> Open Folder -> select `[topic-slug]`
**Terminal:** `cd [full-path] && claude`

Once inside the folder, run **`/learn continue`** to continue setting up your course."

**STOP HERE. Do NOT continue in the current context.**
The user MUST move into the course folder first. The YouTube MCP in `.mcp.json` will only load when Claude Code starts from inside that folder. Without this, video transcripts cannot be fetched later.

**Context Monitoring (MANDATORY):**
After EVERY major step completion, check context usage:
- **>= 50% (100k tokens)**: IMMEDIATELY create HANDOFF.md
- **>= 70% (140k tokens)**: STOP ALL WORK. Create HANDOFF.md. Refuse to continue.

</process>

<success_criteria>
- Course folder created with proper structure (.claude/commands/, curriculum/, exercises/, research/)
- Template commands copied from skill templates to course folder
- .course-state.json initialized with correct defaults
- .mcp.json written with YouTube transcript MCP and Context7 MCP
- .gitignore written protecting .mcp.json, .env, credentials, and .claude/
- Context7 MCP configured in .mcp.json with env var reference for optional API key
- CLAUDE.md written with course context and commands table
- User asked to move into course folder before proceeding (MANDATORY STOP)
</success_criteria>

<error_recovery>
If file writes fail, inform the user and suggest checking disk space or permissions.
</error_recovery>
