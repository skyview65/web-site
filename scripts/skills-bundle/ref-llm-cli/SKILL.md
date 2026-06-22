---
name: ref-llm-cli
description: Reference for Simon Willison's `llm` CLI — command-line + Python tool to query many LLMs (remote and local), with plugins, prompt templates, embeddings, and a SQLite log. Use for quick terminal LLM calls, piping, and embeddings.
---
# llm (Simon Willison) (reference)
Lightweight CLI/library for talking to LLMs and storing results in SQLite.
- **Install:** `pipx install llm` (or `uv tool install llm`). Plugins add models (`llm install llm-ollama`, `llm install llm-gemini`).
- **Core:** `llm "prompt"` · `cat file | llm -s "summarize"` · `llm -m gpt-4o ...` · `llm embed` · `llm logs`. Set keys: `llm keys set openai`.
- **Use when:** scriptable one-off prompts, shell pipelines, embeddings, or logging experiments.
