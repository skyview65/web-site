---
name: ref-gpt-researcher
description: Reference for GPT Researcher — autonomous agent that produces cited research reports by planning queries, scraping sources, and synthesizing. Use for deep web research report generation.
---
# GPT Researcher (reference)
Autonomous research agent: generates sub-questions, gathers/scrapes sources, aggregates into a long cited report.
- **Install:** `pip install gpt-researcher` (or run the repo's docker). Set `OPENAI_API_KEY` and a search provider (e.g. `TAVILY_API_KEY`).
- **Core:** `GPTResearcher(query, report_type="research_report")` → `conduct_research()` → `write_report()`.
- **Use when:** you need an end-to-end cited research brief; complements the built-in `deep-research` skill.
