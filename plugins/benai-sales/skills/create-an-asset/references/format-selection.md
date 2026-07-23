# Structure Decision (Phase 2)

Pick the section/slide/step structure for the chosen format before writing content.

## Contents

- Interactive landing page
- Deck-style
- One-pager
- Workflow / architecture demo
- Scenario-to-format examples
- Example output structures

## Interactive Landing Page

| Purpose | Recommended Sections |
|---------|---------------------|
| **Intro** | Company Fit → Solution Overview → Key Use Cases → Why Us → Next Steps |
| **Discovery follow-up** | Their Priorities → How We Help → Relevant Examples → ROI Framework → Next Steps |
| **Technical deep-dive** | Architecture → Security & Compliance → Integration → Performance → Support |
| **Exec alignment** | Strategic Fit → Business Impact → ROI Calculator → Risk Mitigation → Partnership |
| **POC proposal** | Scope → Success Criteria → Timeline → Team → Investment → Next Steps |
| **Deal close** | Value Summary → Pricing → Implementation Plan → Terms → Sign-off |

**Audience adjustments:**
- **Executive**: Lead with business impact, ROI, strategic alignment
- **Technical**: Lead with architecture, security, integration depth
- **Operations**: Lead with workflow impact, change management, support
- **Mixed**: Balance strategic + tactical; use tabs to separate depth levels

## Deck-Style

Same sections as landing page, formatted as linear slides:

```
1. Title slide (Prospect + Seller logos, partnership framing)
2. Agenda
3-N. One section per slide (or 2-3 slides for dense sections)
N+1. Summary / Key takeaways
N+2. Next steps / CTA
N+3. Appendix (optional, detailed specs, pricing, etc.)
```

**Slide principles:**
- One key message per slide
- Visual > text-heavy
- Use prospect's metrics and language
- Include speaker notes

## One-Pager

Condense to single-scroll format:

```
┌─────────────────────────────────────┐
│ HERO: "[Prospect Goal] with [Product]" │
├─────────────────────────────────────┤
│ KEY POINT 1     │ KEY POINT 2     │ KEY POINT 3     │
│ [Icon + 2-3     │ [Icon + 2-3     │ [Icon + 2-3     │
│  sentences]     │  sentences]     │  sentences]     │
├─────────────────────────────────────┤
│ PROOF POINT: [Metric, quote, or case study] │
├─────────────────────────────────────┤
│ CTA: [Clear next action] │ [Contact info] │
└─────────────────────────────────────┘
```

## Workflow / Architecture Demo

**Structure based on complexity:**

| Complexity | Components | Structure |
|------------|------------|-----------|
| **Simple** | 3-5 | Single-view diagram with step annotations |
| **Medium** | 5-10 | Zoomable canvas with step-by-step walkthrough |
| **Complex** | 10+ | Multi-layer view (overview → detailed) with guided tour |

**Standard elements:**

1. **Title bar**: `[Scenario Name], Powered by [Seller Product]`
2. **Component nodes**: Visual boxes/icons for each system
3. **Flow arrows**: Animated connections showing data movement
4. **Step panel**: Sidebar explaining current step in plain language
5. **Controls**: Play / Pause / Step Forward / Step Back / Reset
6. **Annotations**: Callouts for key decision points and value-adds
7. **Data preview**: Sample payloads or transformations at each step

## Scenario-to-Format Examples

| Scenario | Format | Key Features |
|----------|--------|--------------|
| Post-discovery exec meeting | Interactive page | ROI calculator, their stated priorities, case studies |
| Technical architecture review | Workflow demo | System diagram, data flows, integration points |
| Board presentation leave-behind | One-pager | Strategic alignment, key metrics, clear CTA |
| Large stakeholder meeting | Deck-style | Linear narrative, one point per slide, appendix |

## Example Output Structures

### Example 1: Executive Landing Page

**Input:** Prospect: Acme Corp (manufacturing). Audience: C-suite. Purpose: Exec alignment after discovery. Format: Interactive landing page.

**Output structure:**
```
[Tabs]
Strategic Fit | Business Impact | ROI Calculator | Security & Trust | Next Steps

[Strategic Fit tab]
- Acme's stated priorities (from discovery call)
- How [Product] aligns
- Relevant manufacturing customers
```

### Example 2: Technical Workflow Demo

**Input:** Prospect: Centric Brands. Audience: IT architects. Purpose: POC proposal. Format: Workflow demo. Components: Claude, Workato DataGenie, Snowflake, PDF contracts.

**Output structure:**
```
[Interactive canvas with 5 nodes]
Human → Claude → PDF Contracts → Workato → Snowflake
         ↓
    [Results back to Human]

[Step-by-step walkthrough with sample data]
[Controls: Play | Pause | Step | Reset]
```

### Example 3: Sales One-Pager

**Input:** Prospect: TechStart Inc. Audience: VP Engineering. Purpose: Leave-behind after first meeting. Format: One-pager.

**Output structure:**
```
Hero: "Accelerate TechStart's Product Velocity"
Point 1: [Dev productivity]
Point 2: [Code quality]
Point 3: [Time to market]
Proof: "Similar companies saw 40% faster releases"
CTA: "Schedule technical deep-dive"
```
