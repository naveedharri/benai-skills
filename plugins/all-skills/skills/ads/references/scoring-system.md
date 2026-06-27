# Ad Account Audit Scoring System

<!-- Updated: 2026-02-10 -->
<!-- Sources: Google Research PDF 1, Claude Research, Gemini Research -->

## Weighted Scoring Algorithm

```
S_total = Σ(C_pass × W_sev × W_cat) / Σ(C_total × W_sev × W_cat) × 100
```

- `C_pass` = check passed (1) or failed (0); WARNING = 0.5
- `W_sev` = severity multiplier of the individual check
- `W_cat` = category weight for that platform
- Result: 0-100 Health Score

## Severity Multipliers

| Severity | Multiplier | Criteria |
|----------|-----------|----------|
| Critical | 5.0 | Immediate revenue/data loss risk. Remediation urgent. |
| High | 3.0 | Significant performance drag. Fix within 7 days. |
| Medium | 1.5 | Optimization opportunity. Fix within 30 days. |
| Low | 0.5 | Best practice, minor impact. Nice to have. |

## Scoring Per Check Item

| Result | Points Earned |
|--------|--------------|
| PASS | Full severity × category weight |
| WARNING | 50% of full points |
| FAIL | 0 points |
| N/A | Excluded from total possible (see N/A Implementation below) |

## N/A Implementation

When a check is not applicable to the account being audited, mark it **N/A** and exclude it from **both** the numerator (points earned) and denominator (total possible points).

### When to Assign N/A

A check receives N/A when its **applicability condition** is not met. Each platform checklist defines conditions on conditional checks. Common triggers:

- **Feature not used**: PMax checks → N/A if no PMax campaigns exist
- **Region not targeted**: Consent Mode v2 → N/A if no EU/EEA targeting
- **Business type mismatch**: TikTok Shop → N/A if not e-commerce; ABM → N/A for SMB
- **Platform setup**: Google Import checks → N/A for native Microsoft accounts
- **Campaign type absent**: Lead Gen Forms → N/A if not using Lead Gen Forms

### N/A Scoring Rules

1. **Exclude from denominator**: N/A checks do NOT count toward `C_total` in the scoring formula
2. **Exclude from numerator**: N/A checks contribute 0 to `C_pass` (but this is irrelevant since denominator also drops)
3. **Document reason**: Every N/A must include a brief reason (e.g., "N/A — no PMax campaigns active")
4. **Minimum scored checks**: At least 50% of checks per category must be scorable. If >50% are N/A in a category, flag the category as "Insufficient Data" rather than scoring it

### Calculation Example

Account with 10 checks in a category (all High severity, weight 3.0):
- 5 PASS, 2 FAIL, 1 WARNING, 2 N/A

```
Denominator = (5 + 2 + 1) × 3.0 = 24.0  ← N/A excluded (8 scored, not 10)
Numerator   = (5 × 1.0 + 1 × 0.5) × 3.0 = 16.5
Category %  = 16.5 / 24.0 = 68.75%
```

Without N/A handling (incorrect):
```
Denominator = 10 × 3.0 = 30.0  ← unfairly penalizes
Numerator   = 16.5
Category %  = 16.5 / 30.0 = 55.0%  ← 13.75% lower (wrong)
```

### N/A vs FAIL

| Scenario | Correct Result | Rationale |
|----------|---------------|-----------|
| No PMax campaigns → PMax checks | N/A | Cannot fail what doesn't exist |
| PMax exists but assets incomplete | FAIL | Feature in use, poorly configured |
| No EU targeting → Consent Mode | N/A | Regulation doesn't apply |
| EU targeting, no Consent Mode | FAIL | Regulation applies, not implemented |
| No Lead Gen Forms on LinkedIn | N/A | Feature not in use |
| Lead Gen Forms with 10+ fields | FAIL | Feature in use, poorly optimized |

## Category Weights by Platform

### Google Ads
| Category | Weight | Rationale |
|----------|--------|-----------|
| Conversion Tracking | 25% | Foundation for all optimization; Enhanced Conv + Consent Mode |
| Wasted Spend / Negatives | 20% | Direct money leak; search terms, negative lists |
| Account Structure | 15% | Campaign organization, brand/non-brand separation |
| Keywords & Quality Score | 15% | QS directly impacts CPC; average QS ≥7 target |
| Ads & Assets | 15% | RSA strength, PMax asset completeness, extensions |
| Settings & Targeting | 10% | Location, network, audiences, landing pages |

