#!/usr/bin/env bash
# Register MCP servers at USER scope (~/.claude.json) so they're available in
# every project. Re-runnable: `claude mcp add` overwrites an existing name.
#
# NOTE: context7 and playwright are already provided as plugins in this setup,
# so they are intentionally NOT re-added here.
#
# Key-gated servers are added with PLACEHOLDER keys — replace them, e.g.:
#   claude mcp add -s user tavily -e TAVILY_API_KEY=tvly-xxxx -- npx -y tavily-mcp@latest
set -uo pipefail

add() { echo "+ $*"; claude mcp add -s user "$@" || echo "  (failed: $1)"; }

# --- No API key required ---
# Excel read/write/formulas (Python, via uvx)
add excel-mcp-server -- uvx excel-mcp-server stdio

# --- API key required (replace placeholders, then re-run this line) ---
# Tavily web search
add tavily -e TAVILY_API_KEY=REPLACE_WITH_YOUR_TAVILY_KEY -- npx -y tavily-mcp@latest
# Firecrawl web scraping/crawling
add firecrawl -e FIRECRAWL_API_KEY=REPLACE_WITH_YOUR_FIRECRAWL_KEY -- npx -y firecrawl-mcp
# Framelink Figma MCP (github.com/GLips/Figma-Context-MCP) — pull layout/styles
# from a Figma file into code. Get a key at figma.com > Settings > Personal access tokens.
add figma -e FIGMA_API_KEY=REPLACE_WITH_YOUR_FIGMA_KEY -- npx -y figma-developer-mcp --stdio

# --- Already provided as plugins (do NOT re-add) ---
# playwright (github.com/microsoft/playwright-mcp) ships as a plugin in this setup.
# To register it manually elsewhere: claude mcp add -s user playwright -- npx -y @playwright/mcp@latest

# --- Optional (uncomment to enable) ---
# Markdownify: convert PDFs/images/audio/web -> markdown (build from source, see repo)
#   git clone https://github.com/zcaceres/markdownify-mcp && cd markdownify-mcp && pnpm i && pnpm build
#   claude mcp add -s user markdownify -- node /abs/path/markdownify-mcp/dist/index.js
# Stealth browser (python): add stealth-browser -- uvx stealth-browser-mcp
# Codebase memory: add codebase-memory -- npx -y codebase-memory-mcp

echo ""
echo "== user-scope MCP servers =="
claude mcp list 2>&1 | sed -n '1,40p'
