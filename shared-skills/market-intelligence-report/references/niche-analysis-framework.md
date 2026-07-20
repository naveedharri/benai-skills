# Niche Analysis Framework

## Engagement Formulas

### Views-Based Metrics

- **Average views (last 30):** Sum of views for last 30 videos / 30
- **Outlier threshold:** 3x the channel's average views
- **Engagement rate:** (likes + comments) / views * 100
- **View velocity:** Views in first 48 hours (if data available)

### Outlier Detection

An **outlier video** is one that significantly overperforms the channel average. These are the most valuable signals because they indicate topics/formats with outsized demand.

**Identification:**
1. Calculate channel average views (last 30 videos)
2. Flag any video with 3x+ above average as an outlier
3. For each outlier, analyze: title structure, topic, format, thumbnail style, timing (was there a product launch?)

**Analysis questions:**
- What topic does this outlier cover that the channel doesn't usually cover?
- Is this a one-time spike (news event) or repeatable demand?
- Could Ben AI make a better version of this for the professional audience?

### Topic Clustering

Group videos by topic to identify content pillars:

1. Extract topics from titles (tool names, feature names, techniques)
2. Cluster similar titles together
3. Calculate average views per cluster
4. Rank clusters by performance

**High-performing clusters** = topics with consistent above-average views
**Underserved clusters** = topics with few videos but high average views (demand > supply)

## Competitive Positioning Matrix

For each channel analyzed, map on two axes:

- **X-axis: Technical depth** (surface → deep)
- **Y-axis: Audience** (developer → professional)

Ben AI's target quadrant: **Deep + Professional** (bottom-right)

Key competitors in the professional AI tools space:
- AI Jason (@AIJasonZ) — AI tools and automation for a broad audience
- Corbin Brown (@CorbinBrownYT) — Claude and AI tool tutorials
- Jack Roberts — AI automation, some professional audience overlap

Most competitors cluster in:
- Deep + Developer (developer-focused Claude Code / automation channels)
- Surface + Professional (generic AI commentary channels)

The gap is deep, practical content for non-developer professionals.

## Content Gap Identification

### Type 1: Topic Gaps
Topics the audience searches for but no competitor covers well.
- Check YouTube search autocomplete for related queries
- Look for Reddit/forum questions with no good video answer
- Identify tool features with no tutorial

### Type 2: Audience Gaps
Topics covered for developers but not translated for professionals.
- Claude Code features → Claude Cowork equivalents
- Technical MCP tutorials → No-code MCP setup guides
- API integrations → Built-in integrations walkthrough

### Type 3: Quality Gaps
Topics covered by competitors but poorly executed.
- Outdated videos (6+ months old for fast-moving tools)
- Surface-level coverage (overview but no practical walkthrough)
- Developer-only framing (could be remade for professionals)

### Type 4: Format Gaps
Formats competitors don't use.
- No comprehensive "ultimate guide" for a popular tool
- No comparison videos between competing tools
- No "how we use it" real-world application videos

## Opportunity Scoring

Rate each identified opportunity on a 1-10 scale based on:

| Factor | Weight | Scoring |
|--------|--------|---------|
| Search demand | 30% | High=10, Medium=6, Low=2 |
| Competition | 25% | Low=10, Medium=6, High=2 |
| Audience fit | 25% | Strong=10, Moderate=6, Weak=2 |
| Timeliness | 20% | Rising/urgent=10, Stable=6, Declining=2 |

**Opportunity score = weighted average**

Rank all opportunities by score and present the top 10 to the user.
