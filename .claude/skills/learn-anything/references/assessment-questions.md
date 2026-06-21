# Assessment Questions Reference

Detect learner level WITHOUT directly asking "Are you a beginner?" Use natural probing questions to calibrate understanding.

---

## Core Principle

**Infer learner level from their responses, not from self-assessment.**

People often misjudge their own level:
- Beginners overestimate (Dunning-Kruger)
- Experts underestimate (impostor syndrome)
- Terminology knowledge ≠ practical understanding

**Strategy:** Ask open-ended questions and observe language, depth, and confidence.

---

## General Probing Patterns

Use these patterns for ANY topic to gauge familiarity.

### Pattern 1: Free Recall
**Question format:**
- "What comes to mind when you think of [topic]?"
- "If I say [term], what does that mean to you?"
- "What do you already know about [topic]?"

**What to listen for:**
- **Beginner:** "I've heard of it" / "Not sure" / vague descriptions
- **Intermediate:** Defines it correctly but simply
- **Advanced:** Includes nuance, edge cases, or tradeoffs

**Example:**
- **Q:** "What comes to mind when you think of APIs?"
- **Beginner:** "Something about apps talking to each other?"
- **Intermediate:** "It's a way for programs to request data from other services."
- **Advanced:** "REST, GraphQL, gRPC - depends on use case. REST is stateless, GraphQL lets clients specify exactly what data they need, gRPC is faster for internal services."

---

### Pattern 2: Experience Recall
**Question format:**
- "Have you ever [common use case]? What happened?"
- "When was the last time you [action related to topic]?"
- "Can you describe a time you worked with [topic]?"

**What to listen for:**
- **Beginner:** "No" / "I watched a tutorial once"
- **Intermediate:** Describes a basic experience
- **Advanced:** Describes complex scenarios or problem-solving

**Example:**
- **Q:** "Have you ever built a web form that sends data somewhere?"
- **Beginner:** "No, I haven't done that yet."
- **Intermediate:** "Yeah, I made a contact form that sends emails."
- **Advanced:** "Yes, I've built forms with validation, CSRF protection, rate limiting, and error handling for failed submissions."

---

### Pattern 3: Explain-to-a-Friend
**Question format:**
- "If someone asked you to explain [topic] to a friend, what would you say?"
- "How would you describe [concept] to someone who's never heard of it?"

**What to listen for:**
- **Beginner:** Struggles or uses circular definitions
- **Intermediate:** Explains clearly with analogy
- **Advanced:** Explains with technical accuracy AND accessibility

**Example:**
- **Q:** "How would you explain a database to a non-technical friend?"
- **Beginner:** "Um... it's where data is stored?"
- **Intermediate:** "It's like a super organized filing cabinet for digital information."
- **Advanced:** "It's structured storage with fast retrieval - think of it like a library catalog system where you can look up books by author, title, or subject, except it's for any kind of data."

---

## Technical Domain Patterns

Use these when teaching programming, automation, or technical skills.

### Pattern 1: Related Concepts
**Ask about adjacent knowledge to triangulate level.**

**Example for "Learning Python":**
- "Have you programmed in any other language before?"
- "Do you know what a variable is?"
- "Have you heard of loops or functions?"

**Calibration:**
- No to all → **Complete beginner**
- Yes to variables, no to functions → **Early beginner**
- Yes to most, from another language → **Intermediate** (transfer learning)

### Pattern 2: Scenario-Based Problem
**Present a simple real-world problem and ask approach.**

**Example:**
- "Let's say you have a list of 100 email addresses, and you need to send each person a personalized message. How would you approach that?"

**What to listen for:**
- **Beginner:** "I'd... copy-paste 100 times?" / "I don't know"
- **Intermediate:** "Use a loop to go through each email"
- **Advanced:** "Loop through the list, use a template with placeholders, handle errors for invalid emails, maybe add rate limiting to avoid spam filters"

### Pattern 3: Tooling & Environment
**Ask about their current setup to gauge experience.**

**Questions:**
- "What do you use to write code?" (text editor, IDE, online editor?)
- "Have you used the terminal/command line before?"
- "Do you use version control like Git?"

**Calibration:**
- Online editors, no terminal → **Beginner**
- Local editor, some terminal → **Intermediate**
- IDE, Git, familiar with debugging tools → **Advanced**

---

## Level Calibration Rules

