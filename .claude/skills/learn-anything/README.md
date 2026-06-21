# Learn Anything - Adaptive AI Tutor

An adaptive AI tutor skill for Claude Code that teaches any topic, from any starting level, in any language.

## Overview

Creates personalized, resumable learning experiences with MCP tool integration, custom curricula from researched sources, and progress tracking across sessions.

### Key Features

- **6 Learning Modes**: Direct, Socratic, Example-first, Project-based, Speed-run, Deep-dive
- **5 Teaching Styles**: ELI5, Casual, Standard, Academic, Technical
- **Multi-language Support**: Teaches in learner's preferred language
- **MCP Integration**: Discovers and installs relevant tools for hands-on exercises
- **Progress Tracking**: Resumes seamlessly across sessions
- **Research-Based**: Pulls from YouTube videos, official docs (Context7), and web articles
- **Secure**: Auto-generates `.gitignore`, uses environment variables for credentials

## Quick Start

### Start a New Course

```bash
/learn
```

Then tell Claude what you want to learn:
- "Teach me Claude Code in depth"
- "I want to learn n8n automation"
- "Learn Python for machine learning"

### Continue an Existing Course

Navigate to your course folder and run:

```bash
/learn continue
```

### Available In-Course Commands

Once inside a course, you have access to these commands:

- `/next` - Continue to the next module
- `/hint` - Get a hint for the current exercise
- `/exercise` - Generate practice exercises
- `/progress` - View your learning progress
- `/recap` - Recap what you've learned so far
- `/review` - Review previous modules
- `/challenge` - Get a harder challenge exercise
- `/explain-differently` - Request a different explanation approach
- `/add-video <url>` - Add a YouTube video to course materials
- `/add-resource <url>` - Add an article or documentation
- `/settings` - View or change course settings (mode, style, language)
- `/help` - Show all available commands

## Learning Modes

The skill supports 6 learning modes that control the **structure** of teaching:

| Mode | Pattern | Speed | Best For |
|------|---------|-------|----------|
| **Direct** (default) | Explain → Example → Exercise | Fast | Most learners who want efficient, clear teaching |
| **Socratic** | Question → Discovery → Exercise | Slow | Deep understanding through guided discovery |
| **Example-first** | Working example → Break it down → Exercise | Medium | Learning by seeing it work first |
| **Project-based** | Define project → Build → Learn as needed | Medium | Learning by building something real |
| **Speed-run** | Essential concept → Minimal example → Next | Very fast | Quick overviews or refreshers |
| **Deep-dive** | Concept → Theory → Edge cases → Advanced patterns | Very slow | Comprehensive mastery of a topic |

**Note**: Learning modes control structure, while teaching styles (ELI5/Casual/Standard/Academic/Technical) control tone.

## Architecture

### System Design

**Learn Anything** uses a **Workflow-Driven Markdown Architecture** with YAML frontmatter for state management:

- **Document-as-database pattern**: Markdown files with YAML frontmatter for structured data
- **Workflow orchestration**: Intake routing and step-by-step process execution
- **Template-based generation**: Content templates with metadata tracking
- **Mode-adaptive teaching**: Structure changes based on learner preference
- **Stateless sessions**: Handoff documents preserve context across sessions

### Directory Structure

```
learn-anything/
├── SKILL.md                    # Entry point and intake routing
├── references/                 # Behavioral specifications
│   ├── learning-modes.md       # 6 mode definitions
│   ├── metadata-system.md      # YAML frontmatter specs
│   ├── socratic-method.md      # Questioning patterns
│   ├── teaching-styles.md      # Tone definitions
│   └── assessment-questions.md # Level calibration patterns
├── workflows/                  # Step-by-step processes
│   ├── start-course.md         # New course construction
│   ├── continue-course.md      # Resume existing course
│   ├── teach.md                # Core teaching loop
│   ├── generate-exercises.md   # Practice generation
│   ├── add-video.md            # YouTube integration
│   ├── add-resource.md         # Article integration
│   └── settings.md             # Settings management
└── templates/                  # Content structure patterns
    ├── curriculum.md           # Module + INDEX.md templates
    ├── exercise.md             # Exercise structure
    ├── progress.md             # Progress tracking format
    └── commands/               # In-course slash commands
        ├── next.md
        ├── hint.md
        ├── exercise.md
        └── ... (12 total commands)
```

