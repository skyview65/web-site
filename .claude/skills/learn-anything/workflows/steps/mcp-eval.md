# Step 4: MCP Recommendation & Install

<required_reading>
None -- MCP evaluation uses web search and GitHub analysis, not reference files.
</required_reading>

<process>

### 4a: Evaluate Each MCP Thoroughly

For each MCP found in Step 3, WebFetch GitHub repo and extract:
- **GitHub stars** (community trust), **last updated** (maintenance), **features** (tools/docs provided)
- **API keys** (required? optional? how to get?), **documentation value** (reference material for teaching?)

**Critical Analysis Questions:**
1. What documentation/reference does it provide? Be specific: "1,084 node docs" not "has docs"
2. How would I use this for teaching? Concrete examples: "Query node docs while explaining concepts"
3. Does it enable learning or just automate? MCPs providing reference material without doing work = ideal
4. Setup complexity? Simple (npx), Moderate (optional keys), Complex (mandatory keys, paid accounts)

**Red Flags (consider NOT installing):**
- Pure automation ("describe workflow, I'll build it")
- Complex external setup required
- Poorly maintained (6+ months no updates)
- No documentation value

### 4b: Make Recommendation

Present to learner:
"Found [X] tools for hands-on learning:

**[MCP Name]** ([stars] stars)
- What it does: [one sentence]
- Documentation value: [HIGH/MEDIUM/LOW - what docs it provides]
- Learning value: [enables learning vs just automates]
- Setup: [simple/moderate/complex]
- Would enable: [specific benefits]

I recommend installing [MCP name]: [clear reasoning]"

Default to "install" unless complex setup or pure automation.

### 4c: Get Full Configuration

After user approves, WebFetch the GitHub repo to extract:
1. All environment variables (required AND optional) and what each does
2. How to obtain values (URLs, API keys, tokens)
3. Different operating modes (if applicable)

**Credentials Instructions:**
- Assume the user has an existing account/instance
- Focus on: Where to find credentials in their existing account
- Provide exact navigation paths (e.g., "Settings -> API -> Create API Key")
- DO NOT explain how to install/deploy services

Present configuration with available modes, what each enables, and what credentials are needed. Ask: "Which mode do you want? Mode 1: Start learning now. Mode 2: Full experience (requires setup)."

### 4d: Install with Configuration

**SECURITY RULE: NEVER ask users to paste API keys, tokens, or credentials in chat.**

Instead:
1. Write the config file with ${ENV_VAR} references (never inline values)
2. Tell user to set the environment variable in their shell profile
3. Credentials stay in the shell environment, never in project files

Based on user choice, add to existing `.mcp.json` (which already has youtube-transcript):

**Minimal mode:** Add complete working configuration with no placeholders.

**Full mode (requires credentials):** Add to `.mcp.json` with env var references:
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
    },
    "[mcp-name]": {
      "command": "npx",
      "args": ["-y", "[package-name]"],
      "env": {
        "[ENV_VAR]": "${[ENV_VAR_NAME]}"
      }
    }
  }
}
```

Provide environment variable setup instructions:
"Added [MCP] to `.mcp.json` with environment variable references.

**To configure credentials:**
1. Set the environment variable in your shell:
   `export [ENV_VAR_NAME]=your-actual-value`

   Or add it to your shell profile for persistence:
   `echo 'export [ENV_VAR_NAME]=your-actual-value' >> ~/.zshrc`

2. After setting the variable, reload your workspace:
   - Close this window/terminal
   - Reopen and run `/learn continue`

**Note:** Your actual credentials are stored in your shell environment, not in any project file. The `.mcp.json` file only contains a reference (`${[ENV_VAR_NAME]}`) that Claude Code resolves at startup."

Update `.course-state.json`: add new MCP to `mcpInstalled` array.

**STOP and wait for user to edit and restart.**

**After restart:**
- Verify MCP loaded with ToolSearch
- Test that it works in chosen mode
- If credentials were added, verify they work

**CHECK CONTEXT: If >= 50%, create HANDOFF.md now.**

</process>

<success_criteria>
- MCPs thoroughly evaluated for documentation and learning value
- MCP credentials handled securely (placeholders in file, user edits)
- .course-state.json updated with mcpInstalled
- MCP verified after user restart
</success_criteria>

<error_recovery>
**MCP installation fails:**
Inform learner. Continue without MCP -- switch all exercises to conceptual mode.
Update .course-state.json: set mcpInstalled to empty.
</error_recovery>
