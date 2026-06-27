<!-- Updated: 2026-02-21 -->
# Nonprofit Paid Advertising Template

## Industry Characteristics

- Limited budgets requiring maximum efficiency
- Google Ad Grants: $10,000/month in free Google Search advertising (eligible 501(c)(3) organizations)
- Donation funnels differ significantly from commercial conversion paths
- Emotional storytelling drives engagement and donations
- Strict compliance requirements (tax-exempt status, donation receipts, fundraising regulations)
- Seasonality around giving campaigns (year-end, GivingTuesday, disaster relief)
- Multiple conversion goals: donations, volunteer signups, event registrations, petition signatures

## Google Ad Grants Program

### Eligibility
- Must be a registered 501(c)(3) organization (US) or equivalent
- Cannot be a governmental entity, hospital, or academic institution
- Must have a qualifying website with substantial content

### Grant Rules (Critical — violations risk suspension)
| Rule | Requirement |
|------|------------|
| Max CPC bid | $2.00 (unless using Maximize Conversions) |
| Account structure | ≥2 campaigns, ≥2 ad groups per campaign, ≥2 ads per ad group |
| Keyword quality | No single-word keywords (except branded), no overly generic terms |
| CTR requirement | ≥5% account-level CTR each month |
| Conversion tracking | Must have valid conversion tracking |
| Login frequency | Must log in at least once per month |
| Geo-targeting | Must be set (not worldwide) |
| Website | Must meet Google's website policy requirements |

### Grant Optimization Strategy
- Use **Maximize Conversions** bid strategy to bypass $2.00 CPC cap
- Focus on long-tail, mission-specific keywords (higher CTR, lower CPC)
- Pause low-CTR keywords aggressively (account must maintain ≥5%)
- Supplement with paid Google Ads account for keywords that exceed grant caps

## Recommended Platform Mix

| Platform | Role | Budget % | Why |
|----------|------|----------|-----|
| Google Search (Grant) | Primary | $10K free | High-intent donation, volunteer, cause queries |
| Google Search (Paid) | Supplement | 20-30% of paid budget | Keywords exceeding grant CPC caps |
| Meta | Primary | 40-50% of paid budget | Emotional storytelling, donor lookalikes, events |
| YouTube | Secondary | 15-20% of paid budget | Mission videos, impact stories |
| LinkedIn | Testing | 5-10% of paid budget | Corporate partnerships, board recruitment |

## Campaign Architecture

```
Account (Google Ad Grants)
├── Mission Awareness
│   ├── Cause-related keywords ([cause] charity, [issue] help)
│   ├── Problem-awareness queries (how to help [cause])
│   └── Educational content (facts about [issue])
├── Donation Campaigns
│   ├── Direct donation keywords (donate to [cause])
│   ├── Seasonal giving (GivingTuesday, year-end giving)
│   └── Specific campaigns (disaster relief, matching gifts)
├── Volunteer / Action
│   ├── Volunteer opportunity keywords
│   ├── Event-based (runs, galas, auctions)
│   └── Petition / advocacy actions
└── Brand
    └── Organization name + variations

Account (Paid — Meta/Google/YouTube)
├── Donor Acquisition
│   ├── Lookalike of existing donors
│   ├── Interest-based (philanthropy, related causes)
│   └── Retargeting website visitors (7-30 days)
├── Recurring Donor Conversion
│   ├── One-time donors → monthly giving
│   └── Lapsed donors → re-engagement
├── Events & Campaigns
│   ├── Fundraising event promotion
│   └── Seasonal giving campaigns
└── Impact Stories
    ├── Video testimonials (beneficiaries)
    └── Annual report / impact metrics
```

## Creative Strategy

### What Works for Nonprofits
- **Impact stories**: show real people whose lives changed (with consent)
- **Specific asks**: "Your $25 provides meals for a family for a week" (not "Donate now")
- **Urgency with matching**: "Every dollar doubled until midnight" (matching gift campaigns)
- **Transparency**: show exactly where donations go (pie charts, impact metrics)
- **Video**: 60-90s impact stories outperform static images for donations

