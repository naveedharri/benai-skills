# Export Templates

## niche-analysis.json Schema

```json
{
  "research_date": "YYYY-MM-DD",
  "focus_topic": "the niche/tool focus for this research",
  "channels_analyzed": [
    {
      "channel_name": "Channel Name",
      "channel_url": "https://www.youtube.com/@channel",
      "subscribers": 50000,
      "total_videos": 200,
      "posting_frequency": "2x/week",
      "avg_views_last_30": 15000,
      "engagement_rate": 4.2,
      "top_content_types": ["tutorial", "review"],
      "outlier_videos": [
        {
          "title": "Video Title",
          "url": "https://www.youtube.com/watch?v=...",
          "views": 120000,
          "avg_multiple": 8.0,
          "topic": "what it covers",
          "why_outlier": "reason for overperformance"
        }
      ],
      "title_patterns": [
        "How to [verb] [tool]",
        "[Number] [tool] [feature] You Need"
      ],
      "content_gaps": [
        "No professional-focused content",
        "Missing coverage of [feature]"
      ]
    }
  ],
  "content_opportunities": [
    {
      "rank": 1,
      "opportunity": "description of the opportunity",
      "gap_type": "topic|audience|quality|format",
      "search_demand": "High|Medium|Low",
      "competition": "Low|Medium|High",
      "audience_fit": "Strong|Moderate|Weak",
      "timeliness": "Rising|Stable|Declining",
      "opportunity_score": 8.5,
      "suggested_video_idea": "working title for a potential video",
      "content_tier": "Tier 1|Tier 2",
      "content_type": "Full Tutorial|Feature Tutorial|Update Video|Use Case Video|etc."
    }
  ]
}
```

## niche-report.md Template

```markdown
# YouTube Niche Research Report

**Date:** YYYY-MM-DD
**Focus:** [topic/tool focus]
**Channels analyzed:** [N]
**Videos analyzed:** [N]

## Executive Summary

[3-5 key findings in bullet points]

## Channel Analysis

### [Channel Name 1]
- **Subscribers:** X | **Avg views:** X | **Posting:** Nx/week
- **What's working:** [top performing content types and topics]
- **Outliers:** [notable overperforming videos with view counts]
- **Gaps:** [what they're missing or doing poorly]

### [Channel Name 2]
[same structure]

## Top Content Opportunities

| Rank | Opportunity | Gap Type | Demand | Competition | Score |
|------|------------|----------|--------|-------------|-------|
| 1 | [description] | [type] | High | Low | 9.2 |
| 2 | [description] | [type] | High | Medium | 8.1 |

## Recommended Next Steps

1. [specific action item]
2. [specific action item]
3. [specific action item]
```
