# Task Creation Skill
#claudeai

## Purpose
Transform meeting action items into properly contextualized Notion tasks with full metadata.

## Input
Action items from `meetings.md` output - each should have:
- The action item text
- Apparent owner (from meeting context)
- Source meeting (title, date, attendees)

## Context: Work Ownership Map

**Team structure and ownership**: See `_meta/protocols/work.md`

Quick reference for task routing:
- Client-specific AORs:
	- Daniela
		- BigInterview
		- BlueLight IT
		- Datafy
		- Oddit
		- QCK
	- Saumya
		- Chris Carter / Mugatu AI
		- Certairus
		- Notis
		- Tacoma
- Strategy/client relationships → Trevor
- CrowdTamers Marketing (internal marketing tasks)
	- Trevor

## Notion Task Database

**Database ID**: `5e099cb7-78b1-4d59-b0e5-3a1cd3b36640`

### Required Fields
- **Name** (title): Clear, actionable task title
- **Assignee** (people): Based on ownership map above
- **Due Date** (date): Estimate from meeting context or default rules
- **Sprint** (select): Current sprint [TODO: How are sprints determined?]
- **Project** (relation): Link to relevant project/client
- **Status** (status): "Not Started" for new tasks
- **Priority** (select): High/Medium/Low based on context
- **Estimation** (select): Small/Medium/Large

### Optional but Valuable
- **Description** (rich_text): Context from meeting
- **Source Meeting** (rich_text): Link back to which meeting generated this

## Process

### Step 1: Parse Each Action Item
For each action item from meetings output:
- Extract the core task
- Identify the owner (use ownership map)
- Estimate complexity (Small/Medium/Large)
- Determine urgency

### Step 2: Enrich with Context
Add to task description:
- Which meeting this came from
- Who was in the meeting
- Any relevant context that helps the assignee
- Link to full transcript if available

### Step 3: Apply Defaults

**Due Date Logic**:
- If urgency mentioned ("ASAP", "today", "urgent") → Today or tomorrow
- If timeline mentioned ("next week", "by Friday") → Parse that
- If no timeline → Default to [TODO: 3 days? End of sprint?]

**Sprint Logic**:
- [TODO: How do you determine which sprint a task goes into?]

**Priority Logic**:
- Client-facing deliverables → High
- Internal improvements → Medium
- Nice-to-haves → Low

### Step 4: Create in Notion
Use `mcp__notion__API-post-page` or `Notion:notion-create-pages`

## Deduplication

Before creating a task, check if similar task already exists:
- Query Notion for tasks with similar title
- If duplicate found, note it rather than creating duplicate
- If related task exists, consider updating it instead

## Output

For each task created, report:
```
✅ Created: [Task Title]
   Assignee: [Name]
   Due: [Date]
   Sprint: [Sprint]
   Priority: [Level]
   Source: [Meeting name]
```

Also report:
- Total tasks created: X
- Tasks skipped (duplicates): Y
- Tasks needing manual review: Z

## Integration Notes

- This skill receives input from `meetings.md`
- This skill feeds into `calendar.md` (Trevor's tasks need scheduling)
- Only Trevor's tasks flow to calendar building
- Other assignees' tasks are created but not scheduled here
