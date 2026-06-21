# Meeting Processing Skill
#claudeai

## Purpose
Gather and process meeting transcripts from the last 2 workdays, ensuring no meetings are missed.

## Prerequisites
READ these connectors before proceeding:
- `_meta/connectors/google.md` - For Tactiq transcripts and calendar access
- `_meta/connectors/notion.md` - For MeetGeek recordings

## Data Sources

### Primary: Tactiq Transcripts (Desktop Meetings)
**Folder ID**: `1aVd2r3vJFduad1oc56Hi9AkGvOWRuptC`
**URL**: https://drive.google.com/drive/u/0/folders/1aVd2r3vJFduad1oc56Hi9AkGvOWRuptC
**Format**: Document files with meeting transcripts
**When Used**: Meetings taken on desktop with Chrome (most meetings)

### Secondary: MeetGeek (Mobile/iPad Meetings)
**Location**: Notion - CrowdTamers Home page
**Page ID**: `3039aabb6bc04d0184e3888a8d109183`
**When Used**: Meetings taken on phone or iPad (Tactiq doesn't work there)
**After Processing**: Move to Call Notes Archive (`b1b785ef3181439cb8507059dedc0672`)

### Calendar Reference
**Email**: `tlongino@crowdtamers.com`
**Calendar ID**: primary
**Purpose**: Cross-reference to ensure all meetings have transcripts

## Process

### Step 1: Get Meeting List from Calendar
```
Use: list_gcal_events
Parameters:
  user_google_email: "tlongino@crowdtamers.com"
  calendar_id: "primary"
  time_min: [2 workdays ago, start of day, RFC3339]
  time_max: [today end of day, RFC3339]
```

Filter results to actual meetings:
- Has attendees (not just calendar blocks)
- Duration > 10 minutes (skip quick syncs unless they have content)

### Step 2: Check Tactiq for Each Meeting
```
Use: search_drive_files or google_drive_search
Parameters:
  user_google_email: "tlongino@crowdtamers.com"
  query: "'1aVd2r3vJFduad1oc56Hi9AkGvOWRuptC' in parents"
```

For each calendar meeting:
- Look for matching transcript by date and meeting title
- Note if transcript exists or is missing

### Step 3: Check MeetGeek for Missing Transcripts
For meetings without Tactiq transcripts:
```
Use: Notion:notion-fetch
Parameters:
  id: "3039aabb6bc04d0184e3888a8d109183"
```

Look for recordings matching the missing meetings by date/title.

### Step 4: Process Each Transcript
For each transcript found:
- Extract meeting title, date, attendees
- Identify action items (look for: "I'll", "we need to", "let's", "action:", "TODO:", "can you", "will you")
- Note decisions made
- Flag items that need follow-up
- Identify who said what when relevant to ownership

### Step 5: Archive Processed MeetGeek Recordings
After processing a MeetGeek recording:
```
Move content to Call Notes Archive
Page ID: b1b785ef3181439cb8507059dedc0672
Organize under appropriate toggle by date
```

## Verification Protocol (CRITICAL)

**Before generating any meeting summary or report:**
1. **Re-read the actual transcript** - Do not paraphrase from memory
2. **Quote numbers and specifics directly** - Dollar amounts, dates, metrics must be exact quotes
3. **Verify all details** - Cross-check calendar events against actual tool results
4. **Never fabricate details** - If information isn't in the source, note it as missing

**When Trevor asks for a report combining multiple sources (calendar + transcripts + tasks):**
- List each data source and what was retrieved
- Only report what was actually found in tool results
- Flag any data that couldn't be retrieved
- Never fill gaps with "typical" or assumed information

## Output Format

For each meeting processed:
```markdown
## Meeting: [Title]
**Date**: [Date]
**Attendees**: [List]
**Duration**: [Length]
**Source**: Tactiq / MeetGeek

### Summary
[2-3 sentence summary - QUOTE key details, don't paraphrase]

### Action Items Identified
- [ ] [Action item 1] - Likely owner: [Name based on context]
- [ ] [Action item 2] - Likely owner: [Name]

### Decisions Made
- [Decision 1 - with specific details quoted]
- [Decision 2 - with specific details quoted]

### Follow-up Needed
- [Any items requiring future discussion]

---
```

## Gap Report

At the end, provide:
```markdown
## Meeting Processing Summary

**Date Range**: [Start] to [End]
**Total Meetings in Calendar**: X
**Transcripts Found**: Y
  - Tactiq: A
  - MeetGeek: B
**Missing Transcripts**: Z

### Missing Meetings (no transcript found):
- [Meeting name] - [Date] - [Attendees]
- [Meeting name] - [Date] - [Attendees]

### MeetGeek Recordings Archived: N
```

## Integration Notes

- This skill feeds into `tasks.md` - action items become tasks
- Missing transcripts should be flagged so Trevor knows to check manually
- Don't guess at transcript content - only process what exists
- MeetGeek recordings should be moved to archive after processing to keep inbox clean
- Tactiq is the primary source (desktop meetings), MeetGeek is secondary (mobile)
