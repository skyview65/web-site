---
name: cash-analysis
description: Analyze bank and credit card statements - categorize expenses, find recurring charges, spot anomalies
tokens: ~450
cloud-ok: false
---

# Cash Analysis
#claudeai

## When to Use
You have bank or credit card statements and need to understand where money is going, find recurring charges, or spot unusual expenses.

## What I Need
- Statement file (CSV, PDF, or paste transactions)
- Time period covered
- What you're looking for (categorization, subscriptions, anomalies, all)

## ⚠️ Privacy Note
Financial data is sensitive. This skill is marked `cloud-ok: false` - use with local models when possible. Never share account numbers or sensitive identifiers.

## What I Can Do

### 1. Categorize Expenses
Group transactions into meaningful categories:

| Category | Examples |
|----------|----------|
| **Payroll** | Gusto, ADP, direct payroll transfers |
| **Software/SaaS** | Slack, AWS, Notion, Figma |
| **Marketing** | Google Ads, Meta, LinkedIn, agencies |
| **Professional Services** | Legal, accounting, consulting |
| **Office/Equipment** | Amazon, hardware, furniture |
| **Travel** | Airlines, hotels, Uber, meals |
| **Banking/Fees** | Wire fees, merchant fees, interest |
| **Subscriptions** | Recurring services, memberships |
| **Utilities** | Internet, phone, hosting |
| **Contractors** | Freelancer payments |
| **Personal** | If mixed with business |
| **Unknown** | Needs manual review |

### 2. Find Recurring Charges
Identify subscriptions and regular expenses:
- Same amount, same vendor, regular interval
- Annual charges (easy to forget)
- Charges that increased over time
- Duplicate subscriptions (paying twice for same thing)

### 3. Spot Anomalies
Flag unusual transactions:
- Unusually large amounts
- New vendors (first-time charges)
- Unexpected categories
- Round numbers that might be errors
- Charges after cancellation

## Output Format

```
## Cash Analysis: [Account/Period]

**Summary:**
- Total spend: $X
- Transaction count: N
- Period: [Date range]

### Spending by Category

| Category | Amount | % of Total | Count |
|----------|--------|------------|-------|
| Payroll | $X | X% | N |
| Software | $X | X% | N |
| Marketing | $X | X% | N |
| [etc.] | $X | X% | N |

### Recurring Charges Found

| Vendor | Amount | Frequency | Annual Cost |
|--------|--------|-----------|-------------|
| [Name] | $X | Monthly | $Y |
| [Name] | $X | Annual | $Y |
| [Name] | $X | Monthly | $Y |

**Total recurring:** $X/month ($Y/year)

### Anomalies / Review Items

🔴 **Needs Attention:**
- [Large or suspicious charge]

🟡 **Worth Checking:**
- [Unusual pattern]
- [New vendor]

### Insights

**Biggest expense categories:**
1. [Category] - [Observation]
2. [Category] - [Observation]

**Potential savings:**
- [Subscription to cancel or downgrade]
- [Duplicate charge]
- [Unused service]

**Trends:**
- [Spending pattern observation]
```

## For Statement Upload

**Best formats:**
1. CSV export (most banks offer this)
2. PDF statement (I can extract transactions)
3. Copy/paste from online banking

**What I need in the data:**
- Date
- Description/Merchant
- Amount
- (Helpful: Category if bank provides it)

## Quick Analysis Modes

**"Just categorize this"**
→ Category breakdown only

**"Find my subscriptions"**
→ Recurring charges only

**"Anything unusual?"**
→ Anomaly detection only

**"Full analysis"**
→ Everything above

## Common Findings

| Finding | What It Means |
|---------|---------------|
| Forgotten subscriptions | Cancel or use them |
| Duplicate tools | Consolidate (2 project management tools?) |
| Creeping costs | SaaS that raised prices |
| Unused services | Free trial that converted |
| Category imbalance | Marketing 50% of spend - intentional? |

## Follow-Up Actions

After analysis, consider:
- [ ] Cancel unused subscriptions
- [ ] Downgrade over-provisioned services
- [ ] Negotiate annual vs monthly pricing
- [ ] Set up expense tracking going forward
- [ ] Separate personal/business accounts if mixed
- [ ] Update budget with actual numbers
