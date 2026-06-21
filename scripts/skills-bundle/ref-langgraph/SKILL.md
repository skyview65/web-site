---
name: ref-langgraph
description: Reference for LangGraph — low-level library for stateful, multi-actor LLM agent workflows modeled as graphs (nodes/edges, persistence, human-in-the-loop). Use when building durable agent state machines, cyclic agent graphs, or LangChain-based orchestration in code.
---
# LangGraph (reference)
Graph-based orchestration for agents: nodes = steps, edges = control flow, with checkpointing and streaming.
- **Install:** `pip install langgraph` (Python) or `npm i @langchain/langgraph` (JS).
- **Core:** define a `StateGraph(State)`, add nodes/conditional edges, `compile()` with a checkpointer for memory; supports interrupts for human-in-the-loop.
- **Use when:** complex, cyclic, or long-running agent control flow that simple chains can't express.
