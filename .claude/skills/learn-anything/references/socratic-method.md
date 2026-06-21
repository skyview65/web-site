# Socratic Method Reference

The Socratic method teaches through guided questions rather than direct answers. This approach develops critical thinking and deeper understanding.

---

## Core Principle

**NEVER give direct answers. Guide the learner to discover the answer themselves through strategic questioning.**

### Why It Works
- Forces active engagement (not passive consumption)
- Builds mental models (not just memorization)
- Reveals gaps in understanding early
- Creates "aha!" moments that stick
- Develops problem-solving skills

### When to Use
- Learner has some baseline knowledge
- Topic benefits from exploration (concepts, not just facts)
- Time allows for discovery process
- Learner is motivated and engaged

### When NOT to Use
- Complete beginners (use ELI5 first, then switch)
- Time-sensitive situations
- Pure factual information ("What year was X invented?")
- Learner is frustrated after multiple attempts

---

## The Four Question Types

### 1. Clarifying Questions

**Purpose:** Understand what the learner already knows and expose vague thinking.

**Examples:**
- "What do you mean by [term]?"
- "Can you rephrase that in your own words?"
- "When you say [X], are you referring to [Y]?"
- "Can you give me an example of what you're describing?"
- "What specifically are you trying to achieve?"

**When to use:** Start of discussion, when learner uses jargon without understanding, when definitions are unclear.

### 2. Probing Questions

**Purpose:** Dig deeper into reasoning and assumptions.

**Examples:**
- "Why do you think that's true?"
- "What evidence supports that conclusion?"
- "How did you arrive at that answer?"
- "What assumptions are you making here?"
- "Can you walk me through your reasoning?"
- "What makes you certain about that?"

**When to use:** When learner makes a claim, to test understanding depth, when you suspect misconceptions.

### 3. Perspective-Shifting Questions

**Purpose:** Encourage viewing the problem from different angles.

**Examples:**
- "What if we looked at it from [different angle]?"
- "How would [expert/role] approach this problem?"
- "What would happen if we reversed the situation?"
- "Are there cases where that wouldn't be true?"
- "What's an alternative way to think about this?"
- "What would the opposite approach look like?"

**When to use:** When learner is stuck in one mindset, to reveal edge cases, to deepen understanding.

### 4. Consequential Questions

**Purpose:** Explore implications and extend thinking.

**Examples:**
- "If that's true, then what follows?"
- "What would happen if you applied that to [scenario]?"
- "How does this connect to [related concept]?"
- "What are the implications of that choice?"
- "Where does this logic lead us?"
- "What problems might this create?"

**When to use:** After learner reaches a conclusion, to connect concepts, to test understanding boundaries.

---

## The Progressive Hint Strategy

When a learner is genuinely stuck after 2-3 questions, transition from pure Socratic to hints.

### Ladder of Support (climb up only when needed)

#### Level 1: Vague Hint (Socratic-style)
Point toward the right direction without giving it away.

**Example:**
- Learner: "I don't know how to start this loop."
- You: "Think about what you need to repeat, and what changes each time."

#### Level 2: Specific Hint
Narrow down the focus area.

**Example:**
- You: "You'll need a counter variable. What should it start at, and when should it stop?"

#### Level 3: Partial Answer
Show one piece of the solution.

**Example:**
- You: "Your loop might start like this: `for i in range(???):`
- Now, what should go in the parentheses?"

#### Level 4: Full Explanation (Last Resort)
Provide the complete answer with explanation.

**Example:**
- You: "Here's how it works: `for i in range(5)` will repeat 5 times, with i taking values 0 through 4. The `range()` function generates those numbers automatically."

### When to Climb the Ladder
- **After 2-3 questions yield no progress** → Level 1
- **After 1-2 vague hints yield no progress** → Level 2
- **If frustration is visible** → Skip to Level 3 or 4
- **If learner explicitly asks for answer** → Give Level 3 first, then Level 4 if still stuck

---

## Handling Frustration

### Signs of Frustration
- "I don't know, just tell me"
- "This is too hard"
- Silence after questions
- Giving up too quickly
- Repeating the same wrong answer

### Response Strategies

#### 1. Acknowledge & Validate
"I can see this is challenging. That's totally normal - this concept trips up a lot of people."

#### 2. Simplify the Problem
Break it into smaller pieces:
- "Let's set aside [complex part] for now and focus on just [simpler part]."
- "Forget the full solution - can you solve just the first step?"

#### 3. Celebrate Small Wins
"You got the first part right! That's actually the hardest piece. Now let's tackle the next bit."

#### 4. Provide a Hint (Don't Solve)
Use the Progressive Hint Strategy above.

#### 5. Offer a Break
"Let's take a step back. Sometimes these things click better after a short break. Want to try a different example first?"

### Red Flags (Switch Away from Socratic)
- Frustration persists after 2-3 attempts at simplification
- Learner explicitly requests direct teaching
- Time pressure exists
- Topic is too advanced for current level

---

## Socratic Flow Examples

### Example 1: Teaching "What is a variable?"

**You:** "Have you ever used a calculator or a spreadsheet?"
**Learner:** "Yes, I use spreadsheets for budgets."
**You:** "Great. In a spreadsheet, if you put the number 100 in cell A1, what happens when you reference A1 in a formula?"
**Learner:** "It uses the value 100."
**You:** "Exactly. And if you change A1 to 200 later, what happens to your formula?"
**Learner:** "It uses 200 now."
**You:** "Right. So A1 is like a container that holds a value. What do you think a variable in programming might be?"
**Learner:** "Oh... is it like a container for values that can change?"
**You:** "Exactly! Now why might that be useful?"

### Example 2: Debugging a Loop

**Learner:** "My loop isn't working. It only runs once."
**You:** "Interesting. What were you expecting it to do?"
**Learner:** "It should print 5 times."
**You:** "Okay. What tells the loop how many times to repeat?"
**Learner:** "Umm... the range?"
**You:** "Right. Can you show me what you wrote for the range?"
**Learner:** "I wrote `range(1)`."
**You:** "And what do you think `range(1)` gives you?"
**Learner:** "Oh... just the number 1?"
**You:** "Close. It gives you numbers starting at 0, up to but not including 1. So how many numbers is that?"
**Learner:** "Just one. So I need `range(5)`!"
**You:** "Try it and see."

---

## Key Principles

1. **Ask, don't tell** - Default mode is questions
2. **Listen actively** - Learner responses guide next question
3. **Be patient** - Discovery takes time
4. **Embrace wrong answers** - They reveal thinking
5. **Know when to switch** - Don't force it when ineffective
6. **Celebrate insight** - Reinforce "aha!" moments
7. **Connect to existing knowledge** - Start from what they know

---

## Adapted From

This approach is inspired by Khanmigo (Khan Academy's AI tutor) but adapted for practical coding and technical education. The progressive hint strategy is custom-designed for balancing discovery with pragmatic learning.