### Generated Course Structure

When you start a new course, the skill creates a self-contained folder:

```
{topic-name}/
├── .course-state.json       # Machine-readable state
├── .mcp.json                # MCP server configurations
├── .gitignore               # Auto-generated (protects credentials)
├── CLAUDE.md                # Course-specific context
├── curriculum/
│   ├── INDEX.md             # Course overview
│   └── module-{NN}.md       # Planned modules
├── completed/
│   └── module-{NN}.md       # Delivered module content
├── exercises/
│   └── module-{NN}-ex-{NN}.md
├── research/
│   ├── .research-notes.md
│   ├── video-*.md           # YouTube transcript analysis
│   ├── article-*.md         # Web article analysis
│   ├── official-docs-analysis.md
│   └── mcp-analysis.md
└── .claude/
    └── commands/            # In-course slash commands
```

### Key Architectural Layers

1. **Intake Layer** (`SKILL.md`): Routes user intent to appropriate workflow
2. **Workflow Layer** (`workflows/`): Executes multi-step processes
3. **Template Layer** (`templates/`): Defines content structure patterns
4. **Reference Layer** (`references/`): Provides teaching methodologies and specs
5. **State Layer** (generated course files): Persists progress across sessions
6. **Command Layer** (`templates/commands/`): In-course user controls

## Data Flow

### New Course Creation

1. User expresses learning intent → Intake detects "new course"
2. `workflows/start-course.md` orchestrates:
   - Creates course folder structure
   - Installs MCP servers (`.mcp.json`)
   - Copies command templates
   - Initializes `.course-state.json`
3. User navigates to course folder (workspace change required)
4. Personalization intake (mode, style, level)
5. Research phase: videos, docs, MCP discovery (parallel execution)
6. MCP evaluation and installation (with credential security)
7. Curriculum generation using templates
8. Handoff document created
9. User opens fresh window → `/learn continue` begins teaching

### Teaching Loop

1. Load learner mode from `.course-state.json`
2. Apply mode-specific teaching approach
3. Deliver module content
4. Generate mode-adapted exercise
5. Evaluate learner response
6. Update metadata (attempts, scores, progress)
7. Check context usage → create handoff if needed
8. Loop to next module

## Technology Stack

- **Platform**: Claude Code
- **Language**: Markdown (documentation and course content)
- **State Management**: YAML frontmatter + JSON
- **Integrations**: MCP (Model Context Protocol) ecosystem
- **Configuration**: File-based (`.course-state.json`, `.mcp.json`)

## Core Principles

1. **Adaptive Teaching**: Calibrates difficulty and pacing based on learner responses
2. **Hands-on First**: Prioritizes practical exercises over theory
3. **Original Curriculum**: Creates unique learning paths tailored to each learner
4. **Progressive Disclosure**: Introduces concepts one layer at a time
5. **Direct Communication**: Concise, respectful, no empty flattery

## Metadata System

All course files use YAML frontmatter for structured metadata tracking:

- **Modules**: status, difficulty, tags, concepts_covered, estimated_time
- **Exercises**: attempts, best_score, hints_used, time_spent_minutes, feedback
- **Progress**: total_modules, completed_modules, session_count, average_score

This enables progress tracking, resumability, and analytics without databases.

## Security

- Auto-generated `.gitignore` excludes `.mcp.json`, `.env`, credentials
- Uses `${ENV_VAR}` references instead of inline secrets
- Sanitizes YouTube transcripts and external content

## Error Handling

Gracefully handles failures without blocking course creation:
- MCP installation failures → continues with conceptual exercises
- Missing videos → logs dropped videos, offers manual URL input
- YouTube transcript failures → uses video titles/descriptions only

## Requirements

- Claude Code (CLI, VSCode/Cursor extension, or Conductor)
- MCP servers (auto-installed per course):
  - YouTube Transcript MCP
  - Context7 MCP

## Architecture Notes

- **Pure Markdown**: Workflows are markdown files consumed by Claude
- **Layered**: Intake → Workflow → Template → Reference
- **YAML Frontmatter**: Structured metadata in all generated content
- **MCP-First**: Leverages Model Context Protocol for external integrations
