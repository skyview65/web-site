---
name: ref-unsloth
description: Reference for Unsloth — fast, memory-efficient LLM fine-tuning (LoRA/QLoRA) for Llama, Mistral, Qwen, Gemma, with 2x speed and lower VRAM. Use for questions about fine-tuning or training open models on a single GPU.
---
# Unsloth (reference)
Optimized fine-tuning library (custom Triton kernels) — ~2x faster, big VRAM savings; exports to GGUF/vLLM.
- **Install:** `pip install unsloth`.
- **Core:** `FastLanguageModel.from_pretrained(..., load_in_4bit=True)`; add LoRA adapters; train with TRL `SFTTrainer`; export `save_pretrained_gguf()`.
- **Use when:** fine-tuning an open model on limited GPU; pairs with Ollama/llamafile for serving.
