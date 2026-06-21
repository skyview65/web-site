---
name: invoicing
description: Create invoices and track payments
tokens: ~300
cloud-ok: true
---

# Invoicing
#claudeai

## When to Use
You need to create an invoice or track what's owed to you.

## What I Need
- Client name and details
- What you're billing for
- Amount and payment terms
- Your payment details

## Invoice Template

```
INVOICE

From:
[Your Company Name]
[Your Address]
[Your Email]

To:
[Client Company]
[Client Contact]
[Client Address]

Invoice #: [YYYY-MM-XXX]
Date: [Issue Date]
Due Date: [Due Date]

---

| Description | Qty | Rate | Amount |
|-------------|-----|------|--------|
| [Service/Product] | X | $Y | $Z |
| [Service/Product] | X | $Y | $Z |

---

Subtotal: $X
Tax (if applicable): $Y
**Total Due: $Z**

---

Payment Terms: [Net 30 / Due on Receipt / etc.]

Payment Methods:
- Bank Transfer: [Details]
- [Other method]: [Details]

Notes:
[Any additional terms or thank you]
```

## Invoice Numbering
Keep it simple and sequential:
- `2026-01-001` (Year-Month-Sequence)
- `INV-001` (Simple sequence)
- `ACME-001` (Client-Sequence)

## Payment Terms

| Term | Meaning | When to Use |
|------|---------|-------------|
| Due on Receipt | Pay immediately | Small amounts, new clients |
| Net 15 | Pay within 15 days | Standard for small business |
| Net 30 | Pay within 30 days | Most common B2B |
| Net 60 | Pay within 60 days | Enterprise clients |
| 50/50 | Half upfront, half on delivery | Projects, custom work |

## Follow-Up Sequence

| Days Overdue | Action |
|--------------|--------|
| Due date | Friendly reminder |
| +7 days | Second reminder, ask if issues |
| +14 days | Firmer reminder, mention late fees |
| +30 days | Final notice, pause services |
| +45 days | Collections process |

## Follow-Up Templates

**Friendly reminder (due date):**
"Hi [Name], friendly reminder that invoice #[X] for $[Y] is due today. Let me know if you need anything from my end."

**Second reminder (+7):**
"Following up on invoice #[X]. Is there anything holding up payment? Happy to help resolve any questions."

**Firmer (+14):**
"Invoice #[X] is now 14 days overdue. Per our agreement, [late fee policy]. Please process at your earliest."

## Output Format

```
## Invoice: [Client] - [Description]

[Full invoice content]

**Next steps:**
1. [Save as PDF]
2. [Send to client at email]
3. [Log in tracking system]
4. [Set reminder for due date]
```
