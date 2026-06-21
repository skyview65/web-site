# Learning Modes Reference

Defines 6 learning modes that control the **structure** of the teaching experience. These are independent from teaching styles (ELI5/Casual/Standard/Academic/Technical) which control **tone**.

---

## Mode Overview

| Mode | Speed | Depth | Best For |
|------|-------|-------|----------|
| **Direct** | Fast | Medium | Most learners, efficient learning |
| **Socratic** | Slow | Deep | Abstract concepts, lasting understanding |
| **Example-first** | Medium | Medium | Developers, visual learners |
| **Project-based** | Medium | Practical | Builders, hands-on learners |
| **Speed-run** | Very fast | Shallow | Refreshers, adjacent-domain experts |
| **Deep-dive** | Very slow | Maximum | Experts, specific topic mastery |

**Default mode: Direct** (most learners want efficient, clear teaching).

---

## 1. Direct Mode

**Pattern:** Explain → Example → Exercise

The instructor explains concepts clearly and moves on. No questioning, no discovery process. Efficient and respectful of the learner's time.

### Teaching Loop

1. **Explain** the concept in the chosen teaching style
   - Clear definition
   - Why it matters
   - How it connects to previous concepts
2. **Show** a concrete example
   - Working code/workflow/demo
   - Annotate key parts
3. **Exercise** to verify understanding
   - Practical application
   - Clear success criteria
4. **Quick feedback** and move on
   - Correct or explain mistakes directly
   - No "why do you think that?" - just explain what's right

### Interaction Style
- Statements, not questions
- "Here's how X works" not "What do you think X does?"
- Feedback is direct: "That's correct" or "Not quite - here's why: [explanation]"
- Questions from the LEARNER are encouraged, but the instructor doesn't quiz

### When to Suggest Switching
- Learner keeps making the same mistake → suggest Socratic for that concept
- Learner says "I don't understand why" → offer to switch to Socratic or Deep-dive temporarily

---

## 2. Socratic Mode

**Pattern:** Question → Response → Deeper question → Discovery → Exercise

Guide the learner to discover answers through strategic questioning. Never give direct answers unless the learner is stuck after multiple attempts.

### Teaching Loop

1. **Introduce** the topic area (brief context only)
2. **Ask** a clarifying question to gauge understanding
3. **Probe** deeper based on response
4. **Guide** toward discovery through progressive questions
5. **Confirm** understanding when learner arrives at the answer
6. **Exercise** to solidify
7. **Evaluate** using questions about approach before confirming correctness

### Interaction Style
- Questions, not statements
- "What do you think happens when...?" not "When you do X, Y happens"
- Progressive hints when stuck (4 levels - see socratic-method.md)
- Celebrate genuine "aha!" moments

### Hint Ladder (from socratic-method.md)
1. Vague hint (directional)
2. Specific hint (narrows focus)
3. Partial answer (one piece)
4. Full explanation (last resort)

### When to Suggest Switching
- Learner says "just tell me" repeatedly → suggest Direct
- Learner is frustrated after 3+ rounds → switch to Direct for that concept
- Time pressure mentioned → suggest Speed-run

---

## 3. Example-first Mode

**Pattern:** Working example → "Let's break it down" → Concepts from the example → Exercise

Show the end result first, then reverse-engineer understanding. The learner sees what "done" looks like before learning the theory.

### Teaching Loop

1. **Present** a complete, working example
   - Full code/workflow/demo with comments
   - Show the output/result
   - "Here's a working [thing]. Let's understand why it works."
2. **Walk through** the example piece by piece
   - Point at each part: "This line does X because Y"
   - Connect to underlying concepts
3. **Modify** the example together
   - "What if we change this part? What would happen?"
   - Small variations to build understanding
4. **Exercise**: build something similar (not identical)
   - "Now create your own version that does [variation]"

### Interaction Style
- "Look at this..." / "Notice how..."
- Code/examples are the primary teaching material
- Theory supports the example, not the other way around
- Questions are about the example: "What does line 5 do?" not abstract theory

### When to Suggest Switching
- Learner wants to understand theory deeper → suggest Deep-dive
- Learner wants to build their own thing → suggest Project-based

---

## 4. Project-based Mode

**Pattern:** Define project → Build step by step → Learn concepts as needed

The entire course is structured around building one (or more) real projects. Concepts are introduced when the project needs them, not in a theoretical sequence.

### Teaching Loop

1. **Define** the project at the start
   - What we're building
   - What it will look like when done
   - Technologies/tools we'll use
2. **Build** incrementally
   - Each step moves the project forward
   - When a new concept is needed: brief explanation, then apply it
   - "To add this feature, we need to understand [concept]. Here's how it works: [brief]. Now let's use it."
3. **Checkpoint** after each major feature
   - Review what we built
   - What concepts we used
   - Quick check: "Could you add [small variation] on your own?"
4. **Complete** the project
   - Final review of everything built
   - Summary of all concepts learned through building

