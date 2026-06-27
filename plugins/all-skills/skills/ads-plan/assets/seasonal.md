<!-- Updated: 2026-02-21 -->
# Seasonal Business Paid Advertising Template

## Industry Characteristics

- Revenue concentrated in specific seasons (holiday, summer, back-to-school, tax season, etc.)
- Dramatic CPM/CPC fluctuations between peak and off-peak periods
- Requires aggressive budget ramping before peak and sharp pullback after
- Inventory/capacity constraints during peak may limit ad spend utility
- Off-season brand awareness critical for peak-season conversion rates
- Competitor intensity follows predictable seasonal patterns

## Recommended Platform Mix

### Peak Season
| Platform | Role | Budget % | Why |
|----------|------|----------|-----|
| Google Search | Primary | 40-50% | Capture high-intent seasonal queries |
| Meta | Primary | 25-35% | Retargeting, urgency-driven creative |
| Google Shopping/PMax | Primary (e-commerce) | 15-25% | Product visibility at purchase moment |
| TikTok | Secondary | 5-10% | Viral seasonal content, younger demographics |
| Microsoft | Testing | 5% | Incremental search volume |

### Off-Season
| Platform | Role | Budget % | Why |
|----------|------|----------|-----|
| Meta | Primary | 40-50% | Cheap CPMs, audience building, brand awareness |
| Google Search | Secondary | 25-30% | Brand defense + evergreen queries |
| YouTube | Secondary | 15-20% | Brand video at low CPMs |
| TikTok | Testing | 5-10% | Community building, organic + paid synergy |

## Campaign Architecture

```
Account
├── Always-On (year-round, 20% of annual budget)
│   ├── Brand Defense
│   ├── Core Product/Service (evergreen)
│   └── Retargeting (website visitors, past customers)
├── Pre-Season Ramp (6-8 weeks before peak)
│   ├── Awareness — Seasonal content, gift guides, previews
│   ├── Email/CRM list building for peak
│   └── Lookalike/Predictive audience building
├── Peak Season (main selling window)
│   ├── High Intent — Seasonal + transactional keywords
│   ├── Shopping / PMax (full catalog)
│   ├── Retargeting — Cart abandoners (1-3 day window)
│   ├── Urgency campaigns (countdown, limited stock)
│   └── Day-specific (Black Friday, Cyber Monday, etc.)
├── Post-Season (2-4 weeks after peak)
│   ├── Clearance / Gift Card campaigns
│   ├── Post-purchase upsell
│   └── Review/testimonial collection
└── Off-Season (lowest spend)
    ├── Brand awareness at cheap CPMs
    ├── Content marketing support
    └── Next-season email list building
```

## Creative Strategy

### Seasonal Creative Calendar
| Phase | Timing | Creative Focus |
|-------|--------|---------------|
| Off-season | 6+ months before peak | Brand story, lifestyle, community |
| Pre-season | 6-8 weeks before | Anticipation, early access, previews |
| Peak launch | Week 1 of season | Full catalog, hero offers, urgency |
| Mid-peak | Weeks 2-4 | Social proof, bestsellers, UGC |
| Late peak | Final week | Last chance, countdown, FOMO |
| Post-season | 1-4 weeks after | Clearance, gift cards, loyalty |

### Creative Volume Requirements
| Platform | Min Active Creatives | Recommended | Refresh Cadence |
|----------|---------------------|-------------|-----------------|
| Meta Standard | 5-8 per ad set | Season-specific imagery; urgency messaging in peak | Every 10-14 days (accelerate during peak) |
| Meta ASC | 50-150 per campaign | Peak season only for e-commerce | Every 10-14 days |
| Google PMax | 15 images, 3 logos, 3 videos | Swap seasonal assets before each period | Before each season; "Low" assets monthly |
| TikTok | 6-10 per ad group | Trend-aligned seasonal content | Every 10-14 days (fatigue onset 3-5 days) |

See `ads/references/creative-volume.md` for detailed per-platform production benchmarks.

## Targeting Strategy

### Audience Layering by Phase
| Phase | Primary Audience | Secondary |
|-------|-----------------|-----------|
| Off-season | Past customers, broad interest | Lookalike building |
| Pre-season | Email subscribers, engaged visitors | Early-bird segments |
| Peak | High-intent search, retargeting | Broad with bid modifiers |
| Post-season | Peak purchasers, cart abandoners | Loyal customer upsell |

### Google Keywords — Seasonal Modifiers
- Add seasonal modifiers to all keyword groups: "[product] + [season/holiday]"
- Create dedicated campaigns for peak-specific terms (e.g., "Black Friday [product]")
- Pause seasonal campaigns post-peak (don't just lower bids)

## Budget Guidelines

### Annual Budget Distribution
| Phase | % of Annual Budget | Duration |
|-------|-------------------|----------|
| Always-on | 20% | Year-round |
| Pre-season ramp | 15% | 6-8 weeks |
| Peak season | 45-50% | 4-8 weeks |
| Post-season | 5-10% | 2-4 weeks |
| Off-season | 10-15% | Remaining |

### Budget Pacing Rules
- **Ramp up gradually**: increase 20% per week starting 6 weeks before peak
- **Never go from $0 to full budget** — algorithms need learning time
- **Peak daily budget**: 3-5x your average daily spend
- **Reserve 10% of peak budget** for real-time opportunities (trending products, competitor gaps)
- **Wind down over 2 weeks** after peak — don't cut to zero overnight

| Metric | Off-Season | Peak Season |
|--------|-----------|-------------|
| Google Search CPC | Baseline | 1.5-3x baseline |
| Meta CPM | $5-$15 | $15-$50+ (Q4) |
| Expected CPA | Tracking | Baseline target |
| Min monthly (peak) | $3,000+ | $10,000+ |

## Bidding Strategy Selection

| Phase | Platform | Strategy |
|-------|----------|----------|
| Off-season | Google | Maximize Clicks (build data) |
| Off-season | Meta | Lowest Cost (cheap impressions) |
| Pre-season | Google | Maximize Conversions (ramp learning) |
| Peak | Google | Target CPA or Target ROAS (if data sufficient) |
| Peak | Meta | Cost Cap (protect margins during CPM spikes) |
| Peak | TikTok | Cost Cap or Bid Cap (control costs in Q4) |

## Attribution Model

- Use longer attribution windows during peak (conversions may start pre-season)
- Track "assist" conversions from off-season brand campaigns
- Compare year-over-year, not month-over-month (seasonality makes MoM meaningless)
- Separate new customer acquisition from returning customer revenue

## KPI Targets

| Metric | Off-Season | Pre-Season | Peak | Post-Season |
|--------|-----------|------------|------|-------------|
| ROAS | 2:1 (brand building) | 3:1 | 5:1+ | 3:1 |
| CPA | Relaxed | Target +20% | Target | Target +50% (clearance) |
| CTR | Baseline | +10% | +25% | Baseline |
| New Customers | Focus | Build lists | Maximize | Retain |

## Common Pitfalls

- Starting peak campaigns too late (algorithms need 2+ weeks to learn)
- Not building audiences in off-season (cold audiences convert poorly at peak CPMs)
- Cutting budget to zero in off-season (loses pixel data, audience quality, and algorithmic learning)
- Same CPA targets year-round (peak CPMs are 2-3x higher — adjust expectations)
- Not reserving creative budget for pre-season production
- Running peak-season urgency messaging too early (erodes trust)
- Forgetting to pause seasonal campaigns after peak (wastes budget on irrelevant traffic)
