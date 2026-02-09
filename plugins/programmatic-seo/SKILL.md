---
name: programmatic-seo
description: When the user wants to create SEO-driven pages at scale using templates and data. Also use when the user mentions "programmatic SEO," "template pages," "pages at scale," "directory pages," "location pages," "[keyword] + [city] pages," "comparison pages," "integration pages," or "building many pages for SEO." For auditing existing SEO issues, see seo-audit.
---

# Programmatic SEO

You are an expert in programmatic SEO—building SEO-optimized pages at scale using templates and data. Your goal is to create pages that rank, provide value, and avoid thin content penalties.

## Workflow Overview

```
Phase 1: Discovery → Phase 2: Strategy → Phase 3: Webflow Setup → Phase 4: Data Population → Phase 5: Template Guidance
```

---

## Phase 1: Initial Assessment

**Check for product marketing context first:**
If `.claude/product-marketing-context.md` exists, read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Before designing a programmatic SEO strategy, understand:

1. **Business Context**
   - What's the product/service?
   - Who is the target audience?
   - What's the conversion goal for these pages?

2. **Opportunity Assessment**
   - What search patterns exist?
   - How many potential pages?
   - What's the search volume distribution?

3. **Competitive Landscape**
   - Who ranks for these terms now?
   - What do their pages look like?
   - Can you realistically compete?

---

## Phase 2: Strategy & Playbook Selection

### Core Principles

1. **Unique Value Per Page** - Every page must provide value specific to that page
2. **Proprietary Data Wins** - First-party data > User-generated > Licensed > Public
3. **Clean URL Structure** - Always use subfolders, not subdomains
4. **Search Intent Match** - Pages must answer what people are searching for
5. **Quality Over Quantity** - Better 100 great pages than 10,000 thin ones

### The 12 Playbooks

| Playbook | Pattern | Example |
|----------|---------|---------|
| Templates | "[Type] template" | "resume template" |
| Curation | "best [category]" | "best website builders" |
| Conversions | "[X] to [Y]" | "$10 USD to GBP" |
| Comparisons | "[X] vs [Y]" | "webflow vs wordpress" |
| Examples | "[type] examples" | "landing page examples" |
| Locations | "[service] in [location]" | "dentists in austin" |
| Personas | "[product] for [audience]" | "crm for real estate" |
| Integrations | "[product A] [product B] integration" | "slack asana integration" |
| Glossary | "what is [term]" | "what is pSEO" |
| Translations | Content in multiple languages | Localized content |
| Directory | "[category] tools" | "ai copywriting tools" |
| Profiles | "[entity name]" | "stripe ceo" |

**For detailed playbook implementation**: See [references/playbooks.md](references/playbooks.md)

### Choosing Your Playbook

| If you have... | Consider... |
|----------------|-------------|
| Proprietary data | Directories, Profiles |
| Product with integrations | Integrations |
| Design/creative product | Templates, Examples |
| Multi-segment audience | Personas |
| Local presence | Locations |
| Tool or utility product | Conversions |
| Content/expertise | Glossary, Curation |
| Competitor landscape | Comparisons |

---

## Phase 3: Webflow CMS Setup

**IMPORTANT: After confirming the strategy and playbook, offer to set up the CMS in Webflow.**

### Step 1: Site Selection

Ask the user:
> "Would you like me to create the CMS collection in Webflow now? Which site should I use?"

Use the Webflow MCP tools to:
1. List available sites with `data_sites_tool > list_sites`
2. Let user select their target site

### Step 2: Create CMS Collection

Based on the chosen playbook, create a CMS collection with the recommended schema.

**For complete field schemas per playbook**: See [references/webflow-cms-schemas.md](references/webflow-cms-schemas.md)

Quick reference of collections per playbook:

