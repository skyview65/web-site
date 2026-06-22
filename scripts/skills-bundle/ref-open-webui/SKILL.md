---
name: ref-open-webui
description: Reference for Open WebUI — self-hosted ChatGPT-style web interface for Ollama and any OpenAI-compatible API. Use for questions about a local chat UI, RAG over documents, model management UI, or self-hosting an LLM frontend.
---
# Open WebUI (reference)
Feature-rich, self-hosted web UI for LLMs (works with Ollama or OpenAI-compatible endpoints). Supports RAG, multi-model chat, users/roles.
- **Install:** `docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data ghcr.io/open-webui/open-webui:main`
- **Connect:** point it at Ollama (`http://host.docker.internal:11434`) or set `OPENAI_API_BASE_URL`.
- **Use when:** you want a polished local chat front-end, document RAG, or to share a local model with a team.
