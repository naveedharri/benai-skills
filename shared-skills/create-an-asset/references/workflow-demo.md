# Workflow / Architecture Demo Specifics

Everything specific to building the workflow/architecture demo format: component definitions, flow steps, scenario narrative, demo-specific CSS, and icon mappings. Use alongside the general content and design references.

## Contents

- Component definitions
- Flow steps
- Scenario narrative
- Demo-specific CSS (nodes, arrows, canvas)
- Component icon mappings

## Component Definitions

For each system, define:

```yaml
component:
  id: "snowflake"
  label: "Snowflake Data Warehouse"
  type: "database"  # database | api | ai | middleware | human | document | output
  icon: "database"
  description: "Financial performance data"
  brand_color: "#29B5E8"
```

**Component types:**
- `human`, Person initiating or receiving
- `document`, PDFs, contracts, files
- `ai`, AI/ML models, agents
- `database`, Data stores, warehouses
- `api`, APIs, services
- `middleware`, Integration platforms, MCP servers
- `output`, Dashboards, reports, notifications

## Flow Steps

For each step, define:

```yaml
step:
  number: 1
  from: "human"
  to: "claude"
  action: "Initiates performance review"
  description: "Sarah, a Brand Analyst at [Prospect], kicks off the quarterly review..."
  data_example: "Review request: Nike brand, Q4 2025"
  duration: "~1 second"
  value_note: "No manual data gathering required"
```

## Scenario Narrative

Write a clear, specific walkthrough:

```
Step 1: Human Trigger
"Sarah, a Brand Performance Analyst at Centric Brands, needs to review
Q4 performance for the Nike license agreement. She opens the review
dashboard and clicks 'Start Review'..."

Step 2: Contract Analysis
"Claude retrieves the Nike contract PDF and extracts the performance
obligations: minimum $50M revenue, 12% margin requirement, quarterly
reporting deadline..."

Step 3: Data Query
"Claude formulates a query and sends it to Workato DataGenie:
'Get Q4 2025 revenue and gross margin for Nike brand from Snowflake'..."

Step 4: Results & Synthesis
"Snowflake returns the data. Claude compares actuals vs. obligations:
Revenue $52.3M ✓ (exceeded by $2.3M)
Margin 11.2% ⚠️ (0.8% below threshold)..."

Step 5: Insight Delivery
"Claude synthesizes findings into an executive summary with
recommendations: 'Review promotional spend allocation to improve
margin performance...'"
```

## Demo-Specific CSS

**Component Nodes:**
```css
.node {
    background: var(--bg-surface);
    border: 2px solid var(--brand-primary);
    border-radius: 12px;
    padding: 16px;
    min-width: 140px;
}

.node.active {
    box-shadow: 0 0 20px var(--accent-glow);
    border-color: var(--accent);
}

.node.human {
    border-color: #f59e0b; /* Warm color for humans */
}

.node.ai {
    background: linear-gradient(135deg, var(--bg-surface), var(--bg-elevated));
    border-color: var(--accent);
}
```

**Flow Arrows:**
```css
.arrow {
    stroke: var(--text-muted);
    stroke-width: 2;
    fill: none;
    marker-end: url(#arrowhead);
}

.arrow.active {
    stroke: var(--accent);
    stroke-dasharray: 8 4;
    animation: flowDash 1s linear infinite;
}
```

**Canvas:**
```css
.canvas {
    background:
        radial-gradient(circle at center, var(--bg-elevated) 0%, var(--bg-primary) 100%),
        url("data:image/svg+xml,..."); /* Subtle grid pattern */
    overflow: auto;
}
```

## Component Icon Mappings

| Type | Icon | Example |
|------|------|---------|
| human | 👤 or person SVG | User, Analyst, Admin |
| document | 📄 or file SVG | PDF, Contract, Report |
| ai | 🤖 or brain SVG | Claude, AI Agent |
| database | 🗄️ or cylinder SVG | Snowflake, Postgres |
| api | 🔌 or plug SVG | REST API, GraphQL |
| middleware | ⚡ or hub SVG | Workato, MCP Server |
| output | 📊 or screen SVG | Dashboard, Report |