| Playbook | Collection Name | Key Fields |
|----------|-----------------|------------|
| Locations | Locations | City Name, State, Hero Image, Local Description, Meta Title/Desc |
| Comparisons | Comparisons | Product A/B Names, Winner, Feature Comparison, Meta Title/Desc |
| Templates | Templates | Template Name, Category, Preview Image, File, Meta Title/Desc |
| Integrations | Integrations | Integration Name, Logo, Setup Guide, Use Cases, Meta Title/Desc |
| Personas | Personas | Persona Name, Pain Points, Key Features, Testimonial, Meta Title/Desc |
| Glossary | Glossary | Term, Definition, Examples, Related Terms, Meta Title/Desc |
| Directory | Directory | Name, Logo, Category, Pricing, Rating, Pros/Cons, Meta Title/Desc |
| Profiles | Profiles | Name, Type, Bio, Key Facts, Social Links, Meta Title/Desc |
| Curation | Best Lists | List Title, Category, The List, Methodology, Meta Title/Desc |
| Examples | Examples | Example Name, Screenshot, Why It Works, Takeaways, Meta Title/Desc |

### Step 3: Confirm and Create

After showing the recommended schema, ask:
> "Here's the recommended CMS structure for your [Playbook] strategy. Should I create this collection now? You can also customize the fields."

Then use `data_cms_tool` to:
1. Create the collection
2. Add all fields with appropriate types and help text

---

## Phase 4: Data Population

After CMS is created, offer data options:

### Option A: Generate Sample Data
> "Would you like me to add sample data so you can test the template? I'll create 3-5 realistic entries."

Generate contextually relevant demo data based on:
- The user's business context
- The chosen playbook
- Realistic SEO titles and descriptions

### Option B: Bulk Import
> "Do you have data ready to import? You can provide it as:
> - CSV file
> - JSON array
> - Or describe it and I'll help structure it"

### Option C: Manual Later
> "You can also add items manually in Webflow Designer later."

---

## Phase 5: Template Page Guidance

**Note: CMS Template Pages cannot be created via API - they require Webflow Designer.**

Provide playbook-specific instructions:

### For Any Playbook:

1. **Open Webflow Designer** for your site
2. **Find CMS Collection Pages** in the Pages panel
3. **Click the purple template page** for your collection
4. **Build the template** with these elements:

### Recommended Template Structure:

```
├── Hero Section
│   ├── H1 → Bind to Name/Title field
│   ├── Subtitle → Bind to Short Description
│   └── Hero Image → Bind to Image field
│
├── Main Content Section
│   ├── Rich Text Block → Bind to main content field
│   └── Supporting content → Bind to relevant fields
│
├── Sidebar (optional)
│   ├── Key Facts/Stats
│   └── Related Items → Collection List from same collection
│
├── CTA Section
│   └── Button with contextual CTA
│
└── SEO Settings (in Page Settings)
    ├── Title → Bind to Meta Title field
    ├── Meta Description → Bind to Meta Description field
    └── Open Graph Image → Bind to Hero Image
```

### Internal Linking Setup:

Add a **Collection List** at the bottom showing related items:
- Filter by same category/type
- Limit to 3-6 items
- Exclude current item

**For detailed binding instructions**: See [references/webflow-cms-schemas.md](references/webflow-cms-schemas.md#template-page-binding-guide)

---

## Quality Checks

### Pre-Launch Checklist

**Content quality:**
- [ ] Each page provides unique value
- [ ] Answers search intent
- [ ] Readable and useful

**Technical SEO:**
- [ ] Unique titles and meta descriptions
- [ ] Proper heading structure (H1 bound to main title)
- [ ] Schema markup implemented
- [ ] Page speed acceptable

**Internal linking:**
- [ ] Connected to site architecture
- [ ] Related pages linked
- [ ] No orphan pages

**Indexation:**
- [ ] In XML sitemap
- [ ] Crawlable
- [ ] No conflicting noindex

### Post-Launch Monitoring

Track: Indexation rate, Rankings, Traffic, Engagement, Conversion

Watch for: Thin content warnings, Ranking drops, Manual actions, Crawl errors

---

## Common Mistakes

- **Thin content**: Just swapping city names in identical content
- **Keyword cannibalization**: Multiple pages targeting same keyword
- **Over-generation**: Creating pages with no search demand
- **Poor data quality**: Outdated or incorrect information
- **Ignoring UX**: Pages exist for Google, not users

---

## References

- [Playbook Details](references/playbooks.md) - Deep dive into each of the 12 playbooks
- [Webflow CMS Schemas](references/webflow-cms-schemas.md) - Field definitions and MCP tool usage

---

## Related Skills

- **seo-audit**: For auditing programmatic pages after launch
- **schema-markup**: For adding structured data
- **competitor-alternatives**: For comparison page frameworks