After 2-3 probing questions, classify learner level:

### Beginner
**Indicators:**
- No familiarity with terminology
- No practical experience with the topic
- Needs ELI5 explanations
- Asks "what is [basic term]?" frequently

**Adjust teaching:**
- Start with ELI5 or Casual style
- Use heavy analogies
- Small, simple exercises
- Avoid jargon unless explaining it

---

### Intermediate
**Indicators:**
- Knows concepts but not details
- Has some hands-on experience
- Can explain basics but struggles with nuance
- Asks "how do I do X?" more than "what is X?"

**Adjust teaching:**
- Use Casual or Standard style
- Introduce terminology with context
- Provide practical, slightly challenging exercises
- Explain "why" behind the "how"

---

### Advanced
**Indicators:**
- Explains tradeoffs and edge cases
- Uses terminology correctly
- Asks about optimization, architecture, or advanced patterns
- References prior experience with complex problems

**Adjust teaching:**
- Use Standard or Technical style
- Minimal hand-holding
- Focus on nuance, edge cases, best practices
- Complex exercises with ambiguity

---

## Calibration from First 2-3 Responses

You don't need a long interview. Calibrate FAST.

### Round 1: Opening Question (1 response)
**Ask one of:**
- "What brings you here today? What do you want to learn?"
- "Have you worked with [topic] before?"
- "What's your background - are you coming from [related field]?"

**Quick calibration:**
- Vague or "I'm totally new" → Likely **Beginner**
- "I've done X but want to learn Y" → Likely **Intermediate**
- "I know X and Y, want to master Z" → Likely **Advanced**

### Round 2: Probing Question (1 response)
**Based on Round 1, ask a targeted question:**
- For suspected beginners: "Have you ever [simple related task]?"
- For suspected intermediates: "How would you [slightly complex scenario]?"
- For suspected advanced: "What's your experience with [specific advanced concept]?"

**Confirm or adjust your calibration.**

### Round 3: Confirmation (Optional, 1 response)
If still unclear, ask one more:
- "Can you walk me through [specific example]?"
- "What challenges have you faced with [topic]?"

**By response 3, you should be confident.**

---

## Adaptive Teaching Flow

```
Ask probing question 
        ↓
Analyze response
        ↓
Classify level (Beginner / Intermediate / Advanced)
        ↓
Choose teaching style + depth + vocabulary
        ↓
Start teaching, adjust dynamically if responses show misclassification
```

---

## Common Misclassification Signals

### Classified as Beginner, but Actually Intermediate
**Signs:**
- They grasp concepts quickly
- They ask follow-up questions that show deeper thinking
- They connect new concepts to prior knowledge

**Response:** Step up complexity immediately.

### Classified as Intermediate, but Actually Beginner
**Signs:**
- They nod along but can't apply concepts
- They repeat your words without understanding
- They struggle with basic exercises

**Response:** Step back, use simpler analogies, check foundational knowledge.

### Classified as Advanced, but Actually Intermediate
**Signs:**
- They know terminology but misuse it
- They can't explain tradeoffs
- They struggle with open-ended problems

**Response:** Dial back complexity, focus on fundamentals before advanced topics.

---

## Question Templates Cheat Sheet

| Goal | Question Template |
|------|-------------------|
| **Free recall** | "What comes to mind when you think of [topic]?" |
| **Experience** | "Have you ever [done X]?" |
| **Explanation** | "How would you explain [topic] to a friend?" |
| **Related knowledge** | "Do you know what [related concept] is?" |
| **Problem-solving** | "How would you approach [simple scenario]?" |
| **Tooling** | "What tools do you use for [activity]?" |
| **Prior learning** | "Where did you first hear about [topic]?" |
| **Motivation** | "What do you want to build/do with [skill]?" |

---

## Key Principles

1. **Observe, don't ask directly** - Infer from natural responses
2. **Triangulate** - Use 2-3 questions from different angles
3. **Adjust dynamically** - Reclassify if responses don't match expectation
4. **Match vocabulary to level** - Jargon alienates beginners, simplicity bores experts
5. **Start conservative** - Easier to step up than step down
6. **Celebrate uncertainty** - "I don't know" is honest and helpful

---

## Summary

**Don't ask "What's your level?"**
**Ask "What do you know about X?"**

Let their language, examples, and problem-solving approach reveal their level. Then adapt.
