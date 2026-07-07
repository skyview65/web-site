# Claude Skills + MCP setup

This repo carries a reproducible installer for a large set of Claude Code **skills**
and a few **MCP servers**. The skills install to `~/.claude/skills` (user-level, so
they're available in every project). Because a hosted/remote container is ephemeral,
re-run the installer after the environment is recycled.

## Install / restore

```bash
bash scripts/install-skills.sh   # ~228 skills -> ~/.claude/skills
bash scripts/setup-mcp.sh        # MCP servers -> user scope (~/.claude.json)
```

`install-skills.sh` is idempotent: it tags the dirs it creates and wipes only those
on re-run, leaving any skills you added yourself untouched.

## What gets installed

- **Bundle** (`scripts/skills-bundle/`, committed): the uploaded skills
  (`billion-dollar-board`, `omni-processor`, plus 25 marketing/business/product
  skills — `hook-engineer`, `seo-intent-analyzer`, `investor-qa-prep-coach`,
  `term-sheet-decoder`, `code-reviewer`, `prd-reviewer`, …) + ~22 `ref-*` app
  cheat-sheets (ollama, n8n, dify, langgraph, crewai, dspy, …).
- **Community collections** (cloned fresh from GitHub at install time): Anthropic's
  official skills (pdf/docx/pptx/xlsx/…), `obra/superpowers`, `kepano/obsidian-skills`,
  `marketingskills`, `claude-seo`, `oh-my-claudecode`, context-engineering skills, and
  a few single-skill repos. Full list + provenance: `scripts/skills-manifest.txt`.

## MCP servers

`context7` and `playwright` ship as plugins (already connected). `setup-mcp.sh` also adds:

| server | key needed | command |
| --- | --- | --- |
| `excel-mcp-server` | no | `uvx excel-mcp-server stdio` |
| `tavily` | **yes** `TAVILY_API_KEY` | `npx -y tavily-mcp@latest` |
| `firecrawl` | **yes** `FIRECRAWL_API_KEY` | `npx -y firecrawl-mcp` |

Set the real keys (the script installs placeholders):

```bash
claude mcp add -s user tavily   -e TAVILY_API_KEY=tvly-xxxx     -- npx -y tavily-mcp@latest
claude mcp add -s user firecrawl -e FIRECRAWL_API_KEY=fc-xxxx   -- npx -y firecrawl-mcp
```

## Pruning

~203 skills is a lot and can dilute skill selection. To remove a group, delete its dirs
from `~/.claude/skills` (e.g. `rm -rf ~/.claude/skills/seo-*`) or trim the `REPOS` list
in `scripts/install-skills.sh` and re-run. Provenance per skill is in the manifest.

## Notes

- Licenses are mostly MIT; Anthropic's skills are Apache-2.0 / source-available; one repo
  (`claude-deep-research-skill`) has no license. Skills are installed locally, not
  redistributed. The manifest records each source.
- `anthropics/claude-code-security-review` is a GitHub Action / `/security-review` command,
  not a `SKILL.md`, so it isn't auto-installed as a skill.