### Meta Ads
| Category | Weight | Rationale |
|----------|--------|-----------|
| Pixel / CAPI Health | 30% | 87% of advertisers have poor EMQ; foundational signal |
| Creative (Diversity & Fatigue) | 30% | Creative = 70% of campaign results per Meta |
| Account Structure | 20% | Learning phase, CBO/ABO, campaign consolidation |
| Audience & Targeting | 20% | Overlap, exclusions, Advantage+ testing |

### LinkedIn Ads
| Category | Weight | Rationale |
|----------|--------|-----------|
| Technical Setup | 25% | Insight Tag + CAPI essential for B2B attribution |
| Audience Quality | 25% | LinkedIn's targeting precision is its differentiator |
| Creative & Formats | 20% | TLA + format diversity; video efficiency varies |
| Lead Gen Forms | 15% | 13% CVR (3.25× landing pages); CRM integration |
| Bidding & Budget | 15% | High CPCs ($5-$35) require careful management |

### TikTok Ads
| Category | Weight | Rationale |
|----------|--------|-----------|
| Creative Quality | 30% | Native-feel content is #1 success factor |
| Technical Setup | 25% | Pixel + Events API + ttclid passback |
| Bidding & Learning | 20% | 50 conv/week to exit learning; budget sufficiency |
| Structure & Settings | 15% | Smart+, Search Toggle, Shop integration |
| Performance | 10% | CTR, CPA, completion rate benchmarks |

### Microsoft Ads
| Category | Weight | Rationale |
|----------|--------|-----------|
| Technical Setup | 25% | UET tag, import validation, Enhanced Conv |
| Syndication & Bidding | 20% | Partner network control, Copilot placement |
| Structure & Audience | 20% | LinkedIn targeting (unique), campaign structure |
| Creative & Extensions | 20% | Multimedia Ads, Action/Filter Link Extensions (unique) |
| Settings & Performance | 15% | CPC advantage tracking, conversion rate comparison |

## Grading Thresholds

| Grade | Score | Label | Action Required |
|-------|-------|-------|-----------------|
| A | 90-100 | Excellent | Minor optimizations only |
| B | 75-89 | Good | Some improvement opportunities |
| C | 60-74 | Needs Improvement | Notable issues need attention |
| D | 40-59 | Poor | Significant problems present |
| F | <40 | Critical | Urgent intervention required |

## Quick Wins Logic

```
IF severity == "Critical" OR severity == "High"
AND estimated_remediation_time < 15 minutes
THEN flag as "Quick Win"
PRIORITY: Quick Wins sorted by (severity × estimated_impact) DESC
```

Quick Win examples:
- Enable Enhanced Conversions (Critical, 5 min)
- Turn on Search Ads Toggle in TikTok (High, 2 min)
- Add negative keyword lists (Critical, 10 min)
- Fix location targeting method (Critical, 2 min)
- Enable Advantage+ Placements (Medium, 2 min)

## Weighting Rationale

Category weights are calibrated for paid advertising accounts where conversion tracking infrastructure is the highest-impact factor (25-30% weight across platforms). This differs from generic scoring systems because:
- Broken tracking invalidates all optimization decisions downstream
- Creative and targeting quality follow tracking in priority
- Settings and compliance are important but have lower direct revenue impact
- Weights sum to 100% per platform, enabling direct cross-platform comparison

The grading thresholds (A=90-100, B=75-89, C=60-74, D=40-59, F=<40) use wider bands than academic-style scoring because ad account health is typically distributed lower — a score of 75+ represents genuinely well-managed accounts.

---

## Cross-Platform Aggregate Score

When auditing multiple platforms, calculate per-platform scores then aggregate:

```
Aggregate Score = Σ(Platform_Score × Platform_Budget_Share)

Example: Google (82) × 40% + Meta (71) × 35% + LinkedIn (90) × 25%
       = 32.8 + 24.85 + 22.5 = 80.15 → Grade B
```
