---
name: ref-dspy
description: Reference for DSPy — framework for programming (not prompting) LLMs via typed Signatures, Modules, and optimizers that compile/tune prompts and weights. Use when asked about systematic prompt optimization or declarative LLM pipelines.
---
# DSPy (reference)
Declarative self-improving LLM programs: you define behavior with Signatures/Modules; optimizers (e.g. MIPROv2, BootstrapFewShot) tune the prompts.
- **Install:** `pip install dspy`.
- **Core:** `dspy.configure(lm=...)`; `class QA(dspy.Signature)`; `m = dspy.ChainOfThought(QA)`; compile with an optimizer + metric + trainset.
- **Use when:** you want measurable, optimizable pipelines instead of hand-tuned prompt strings.
