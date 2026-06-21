---
name: ref-promptfoo
description: Reference for promptfoo — CLI/library for testing, evaluating, and red-teaming LLM prompts and apps with assertions and side-by-side comparisons. Use for prompt evals, regression testing, and LLM security/red-team scans.
---
# promptfoo (reference)
Declarative LLM eval + security testing.
- **Install:** `npx promptfoo@latest init` then `npx promptfoo eval`; view with `npx promptfoo view`.
- **Core:** `promptfooconfig.yaml` defines `prompts`, `providers`, `tests` (with `assert` checks like `contains`, `llm-rubric`, `javascript`). `promptfoo redteam` runs adversarial scans.
- **Use when:** comparing prompts/models objectively, CI regression gates, or red-teaming an LLM feature.
