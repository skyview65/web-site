# YAML Frontmatter Metadata System

## Overview

All course files (curriculum modules, exercises, progress tracking) use YAML frontmatter for structured metadata. This enables:

- Easy searching and filtering of content
- Progress tracking and analytics
- Resume functionality across sessions
- Human-readable and machine-parseable format
- No database dependencies - just markdown files

## File Types and Metadata

### 1. Course State (`.course-state.json`)

**Purpose:** Main course configuration and state tracking.

```json
{
  "topic": "React Hooks",
  "level": "intermediate",
  "style": "casual",
  "language": "fr",
  "currentModule": 3,
  "totalModules": 12,
  "mcpInstalled": ["context7", "youtube-transcript"],
  "contextUsage": {
    "lastCheck": 0,
    "handoffCreated": false
  },
  "started": "2026-02-07",
  "lastActivity": "2026-02-07",
  "totalTimeMinutes": 180,
  "completedModules": 2,
  "completedExercises": 8
}
```

### 2. Curriculum Modules (`curriculum/module-XX.md`)

**Purpose:** Teaching content for each module.
**Validation schema:** See Validation Schemas section below.

```yaml
---
module_number: 3
title: "useState in Depth"
difficulty: beginner
estimated_time: 45
status: in-progress
started_date: 2026-02-07
completed_date: null
review_count: 0
last_review_date: null
last_review_score: null
review_interval_days: 1
review_next_date: null
tags:
  - useState
  - state-management
  - hooks-basics
prerequisites:
  - module-1
  - module-2
next_module: module-4
concepts_covered:
  - local-state
  - useState-hook
  - state-updates
  - re-rendering
exercises_count: 3
hands_on: true
mcp_tools_used:
  - context7
---

# Module 3: useState in Depth

## Learning Objectives
- Understand local state in React
- Master the useState hook
[...]
```

### 3. Exercises (`exercises/module-XX-ex-XX.md`)

**Purpose:** Practice exercises for each module.
**Validation schema:** See Validation Schemas section below.

```yaml
---
type: exercise
course: react-hooks
module: 3
exercise_id: useState-counter
exercise_number: 1
difficulty: easy
points: 10
estimated_time: 15
status: completed
started_date: 2026-02-07
completed_date: 2026-02-07
attempts: 2
best_score: 100
time_spent_minutes: 18
feedback_received: true
hints_used: 1
tags:
  - useState
  - practice
  - interactive
hands_on: true
mcp_tools_used: []
---

# Exercise 3.1: Counter with useState

## Difficulty: ⭐ Easy

## Estimated Time: 15 minutes

## Objectives
- Practice useState basics
- Understand state updates
- Handle button clicks

## Instructions
Create a counter component that...
[...]

## My Solution
[Learner's code here...]

## Feedback
[Claude's feedback here...]
```

### 4. Progress Tracking (`progress.md`)

**Purpose:** Overall learning progress and insights.
**Validation schema:** See Validation Schemas section below.

```yaml
---
topic: react-hooks
learner_level: intermediate
teaching_style: casual
language: fr
total_modules: 12
completed_modules: 3
current_module: 4
total_exercises: 36
completed_exercises: 9
total_time_minutes: 195
session_count: 4
current_streak_days: 3
longest_streak_days: 3
average_score: 87
last_session: 2026-02-07
started: 2026-02-05
status: active
---

# React Hooks - Learning Progress

## Session History

### Session 4 - 2026-02-07
- **Modules completed:** Module 3
- **Exercises completed:** 3.1, 3.2, 3.3
- **Time spent:** 45 minutes
- **Observations:**
  - Strong understanding of useState
  - Struggled initially with state updates
  - Improved significantly after hands-on practice

### Session 3 - 2026-02-06
[...]

## Strengths
- Grasps concepts quickly
- Strong problem-solving skills
- Asks clarifying questions

## Areas for Improvement
- Needs more practice with async state updates
- Should review component lifecycle

## Next Steps
- Start Module 4: useEffect
- Review async patterns before proceeding
```

### 5. Handoff Documents (`HANDOFF.md`)

**Purpose:** Context transfer between sessions/contexts.

```yaml
---
generated: 2026-02-07T14:30:00Z
context_usage_tokens: 95000
reason: context-limit
session_number: 2
---

# React Hooks Course Handoff

**Resume:** Open folder in VSCode, reload window, `/learn continue`

## Learner Profile
- **Level:** intermediate
- **Style:** casual
- **Language:** fr
- **Focus:** full A-to-Z

## Progress
- **Current module:** 4 of 12
- **Last completed:** Module 3 - useState in Depth
- **Current exercise:** none

## What We've Covered
[...]
```

