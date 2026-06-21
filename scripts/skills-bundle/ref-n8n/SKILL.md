---
name: ref-n8n
description: Reference for n8n — fair-code workflow automation with 400+ integrations and native AI/LangChain nodes. Use for questions about building automations, webhooks, cron workflows, connecting apps/APIs, or agentic workflows with a visual editor.
---
# n8n (reference)
Node-based workflow automation (self-hostable). Strong AI nodes (LangChain, agents, vector stores).
- **Install:** `npx n8n` · Docker: `docker run -it --rm -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n` · editor at `http://localhost:5678`.
- **Core:** Trigger node (Webhook/Cron/app event) → action nodes → optional AI Agent node. Credentials stored encrypted.
- **Use when:** glue between SaaS apps, scheduled jobs, human-in-the-loop, or low-code AI pipelines.
