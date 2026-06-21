# Teaching Styles Reference

This guide defines 5 teaching styles for adaptive learning. Choose the style based on learner preference, topic complexity, and context.

---

## 1. ELI5 (Explain Like I'm 5)

**Definition:** Use simple analogies and zero jargon to explain concepts as if talking to a child.

### Tone & Voice
- Playful and enthusiastic
- Short sentences, simple words
- Heavy use of metaphors and everyday objects
- Encourages curiosity and wonder

### When to Use
- Complete beginners with no technical background
- Complex topics that need demystifying
- When learner is intimidated or overwhelmed
- Abstract concepts that benefit from concrete analogies

### Example: "What is an API?"

> Imagine you're at a restaurant. You (the customer) want food, and the kitchen has the food. But you can't just walk into the kitchen and grab it yourself!
>
> So there's a waiter. You tell the waiter what you want (that's your *request*). The waiter takes your order to the kitchen, the kitchen makes your food, and the waiter brings it back to you (that's the *response*).
>
> An API is like that waiter! It's the messenger that takes your request to a computer system, and brings back what you asked for. You don't need to know how the kitchen works - you just need to know how to talk to the waiter!

---

## 2. Casual

**Definition:** Conversational and friendly, like explaining to a colleague over coffee.

### Tone & Voice
- Relaxed and approachable
- Real-world examples and relatable scenarios
- Some technical terms, but explained naturally
- "We" and "you" language, not academic "one"

### When to Use
- Learners with some context but not experts
- Practical "how-to" content
- When building confidence matters
- Career-switchers or self-taught learners

### Example: "What is an API?"

> Okay, so you know how apps on your phone talk to each other? Like when you share a photo from Instagram to Twitter, or when your fitness app syncs with your health app?
>
> That's APIs at work. An API (Application Programming Interface) is basically a set of rules that lets different software programs communicate. Think of it like a common language they all agree to speak.
>
> Let's say you're building a weather app. Instead of setting up your own satellites and weather stations (yikes), you can use a weather API. You send a request like "Hey, what's the weather in Paris right now?" and the API sends back the data. Clean and simple.
>
> The cool part? You don't need to know how their system works internally. You just need to know how to ask for what you want - kind of like using a vending machine. You press the button, you get your snack. You don't need to understand the machinery inside.

---

## 3. Standard

**Definition:** Balanced, structured explanation with clear definitions and organized examples.

### Tone & Voice
- Professional but approachable
- Defined structure (definition → explanation → example)
- Technical terms introduced and explained
- Neutral, educational tone

### When to Use
- General audiences (default choice)
- Documentation and tutorials
- When clarity and completeness matter
- Mixed-level groups

### Example: "What is an API?"

> An **API (Application Programming Interface)** is a set of protocols and tools that allows different software applications to communicate with each other.
>
> ### How APIs Work
>
> APIs act as intermediaries between systems. When you interact with an application, it often needs to retrieve or send data to another service. The API defines:
>
> - **Endpoints**: Specific URLs where requests are sent
> - **Methods**: Actions like GET (retrieve data), POST (send data), PUT (update), DELETE (remove)
> - **Request format**: How to structure your request (headers, parameters, body)
> - **Response format**: What data you'll receive back (usually JSON or XML)
>
> ### Practical Example
>
> Consider a travel booking website. When you search for flights, the website doesn't store every airline's flight data. Instead, it uses APIs:
>
> 1. You enter "New York to London, June 15"
> 2. The website sends API requests to multiple airlines
> 3. Each airline's API returns available flights
> 4. The website displays the combined results
>
> This approach is efficient because the website always gets real-time data without maintaining massive databases.
>
> ### Benefits
>
> - **Modularity**: Systems stay independent
> - **Reusability**: One API can serve many applications
> - **Security**: APIs control what data is exposed
> - **Scalability**: Services can be updated independently

---

## 4. Academic

**Definition:** Formal, theory-first approach with rigorous definitions and conceptual foundations.

### Tone & Voice
- Formal and precise language
- Theoretical frameworks before practical application
- Citations and references to standards
- Objective, third-person perspective

### When to Use
- University courses or research contexts
- When theoretical understanding is critical
- Learners who prefer depth-first learning
- Documentation for scholarly work

### Example: "What is an API?"

> ### Definition and Theoretical Foundation
>
> An Application Programming Interface (API) constitutes a formalized specification that defines the methods, data structures, and protocols through which software components interact (Fielding, 2000). APIs represent an abstraction layer that encapsulates implementation details while exposing well-defined interfaces for inter-process communication.
>
> ### Architectural Context
>
> Within software architecture, APIs serve as contractual boundaries between system components. The concept derives from modular programming principles, wherein interfaces decouple implementation from specification (Parnas, 1972). This separation enables:
>
> - **Information hiding**: Internal state remains opaque to consumers
> - **Contract-based design**: Interfaces define behavioral guarantees
> - **Loose coupling**: Components depend on interfaces, not implementations
>
> ### Taxonomic Classification
>
> APIs can be categorized along multiple dimensions:
>
> 1. **By scope**: Private (internal), Partner (restricted), Public (open)
> 2. **By protocol**: REST (Representational State Transfer), SOAP (Simple Object Access Protocol), GraphQL, gRPC
> 3. **By paradigm**: Synchronous (request-response), Asynchronous (event-driven)
>
> ### Formal Specification
>
> Consider a REST API endpoint formally defined as:
>
> ```
> GET /resource/{id}
> Precondition: id ∈ ValidIdentifiers
> Postcondition: Returns R | ∅ where R represents the resource state
> ```
>
> The API contract guarantees idempotent operations for GET requests, ensuring that multiple identical requests yield identical responses without side effects.
>
> ### Theoretical Implications
>
> APIs embody the principle of interface segregation from SOLID design principles. By defining minimal, client-specific interfaces, APIs reduce coupling and enhance system maintainability (Martin, 2000).

---

## 5. Technical

**Definition:** Code-first, minimal explanation, expert-to-expert communication.

### Tone & Voice
- Direct and concise
- Assumes prior knowledge
- Code examples front and center
- No hand-holding or motivation

### When to Use
- Experienced developers
- Quick reference documentation
- When time is limited
- Technical specifications

### Example: "What is an API?"

> API = programmatic interface for inter-service communication.
>
> ### HTTP REST API Example
>
> ```bash
> # GET request
> curl -X GET https://api.example.com/users/123 \
>   -H "Authorization: Bearer <token>"
>
> # Response (JSON)
> {
>   "id": 123,
>   "name": "John Doe",
>   "email": "john@example.com"
> }
> ```
>
> ### Common Patterns
>
> **Authentication**:
> - Bearer tokens (OAuth 2.0)
> - API keys (header or query param)
> - HMAC signatures
>
> **Rate limiting**:
> - `X-RateLimit-Remaining: 4999`
> - `Retry-After: 3600`
>
> **Versioning**:
> - URL: `/v1/resource`
> - Header: `Accept: application/vnd.api+json;version=1`
>
> ### Quick Implementation (Node.js)
>
> ```javascript
> const express = require('express');
> const app = express();
>
> app.get('/api/users/:id', async (req, res) => {
>   const user = await db.users.findById(req.params.id);
>   if (!user) return res.status(404).json({ error: 'Not found' });
>   res.json(user);
> });
>
> app.listen(3000);
> ```
>
> ### Key Concepts
>
> - **Idempotency**: GET, PUT, DELETE (safe to retry)
> - **Status codes**: 2xx success, 4xx client error, 5xx server error
> - **CORS**: Cross-origin resource sharing for browser clients
> - **Webhooks**: Reverse APIs for event-driven architectures
>
> Use OpenAPI/Swagger for spec-driven development.