## Validation Schemas

These schema tables define required fields, types, and allowed values for each course file type. Used by validation steps in `continue-course.md` and the recovery workflow in `recover-state.md`.

**Templates:** See `templates/curriculum.md`, `templates/exercise.md`, `templates/progress.md` for file structure examples.

### Module File Schema

| Field | Required | Type | Allowed Values | Default |
|-------|----------|------|----------------|---------|
| module_number | YES | number | positive integer | - |
| title | YES | string | non-empty | - |
| difficulty | YES | enum | beginner, intermediate, advanced | - |
| estimated_time | YES | number | positive integer (minutes) | - |
| status | YES | enum | not-started, in-progress, completed | not-started |
| started_date | NO | string/null | ISO date (YYYY-MM-DD) or null | null |
| completed_date | NO | string/null | ISO date or null | null |
| tags | NO | array | strings | [] |
| prerequisites | NO | array | module IDs | [] |
| next_module | NO | string | module ID | null |
| concepts_covered | NO | array | strings | [] |
| exercises_count | NO | number | non-negative integer | 0 |
| hands_on | NO | boolean | true, false | false |
| mcp_tools_used | NO | array | strings | [] |

### Exercise File Schema

| Field | Required | Type | Allowed Values | Default |
|-------|----------|------|----------------|---------|
| type | YES | string | "exercise" | - |
| course | YES | string | topic slug | - |
| module | YES | number | positive integer | - |
| exercise_id | YES | string | descriptive slug | - |
| exercise_number | YES | number | positive integer | - |
| difficulty | YES | enum | easy, medium, hard | - |
| status | YES | enum | not-started, in-progress, completed | not-started |
| points | NO | number | positive integer | 10 |
| estimated_time | NO | number | positive integer (minutes) | - |
| attempts | NO | number | non-negative integer | 0 |
| best_score | NO | number/null | 0-100 or null | null |
| time_spent_minutes | NO | number | non-negative integer | 0 |
| hints_used | NO | number | non-negative integer | 0 |
| feedback_received | NO | boolean | true, false | false |

### Progress File Schema

| Field | Required | Type | Allowed Values | Default |
|-------|----------|------|----------------|---------|
| topic | YES | string | non-empty | - |
| learner_level | YES | enum | beginner, intermediate, advanced | - |
| teaching_style | YES | enum | eli5, casual, standard, academic, technical | - |
| language | YES | string | ISO language code | - |
| total_modules | YES | number | non-negative integer | - |
| completed_modules | YES | number | non-negative integer | - |
| current_module | YES | number | non-negative integer | - |
| status | YES | enum | active, paused, completed | active |

### .course-state.json Schema

| Field | Required | Type | Allowed Values | Default |
|-------|----------|------|----------------|---------|
| topic | YES | string | non-empty | - |
| level | YES | enum | beginner, intermediate, advanced, "" | "" |
| style | YES | enum | eli5, casual, standard, academic, technical, "" | "" |
| mode | YES | enum | direct, socratic, example-first, project-based, speed-run, deep-dive | direct |
| permanentMode | YES | enum | direct, socratic, example-first, project-based, speed-run, deep-dive | direct |
| modeIsTemporary | YES | boolean | true, false | false |
| language | YES | string | ISO language code | en |
| currentModule | YES | number | non-negative integer | 0 |
| totalModules | YES | number | non-negative integer | 0 |
| completedModules | YES | number | non-negative integer | 0 |
| mcpInstalled | YES | array | strings | [] |

**Validation rules:**
- Validation should be case-insensitive for enum comparisons.
- Unknown fields should be ignored (not rejected).
- Only flag: missing required fields, wrong enum values, wrong types.
- Adopt "warn but continue" for non-critical issues.

## Metadata Fields Reference

### Common Fields (All Files)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | string | Human-readable title | "useState in Depth" |
| `status` | enum | Current status | `not-started`, `in-progress`, `completed` |
| `tags` | array | Searchable keywords | `["useState", "hooks"]` |
| `difficulty` | enum | Difficulty level | `beginner`, `intermediate`, `advanced` |
| `estimated_time` | number | Minutes to complete | `45` |