### Curriculum Adaptation
- The original curriculum modules still exist as reference
- But the teaching ORDER follows the project's needs, not the module sequence
- Module 7's concept might come before Module 3's if the project needs it first
- Track which concepts have been covered regardless of module order

### Interaction Style
- "Let's add [feature] to our project"
- Concepts are servants to the project, not the main event
- Every explanation ends with "Now let's use this in our [project]"
- Motivation stays high because progress is visible

### When to Suggest Switching
- Learner wants deeper understanding of a concept → pause project, do Deep-dive, return
- Learner is struggling with basics → suggest Direct for foundational concepts first

---

## 5. Speed-run Mode

**Pattern:** Essential concept → Minimal example → Next

Cover the entire curriculum as fast as possible. No fluff, no optional exercises, no deep exploration. For people who need a map of the territory, not a deep tour.

### Teaching Loop

1. **State** the concept in 2-3 sentences max
2. **Show** one minimal example
3. **Quick check**: "Clear? Any questions?" (don't quiz them)
4. **Move on** immediately
5. **Exercises** are optional and marked as such
   - Only offer exercises if learner asks
   - When offered: quick, targeted, one per concept max

### Curriculum Adaptation
- Skip "nice to know" - only cover "must know"
- Merge related modules into compressed sections
- No warm-up or recap between modules
- Estimated time per module: cut by 60-70%

### Interaction Style
- Ultra-concise
- Bullet points over paragraphs
- "X does Y. Example: [code]. Moving on."
- Only elaborate if asked

### When to Suggest Switching
- Learner asks lots of questions → suggest Direct or Socratic
- Learner doesn't understand a concept → slow down to Direct for that one concept, then resume speed-run
- Learner says "wait, explain more" → temporarily switch modes

---

## 6. Deep-dive Mode

**Pattern:** One concept → History/theory → Implementation details → Edge cases → Advanced patterns → Mastery exercise

Go extremely deep on each concept. Explore every angle, edge case, and advanced pattern before moving on.

### Teaching Loop

1. **Introduce** the concept with full context
   - What it is
   - Why it exists (history, problem it solves)
   - How it relates to the broader ecosystem
2. **Explain** implementation details
   - How it works under the hood
   - Internal mechanisms
   - Common implementations
3. **Explore** edge cases
   - "What happens when...?"
   - Error states, limits, gotchas
   - Common misconceptions
4. **Advanced patterns**
   - Expert-level usage
   - Combinations with other concepts
   - Real-world production patterns
5. **Mastery exercise**
   - Complex, open-ended
   - Requires understanding of edge cases
   - May combine multiple concepts

### Curriculum Adaptation
- Fewer modules covered per session
- Each module takes 2-3x longer than estimated
- Add supplementary content (papers, advanced docs, source code)
- Exercises are harder and more open-ended

### Interaction Style
- Thorough and detailed
- "Let's go deeper..." / "There's actually more to this..."
- References to source material, specs, documentation
- Encourages learner to explore and experiment

### When to Suggest Switching
- Learner seems bored or impatient → suggest Direct or Speed-run
- Session time is limited → suggest Direct for remaining modules

---

## Mode Switching

### Mid-Course Switching
Learners can switch modes anytime via `/settings mode [mode]`. When switching:

1. **Acknowledge** the switch: "Switching to [mode] mode."
2. **Adapt immediately** - don't finish the current explanation in old mode
3. **Brief demo** of the new mode applied to the current topic (2-3 sentences)
4. **Continue** from where they were, not from the beginning

### Temporary Switches
Sometimes a temporary mode switch makes sense:
- "Let me explain this one concept in Socratic mode, then we'll go back to Direct"
- "Let's speed-run through these basics so we can get to the interesting part"

Update `.course-state.json`: set `mode` to the temporary mode, keep `permanentMode` unchanged, set `modeIsTemporary` to `true`. Log the temporary switch in progress.md with the reason. When the temporary switch ends (or on next session resume), restore `mode` to `permanentMode` and set `modeIsTemporary` to `false`.

### Automatic Suggestions
The instructor should suggest mode switches when detecting:
- **Frustration** → suggest a faster mode (Direct, Speed-run)
- **Confusion** → suggest a deeper mode (Socratic, Deep-dive)
- **Boredom** → suggest a more active mode (Project-based, Example-first)
- **Rushing** → suggest slowing down (Socratic, Deep-dive)

Never force a switch. Always suggest and let the learner decide.

---

## Combining Mode + Teaching Style

Mode and style are independent. Any combination is valid:

| Combination | Result |
|-------------|--------|
| Direct + ELI5 | Simple explanations, no questions, move fast |
| Direct + Technical | Code-heavy explanations, no fluff |
| Socratic + Casual | Friendly guided discovery |
| Socratic + Academic | Rigorous questioning, formal language |
| Speed-run + Technical | Ultra-compressed, code-only |
| Deep-dive + Academic | Full theoretical treatment |
| Example-first + ELI5 | "Look at this simple thing, let me explain..." |
| Project-based + Casual | "Let's build this cool thing together" |
