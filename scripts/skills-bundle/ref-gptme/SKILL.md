---
name: ref-gptme
description: Reference for gptme — small personal AI agent in the terminal that can run shell commands, edit files, browse, and use Python, model-agnostic. Use for a lightweight local coding/automation agent.
---
# gptme (reference)
Minimal, hackable terminal agent with shell/file/python/browser tools.
- **Install:** `pipx install gptme` (or `uvx gptme`). Set a provider key (OpenAI/Anthropic/Ollama/local).
- **Core:** `gptme "task"` runs an agentic loop with tool use; `--model` selects backend; supports custom tools and non-interactive scripting.
- **Use when:** you want a tiny, transparent CLI agent you can pipe into scripts.