### Dates

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `started_date` | string | When started (ISO date) | "2026-02-07" |
| `completed_date` | string\|null | When completed | "2026-02-07" or `null` |
| `last_activity` | string | Last interaction | "2026-02-07" |

### Learning-Specific

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `level` | enum | Learner level | `beginner`, `intermediate`, `advanced` |
| `style` | enum | Teaching style | `eli5`, `casual`, `standard`, `academic`, `technical` |
| `language` | string | Teaching language | `"en"`, `"fr"`, `"es"` |
| `hands_on` | boolean | Has hands-on exercises | `true`, `false` |
| `mcp_tools_used` | array | MCP tools used | `["context7", "n8n"]` |

### Progress Tracking

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `attempts` | number | Number of attempts | `2` |
| `best_score` | number | Best score (0-100) | `95` |
| `time_spent_minutes` | number | Actual time spent | `47` |
| `hints_used` | number | Hints requested | `3` |
| `feedback_received` | boolean | Has feedback | `true` |

### Spaced Repetition

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `review_count` | number | Number of reviews completed | `2` |
| `last_review_date` | string | Last review date | "2026-02-07" |
| `last_review_score` | number | Last review score (0-100) | `85` |
| `review_interval_days` | number | Current review interval in days | `7` |
| `review_next_date` | string | Next scheduled review date | "2026-02-14" |

## Usage Examples

### Searching for Content

```bash
# Find all incomplete exercises
grep -l "status: in-progress" exercises/*.md

# Find beginner-level modules
grep -l "difficulty: beginner" curriculum/*.md

# Find all useState-related content
grep -l "useState" curriculum/*.md exercises/*.md

# Find exercises that used MCP tools
grep -l "hands_on: true" exercises/*.md
```

### Parsing in Code

```javascript
// Example: Parse exercise metadata
import matter from 'gray-matter';
import { readFileSync } from 'fs';

const file = readFileSync('exercises/module-03-ex-01.md', 'utf8');
const { data, content } = matter(file);

console.log(data.difficulty);        // "easy"
console.log(data.completed_date);    // "2026-02-07"
console.log(data.best_score);        // 100
```

### Generating Statistics

```bash
# Count completed exercises
grep -c "status: completed" exercises/*.md

# Calculate average time spent
grep "time_spent_minutes:" exercises/*.md | awk '{sum+=$2; count++} END {print sum/count}'

# List modules by difficulty
grep -h "difficulty:" curriculum/*.md | sort | uniq -c
```

## Workflow Integration

### When Creating Module Files

```markdown
1. Generate module metadata based on curriculum plan
2. Set initial status to "not-started"
3. Include all prerequisites
4. Link to next module
5. List concepts to be covered
```

### When Creating Exercise Files

```markdown
1. Link to parent module
2. Set difficulty based on learner's current level
3. Mark if hands-on (MCP available)
4. Initialize tracking fields (attempts: 0, etc.)
5. Set status to "not-started"
```

### When Updating Progress

```markdown
1. After completing exercise:
   - Update exercise file: status, completed_date, score, time_spent
   - Update module file: mark exercise as done
   - Update progress.md: increment completed_exercises

2. After completing module:
   - Update module file: status, completed_date
   - Update .course-state.json: increment currentModule
   - Update progress.md: add session entry

3. After each session:
   - Update progress.md: session notes, observations
   - Update .course-state.json: lastActivity, totalTimeMinutes
```

## Benefits

### For Claude

- **Quick context loading:** Read frontmatter to understand state
- **Smart resume:** Know exactly where learner left off
- **Adaptive teaching:** Access performance history to calibrate difficulty
- **Progress tracking:** See trends and adjust pace

### For Learners

- **Transparency:** See all metadata in plain text
- **Control:** Edit metadata directly if needed
- **Portability:** Files work anywhere, no vendor lock-in
- **Backup:** Easy to version control and sync

### For System

- **No database:** Files are the database
- **Simple queries:** Use grep, awk, or simple scripts
- **Extensible:** Add new fields without breaking changes
- **Human-readable:** Open any file and understand it

## Best Practices

1. **Always include dates:** Track when things happened
2. **Use enums consistently:** Same values for same concepts
3. **Keep it flat:** Avoid deep nesting in metadata
4. **Add tags liberally:** Better searchability
5. **Update incrementally:** Don't batch metadata updates
6. **Validate on read:** Check for required fields
7. **Provide defaults:** Handle missing optional fields gracefully
8. **Document new fields:** Update this reference when adding fields
