---
name: ref-ollama
description: Reference for Ollama — run open LLMs (Llama, Mistral, Qwen, Gemma, Phi) locally. Use when the user asks about running local models, offline inference, `ollama run/pull/serve`, the local model API on port 11434, or picking/quantizing local models.
---
# Ollama (reference)
Local runtime for open-weight LLMs. Pulls quantized GGUF models and serves an OpenAI-compatible API.
- **Install:** `curl -fsSL https://ollama.com/install.sh | sh` (Linux), or download for macOS/Windows. Docker: `ollama/ollama`.
- **Core:** `ollama pull llama3.2` · `ollama run qwen2.5` · `ollama list` · `ollama serve` (API at `http://localhost:11434`).
- **API:** `POST /api/generate` and `/api/chat`; OpenAI-compatible at `/v1`. Modelfiles customize system prompts/params.
- **Use when:** offline/private inference, cheap local dev, embedding generation, or as a backend for open-webui/langflow.
