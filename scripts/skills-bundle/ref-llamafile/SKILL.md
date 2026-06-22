---
name: ref-llamafile
description: Reference for Mozilla llamafile — distribute and run an entire LLM as a single executable file across OSes. Use when asked about single-file/portable local models or running an LLM with no install.
---
# llamafile (reference)
Packages model weights + llama.cpp into one cross-platform executable (via Cosmopolitan libc).
- **Run:** download a `*.llamafile`, `chmod +x model.llamafile`, then `./model.llamafile` (opens a local server + chat UI).
- **Server flags:** `--server --host 0.0.0.0 --port 8080`; OpenAI-compatible endpoints.
- **Use when:** maximum portability, air-gapped demos, or shipping a model to non-technical users.
