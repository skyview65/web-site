---
name: ref-langflow
description: Reference for Langflow — visual drag-and-drop builder for LangChain-style LLM pipelines and agents, exportable as an API. Use for questions about prototyping RAG/agent flows visually.
---
# Langflow (reference)
Visual IDE for composing LLM chains/agents from nodes; runs flows as APIs.
- **Install:** `uv pip install langflow && uv run langflow run` (or `pip install langflow && langflow run`) → `http://localhost:7860`. Docker image available.
- **Core:** drag components (LLMs, prompts, retrievers, tools), wire them, test in playground, export/serve as REST.
- **Use when:** rapid visual prototyping of RAG/agent flows before hand-coding.