### Creative by Conversion Goal
| Goal | Format | Message |
|------|--------|---------|
| One-time donation | Video, emotional story | Specific impact of donation amount |
| Monthly giving | Carousel, calculator | Monthly cost comparison ("less than a coffee/day") |
| Volunteer signup | Event photo, community | Belonging, purpose, social proof |
| Awareness | Infographic, video | Facts, urgency, call to learn more |

### Creative Volume Requirements
| Platform | Min Active Creatives | Recommended | Refresh Cadence |
|----------|---------------------|-------------|-----------------|
| Google Search (Grant) | ≥2 ads per ad group | Maintain ≥5% CTR (grant requirement) | Monthly; pause low-CTR immediately |
| Google PMax (Paid) | 15 images, 3 logos, 3 videos | Impact stories, beneficiary content | Quarterly; swap "Low" assets monthly |
| Meta Standard | 5-8 per ad set | Emotional storytelling + impact metrics + specific asks | Every 10-14 days |
| YouTube | 3-5 video formats | 60-90s impact stories; donor testimonials | Every 4-8 weeks |

See `ads/references/creative-volume.md` for detailed per-platform production benchmarks.

## Targeting Strategy

### Google Keywords (Grant-Specific)
- **Mission keywords**: [cause], [issue] charity, help [cause], support [issue]
- **Action keywords**: donate to [cause], volunteer [location], [cause] events
- **Educational**: facts about [issue], how to help [cause], [issue] statistics
- **Avoid**: Single-word keywords, overly broad terms (will tank CTR below 5%)

### Meta Audiences
- Lookalike of donor email list (1-3%)
- Interest: philanthropy, charitable giving, related causes
- Behavioral: donate to charity, GivingTuesday participants
- Retargeting: website visitors, video viewers, past event attendees

## Budget Guidelines

| Metric | Nonprofit Benchmark |
|--------|-------------------|
| Google Grant value | $10,000/month (free) |
| Google Paid CPC | $1.50-$4.00 |
| Meta CPC | $0.50-$2.00 |
| Meta CPM | $8-$20 |
| Cost per donation | $15-$50 (varies by cause) |
| Average online donation | $128 (recurring: $52/month) |
| Min paid monthly budget | $1,000+ (supplement to Grant) |

### Seasonal Budget Pacing
| Period | Budget Allocation |
|--------|-----------------|
| January-September | 40% of annual paid budget (steady state) |
| October | 10% (ramp up for giving season) |
| November (GivingTuesday) | 20% (peak giving period) |
| December (year-end) | 30% (largest giving month — 31% of annual donations) |

## Bidding Strategy Selection

| Platform | Strategy | Notes |
|----------|----------|-------|
| Google Grant | Maximize Conversions | Bypasses $2.00 CPC cap — essential |
| Google Paid | Target CPA | Set at historical cost-per-donation |
| Meta | Lowest Cost | Maximize donation volume |
| Meta (year-end) | Cost Cap | Protect margins during Q4 CPM spikes |
| YouTube | Target CPV | Optimize for video views (awareness) |

## Attribution Model

- Track donation value as conversion value (not just conversion count)
- Separate first-time donors from recurring donors in reporting
- Long attribution windows (30-day click) — donation decisions take time
- Multi-touch: awareness campaigns assist donation campaigns
- Track lifetime donor value, not just first donation

## KPI Targets

| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Cost per donation | Baseline | Target +20% | Target |
| Donation ROAS | 2:1 | 3:1 | 5:1+ |
| Grant CTR | ≥5% (mandatory) | ≥6% | ≥7% |
| Recurring donor conversion | Tracking | 5% of one-time | 10% of one-time |
| Email list growth | Baseline | +20% | +50% |

## Common Pitfalls

- Not using Maximize Conversions on Google Grant (stuck at $2.00 CPC cap)
- Failing to maintain ≥5% CTR on Grant account (suspension risk)
- Generic keywords that waste Grant budget and tank CTR
- Not having a separate paid Google Ads account for high-CPC keywords
- Year-round flat budget instead of concentrating on giving season
- Asking for donations without showing specific impact
- Not building recurring donor programs (one-time donors are expensive to re-acquire)
- Missing GivingTuesday preparation (start 4 weeks before)
