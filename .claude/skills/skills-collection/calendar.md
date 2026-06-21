# Calendar Building Skill
#claudeai

## Purpose
Build Trevor's day - match tasks to available time, apply strategic thinking, and provide amanuensis insights.

## Input
- Tasks assigned to Trevor (from `tasks.md` output + existing Notion tasks due today/overdue)
- Today's calendar (meetings already scheduled)
- Context from `_meta/amanuensis.md` and `_meta/protocols/work.md`

## Trevor's Work Hours

**Available Blocks**:
- Early Morning: 5:00 AM - 7:00 AM Eastern (deep work)
- Main Day: 9:00 AM - 4:30 PM Eastern
- Gap: 7:00 AM - 9:00 AM is family time (kids to school)

**Protected Time**:
- Meetings with external attendees (clients, partners)
- FI Mentorship Hours (Wednesday)
- Family commitments flagged in calendar

## Process

### Step 1: Fetch Current Calendar State
```
Use: list_gcal_events
Calendar: primary
Time Range: Today
```

Identify:
- Fixed meetings (can't move)
- Internal meetings (potentially moveable)
- Open time blocks

### Step 2: Gather Trevor's Tasks
Query Notion for:
- Tasks assigned to Trevor
- Due today or overdue
- Status: Not completed

Include tasks just created from meetings processing.

### Step 3: Categorize Tasks by Fit

**Deep Work Tasks** (need 60-90 min uninterrupted):
- Strategy work
- Writing
- Complex analysis
- Best fit: Early morning block or afternoon stretches

**Quick Tasks** (15-30 min):
- Email responses
- Quick reviews
- Status updates
- Best fit: Gaps between meetings

**Collaborative Tasks** (need other people):
- May need to schedule as meetings
- Or batch for async handoff

### Step 4: Match Tasks to Blocks

**Priority Order**:
1. High priority + due today → Must schedule
2. High priority + overdue → Must schedule  
3. Medium priority + due today → Should schedule
4. Everything else → If time permits

**Fit Logic**:
- Don't schedule deep work in 30-min gaps
- Don't waste 90-min blocks on quick tasks
- Leave buffer between meetings (10-15 min)
- Don't overschedule - 6 hours of scheduled work is realistic max

### Step 5: Create Calendar Blocks
For each scheduled task:
```
Use: create_event
Title: "🔗 [Task Title]"
Description: Notion link + context
Duration: Based on task size (Small=30, Medium=60-90, Large=90)
```

## Amanuensis Layer

This is where strategic intelligence gets added. After scheduling, analyze:

### Meeting Load Analysis
Look at the past 2-3 weeks:
- How many meetings per week?
- Which recurring meetings does Trevor attend?
- For each recurring meeting, ask: "Did Trevor need to be in this?"

**Flag for Review**:
- Meetings where Trevor didn't speak much (if transcript shows this)
- Meetings that could be handled by team members
- Meetings that could be async updates instead

**Provide Recommendation**:
```
📊 Meeting Load: X meetings this week (Y hours)

🤔 Consider Delegating:
- [Meeting Name] - [Team member] could handle this
- [Meeting Name] - Could this be an async update?

💡 Observation: You've been in [X] client calls this week. 
   Goal is to transition these to POCs this quarter.
```

### Pattern Insights
Notice and surface:
- "You've had 3 meetings about [topic] - is there a systemic issue?"
- "This is the 4th week in a row with [pattern]"
- "Your deep work time has decreased by X% this month"

### Business Context
Reference `_meta/protocols/work.md`:
- CrowdTamers is at a stability inflection point
- Trevor needs to support scale, not do everything
- Goal: Get client calls into POC hands

## Output Format

### Today's Plan
```markdown
## 📅 [Day, Date]

### Fixed Commitments
- 09:00-09:30: Team Standup
- 11:00-12:00: Client Call - [Name]
- 14:00-14:30: [Meeting]

### Scheduled Work Blocks
- 05:30-07:00: 🔗 [Deep Work Task] - [Priority]
- 09:30-10:30: 🔗 [Task] - [Priority]
- 13:00-13:30: 🔗 [Quick Task] - [Priority]

### Unscheduled (if time permits)
- [Lower priority task]
- [Task that didn't fit]

### Amanuensis Notes
[Strategic observations and recommendations]
```

### Visual Option
If claude-canvas is available, render the day visually:
- Timeline view showing blocks
- Color coding by type (meetings vs. work vs. open)
- Clear indication of protected time

## Error Handling

- If calendar is fully booked: Report honestly, suggest what must move
- If too many high-priority tasks: Flag the conflict, ask Trevor to prioritize
- If no deep work time available: Warn that important work may slip

## Integration Notes

- This skill is the final phase of `/planning`
- Output saves to daily note in Obsidian
- Calendar events created link back to Notion tasks
- Amanuensis insights are for Trevor only (don't publish to team channels)
