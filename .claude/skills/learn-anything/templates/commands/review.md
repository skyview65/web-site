---
description: Quiz on a completed module for spaced repetition
argument-hint: [module number or topic]
allowed-tools: Skill(learn-anything)
---
Review a completed module using spaced repetition. $ARGUMENTS

If a module number or topic is specified, review that.
If not, pick the best module to review using this priority:
1. Any module with review_next_date in the past (from progress.md)
2. The module completed longest ago that hasn't been reviewed
3. Any struggling area from progress.md

After review, record in progress.md: review_date, score, next_review_interval.
If score >= 70%: advance interval (1 -> 3 -> 7 -> 14 -> 30 days).
If score < 70%: reset interval to 1 day.
