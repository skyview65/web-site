---
name: ref-crewai
description: Reference for CrewAI — Python framework for role-playing multi-agent teams (agents, tasks, crews, flows). Use when designing collaborating agents with roles, tools, and sequential/hierarchical processes.
---
# CrewAI (reference)
Standalone (no LangChain dependency) multi-agent orchestration: Agents with roles/goals/tools, Tasks, and a Crew that runs them.
- **Install:** `pip install crewai crewai-tools` · scaffold: `crewai create crew my_crew`.
- **Core:** define `Agent(role, goal, backstory, tools)`, `Task(description, agent, expected_output)`, `Crew(agents, tasks, process=sequential|hierarchical).kickoff()`. `Flow` adds event-driven control.
- **Use when:** you want opinionated, role-based agent collaboration with minimal boilerplate.
