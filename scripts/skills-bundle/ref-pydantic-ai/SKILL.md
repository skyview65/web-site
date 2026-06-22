---
name: ref-pydantic-ai
description: Reference for Pydantic AI — type-safe Python agent framework with structured outputs, tools, and dependency injection from the Pydantic team. Use for building typed agents with validated outputs.
---
# Pydantic AI (reference)
Agent framework emphasizing type safety and validated structured outputs.
- **Install:** `pip install pydantic-ai`.
- **Core:** `agent = Agent('openai:gpt-4o', output_type=MyModel, system_prompt=...)`; `@agent.tool` for tools; `agent.run_sync(prompt)` returns a validated result. Supports streaming and DI of dependencies.
- **Use when:** you need reliable structured outputs and a clean, typed agent API.
