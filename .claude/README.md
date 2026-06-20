# Claude Code plugins for this project

`settings.json` declares the plugin marketplaces this project uses and enables a
curated set of plugins. When you trust this repository folder, Claude Code will
prompt you to install the marketplaces and plugins listed below.

## Marketplaces

| Marketplace | Source |
| --- | --- |
| `claude-plugins-official` | `anthropics/claude-plugins-official` (auto-available) |
| `superpowers-marketplace` | `obra/superpowers-marketplace` |

## Enabled plugins

| Plugin | Marketplace | What it does |
| --- | --- | --- |
| `frontend-design` | official | Frontend/UI design workflows |
| `superpowers` | superpowers | Agentic skills framework (TDD, planning, debugging) |
| `code-review` | official | Reviews the current diff for bugs |
| `context7` | official | Up-to-date, version-specific library docs (MCP) |
| `skill-creator` | official | Interactive Agent Skill scaffolding |
| `code-simplifier` | official | Refactors for clarity without changing behavior |
| `playwright` | official | Browser automation / E2E via Playwright (MCP) |
| `claude-md-management` | official | Audits and maintains `CLAUDE.md` project memory |
| `feature-dev` | official | Feature development agents (architect/explorer/reviewer) |
| `security-guidance` | official | Flags common vulnerabilities as code is written |
| `typescript-lsp` | official | TypeScript code intelligence (requires `typescript-language-server`) |
| `ralph-loop` | official | "Ralph" autonomous loop workflow |

## Activate

If a plugin doesn't appear after trusting the folder, run inside Claude Code:

```
/plugin marketplace update claude-plugins-official
/reload-plugins
```

Manage everything interactively with `/plugin`. Note: `typescript-lsp` needs the
`typescript-language-server` binary on your `PATH`.

## MCP servers

`.mcp.json` (repo root) declares project-scoped MCP servers. When you trust this
folder, Claude Code prompts you to enable them. API keys are **not** committed —
they are read from your environment via `${VAR}` expansion, so set them before
use:

| Server | Package | Env var | Get a key |
| --- | --- | --- | --- |
| `firecrawl` | `firecrawl-mcp` | `FIRECRAWL_API_KEY` | https://www.firecrawl.dev/app/api-keys |
| `perplexity` | `@perplexity-ai/mcp-server` | `PERPLEXITY_API_KEY` | https://www.perplexity.ai/account/api/group |
| `glif` | `@glifxyz/glif-mcp-server` | `GLIF_API_TOKEN` | https://glif.app/settings/api-tokens |

Playwright MCP is already provided by the `playwright` plugin above, so it is not
duplicated here.
