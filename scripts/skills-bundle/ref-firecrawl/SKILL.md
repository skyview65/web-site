---
name: ref-firecrawl
description: Reference for Firecrawl — API/SDK that turns websites into clean LLM-ready markdown via scrape, crawl, map, and extract. Use for web scraping, crawling whole sites, or structured web extraction for RAG. (Also available as an MCP server.)
---
# Firecrawl (reference)
Web data API for LLMs: `/scrape` (single page→markdown), `/crawl` (whole site), `/map` (URLs), `/extract` (schema-based).
- **Install:** `pip install firecrawl-py` or `npm i @mendable/firecrawl-js`; set `FIRECRAWL_API_KEY`. Self-host option in the repo.
- **Core:** `firecrawl.scrape(url, formats=["markdown"])`; `crawl_url(url, limit=...)`; `extract([urls], schema=...)`.
- **Use when:** building RAG corpora, monitoring sites, or extracting structured data. Prefer the MCP server inside Claude.
