# Daily Scrum Skill
#claudeai

## Purpose
Generate Trevor's daily scrum report for pasting into Notion scrum log.

## Template Format

The daily scrum is simple - just a date header, meetings with times, and tasks with checkboxes:

```
[Day of Week] [Month] [Date]th/st/nd
[x] [Start Time]-[End Time] [Meeting/Event Name]
[x] [Start Time]-[End Time] [Meeting/Event Name]
[x] [Completed task description]
[ ] [Incomplete task description]
```

### Example
```
Tuesday January 20th
[x] 9:00 AM-9:30 AM DAILY CLIENT PLANNING
[x] 9:30 AM-10:00 AM Debloquage / LI comment & replies spam
[x] 11:45 AM-12:30 PM Chris Carter + Mugatuai weekly sync
[x] Ask Chris Carter for Google Ads access
[ ] Send Chris Carter newsletter for Thursday
[ ] Send Cary Prejean testimonials + pricing sheet
```

### Format Rules
- Time format: `[H:MM AM/PM]-[H:MM AM/PM]` (12-hour with AM/PM)
- Checkbox: `[x]` for completed, `[ ]` for incomplete
- Meetings come first (chronological), then tasks
- Tasks extracted from call transcripts go at the bottom
- Keep it simple - no emojis, no headers, no sections

## Process

### Step 1: Get Calendar Events
```
Use: mcp__google_workspace__get_events
Parameters:
  user_google_email: "tlongino@crowdtamers.com"
  calendar_id: "primary"
  time_min: [target date start, RFC3339]
  time_max: [target date end, RFC3339]
```

### Step 2: Get Call Transcripts
Follow `_meta/skills/meetings.md` to pull transcripts from:
- Tactiq (Google Drive folder: `1aVd2r3vJFduad1oc56Hi9AkGvOWRuptC`)
- MeetGeek (Notion backup)

### Step 3: Extract Action Items from Transcripts
Read each transcript and identify:
- Explicit commitments ("I'll...", "We need to...", "Can you...")
- Decisions that require follow-up
- Deadlines mentioned

### Step 4: Ask Trevor Which Tasks Were Completed
**CRITICAL**: Before finalizing the scrum, ask Trevor which tasks he completed that day. Don't assume all meetings = completed or all tasks = incomplete.

### Step 5: Format and Present
- Format meetings chronologically with times
- Add tasks below meetings
- Mark completed items `[x]`, incomplete `[ ]`
- Present as copyable text block

## Problems Encountered (2026-01-20)

### 1. Wrong Day of Week
**Issue**: Called Monday January 19th "Sunday" - didn't verify the actual day of week for 2026.
**Fix**: Always verify day of week. January 1, 2026 is a Thursday, so count forward or use a calendar check.

### 2. Used Wrong Format Initially
**Issue**: First attempt used a Slack-style format with emojis, headers, and sections (🌅, ✅, 📅, etc.) based on `publishagenda.md`.
**Fix**: Trevor's actual scrum format is much simpler - just checkboxes and times. The `publishagenda.md` format is for Slack posting, not for the Notion scrum log.

### 3. Didn't Ask About Task Completion
**Issue**: Formatted all tasks as incomplete `[ ]` without asking Trevor which ones he'd done.
**Fix**: Always ask "Which tasks did you complete today?" before finalizing the scrum.

### 4. Format Confusion Between Files
**Issue**: `makeagenda.md` and `publishagenda.md` describe more complex formats for automated systems. Trevor's manual scrum paste is simpler.
**Fix**: This skill file (`daily-scrum.md`) is now the authoritative source for the manual paste format.

## Related Files
- `_meta/skills/meetings.md` - How to find and process call transcripts
- `_meta/claude-outputs/AI Tasks & Prompts/makeagenda.md` - Automated agenda system (different format)
- `_meta/claude-outputs/AI Tasks & Prompts/publishagenda.md` - Slack posting format (different format)

## Destination
**Notion**: Trevor's Scrums → [Current Month] page
- Page: https://www.notion.so/crowdtamers/Trevor-s-Scrums-0b86399820ef4484a490341529d43220
- January 2026 page ID: `2e7f778746cb81249204e4ed4732c254`

## Version
Created: 2026-01-20
