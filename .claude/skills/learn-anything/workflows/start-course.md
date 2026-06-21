# Start Course Workflow

This workflow creates a new personalized learning course. It executes 6 steps in sequence, each in its own file.

<steps>

## Step 1: Setup
Read `~/.claude/skills/learn-anything/workflows/steps/setup.md` and follow it.

**MANDATORY STOP after this step.** The user must move to the course folder before continuing. Do NOT proceed to Step 2 in this context.

---

*Steps 2-6 execute after the user runs `/learn continue` from inside the course folder.*

## Step 2: Personalization
Read `~/.claude/skills/learn-anything/workflows/steps/personalization.md` and follow it.
Do NOT proceed to research until personalization is confirmed.

## Step 3: Research
Read `~/.claude/skills/learn-anything/workflows/steps/research.md` and follow it.

## Step 4: MCP Evaluation & Install
Read `~/.claude/skills/learn-anything/workflows/steps/mcp-eval.md` and follow it.

## Step 5: Curriculum Generation
Read `~/.claude/skills/learn-anything/workflows/steps/curriculum-gen.md` and follow it.
Wait for learner approval before proceeding.

## Step 6: Handoff (ALWAYS execute)
Read `~/.claude/skills/learn-anything/workflows/steps/handoff.md` and follow it.
**This step is ALWAYS executed. Never skip it.**

</steps>

**Context Monitoring:** After every major step, check context usage. If >= 50% (100k tokens), create HANDOFF.md immediately. If >= 70%, STOP all work.
