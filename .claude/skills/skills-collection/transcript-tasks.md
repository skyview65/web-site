# Transcript Task Extraction Skill
#claudeai

## Purpose
Review the day's call transcripts and extract actionable tasks, formatting them for human review in tomorrow's daily note.

## When This Runs
- **Trigger**: Hammerspoon automation at 10pm Eastern daily
- **Output**: Tasks appended to tomorrow's daily note in `/daily/YYYY-MM-DD.md`

## Input Sources

### Primary: Google Drive Transcript Folders
Check BOTH folders for today's transcripts:

**Tactiq Transcripts**
- **Folder ID**: `1aVd2r3vJFduad1oc56Hi9AkGvOWRuptC`
- **URL**: https://drive.google.com/drive/folders/1aVd2r3vJFduad1oc56Hi9AkGvOWRuptC
- Files are Google Docs with full transcript

**MeetGeek Files**
- **Folder ID**: `190l2B9O_NjB8OhfeAiXFTC4kgLW5Y4dt`
- **URL**: https://drive.google.com/drive/folders/190l2B9O_NjB8OhfeAiXFTC4kgLW5Y4dt
- Each call creates a subfolder with date/time in name
- Inside subfolder: "Meeting Notes: [Call Title]" Google Doc
- MeetGeek docs include a summary section at the top - use this for quick context

**Note**: The same call may appear in both Tactiq and MeetGeek. Deduplicate by call title/date before extracting tasks.

### Fallback: Notion Call Transcripts
- Check under Meeting Notes section if Drive is inaccessible

## Process

### Step 1: Find Today's Transcripts
Query Google Drive for files in the Tactiq folder modified today:
```
'1aVd2r3vJFduad1oc56Hi9AkGvOWRuptC' in parents and modifiedTime > 'YYYY-MM-DDT00:00:00'
```

### Step 2: Read Each Transcript
For each transcript found:
- Note the meeting title and attendees
- Read the full content
- Look for action items, commitments, deadlines, and follow-ups

### Step 3: Extract Tasks
For each potential task, determine:

**TASKNAME**: Clear, actionable title (verb + object)

**PROJECT**: Match to active client from this list:
- BigInterview
- BlueLight IT
- Datafy
- Oddit
- QCK
- Chris Carter / Mugatu AI
- Certairus
- Notis
- Tacoma
- CrowdTamers (internal)
- If unclear, mark as "NEEDS PROJECT"

**SPRINT**: The Monday of the week the task is due
- Format: `YYYY-MM-DD` (always a Monday)
- If no deadline mentioned, use next Monday

**ASSIGNEE**: Based on ownership map:
- Trevor Longino: Strategy, client relationships, sales, interviews
- Daniela Febres Cordero: BigInterview, BlueLight IT, Datafy, Oddit, QCK
- Saumya Sharma: Chris Carter, Certairus, Notis, Tacoma, reporting
- If unclear from context, assign to Trevor for routing

**DUE DATE**: 
- Parse explicit deadlines ("by Friday", "next week", "ASAP")
- If no deadline, default to end of current sprint (Friday)
- Format: `YYYY-MM-DD`

**SIZE**:
- Small: < 30 minutes
- Medium: 30-90 minutes
- Large: 90+ minutes (may need multiple blocks)

**DESCRIPTION**: 
- Context from the meeting
- Who requested it
- Any relevant details that help the assignee
- Source meeting name and date

### Step 4: Format Output

Create a section in tomorrow's daily note:

```markdown
## Tasks from Calls (AI Extracted - Needs Review)

### From: [Meeting Title] - [Date]

**[Task Name]**
Project: [Project Name]
Sprint: [YYYY-MM-DD]
Assignee: [Full Name]
Due Date: [YYYY-MM-DD]
Size: [Small/Medium/Large]
Description: [Context and details from meeting]

---

```

### Step 5: Write to Daily Note
- Calculate tomorrow's date
- Check if `/daily/YYYY-MM-DD.md` exists
  - If yes: Append the tasks section
  - If no: Create the file with tasks section
- Confirm write was successful

## Task Extraction Patterns

Look for these signals in transcripts:

**Explicit assignments**:
- "Trevor will..."
- "Can you [do X]?"
- "Let's make sure we [do Y]"
- "Action item: ..."
- "TODO: ..."

**Implicit commitments**:
- "I'll follow up on..."
- "We need to..."
- "Don't forget to..."
- "Next steps are..."

**Deadlines**:
- "by [day/date]"
- "before the next call"
- "ASAP" / "urgent"
- "this week" / "next week"

## Common Spelling Corrections

Transcription software often misspells:
- "QCK" → may appear as "quick", "QC", "cue see kay"
- "Datafy" → may appear as "data fie", "data fi"
- "Certairus" → may appear as "sir taurus", "certaurus"
- "Oddit" → may appear as "odd it", "audit"

## Error Handling

If no transcripts found for today:
- Write to daily note: "No call transcripts found for [date]"

If Google Drive inaccessible:
- Try Notion fallback
- If both fail, write error to daily note

If task extraction uncertain:
- Include the task but add "⚠️ UNCERTAIN" prefix to description
- Include the raw quote that triggered extraction

## Output Confirmation

After writing to daily note, log:
```
✅ Transcript review complete for [date]
   Transcripts processed: X
   Tasks extracted: Y
   Written to: /daily/[tomorrow-date].md
```

## Integration Notes

- This skill runs standalone via Hammerspoon automation
- Human reviews output in morning, then uses `tasks.md` skill to create in Notion
- Once accuracy > 95%, this can be modified to create tasks directly
