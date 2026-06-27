# Webflow CMS Schemas for Programmatic SEO

This reference contains the recommended CMS collection schemas for each programmatic SEO playbook, optimized for Webflow implementation.

---

## How to Use This Reference

1. **Choose your playbook** from the main skill
2. **Find the matching schema** below
3. **Create the collection** using Webflow MCP tools
4. **Add fields** in the order listed (required fields first)

---

## Field Type Reference

| Webflow Type | Use For | MCP Action |
|--------------|---------|------------|
| PlainText | Short text, titles, keywords | `create_collection_static_field` |
| RichText | Long content, formatted text | `create_collection_static_field` |
| Image | Photos, logos, screenshots | `create_collection_static_field` |
| File | Downloadable assets | `create_collection_static_field` |
| Link | URLs, external links | `create_collection_static_field` |
| Number | Ratings, coordinates, counts | `create_collection_static_field` |
| Switch | Boolean flags (featured, active) | `create_collection_static_field` |
| DateTime | Dates, timestamps | `create_collection_static_field` |
| Option | Single-select dropdown | `create_collection_option_field` |
| Reference | Link to another collection item | `create_collection_reference_field` |
| MultiReference | Link to multiple items | `create_collection_reference_field` |

---

## Playbook Schemas

### 1. Locations

**Collection Name:** `Locations`
**Slug:** `locations`
**URL Pattern:** `/locations/[city-slug]/`

| Field | Type | Required | Help Text |
|-------|------|----------|-----------|
| City Name | PlainText | Yes | City name (e.g., "Austin") |
| State/Region | PlainText | No | State or region (e.g., "Texas") |
| Country | PlainText | No | Country name |
| Hero Image | Image | No | Location hero image (1200x630 recommended) |
| Local Description | RichText | No | Unique content about this location |
| Services Available | RichText | No | What services/products are offered here |
| Local Stats | RichText | No | Location-specific data points |
| Meta Title | PlainText | No | SEO title (50-60 chars) |
| Meta Description | PlainText | No | SEO description (150-160 chars) |
| Latitude | Number | No | For map integration |
| Longitude | Number | No | For map integration |

**Sample Data:**
```json
{
  "name": "Austin",
  "slug": "austin",
  "city-name": "Austin",
  "state-region": "Texas",
  "country": "USA",
  "meta-title": "Best Coworking Spaces in Austin, TX | YourBrand",
  "meta-description": "Discover the top coworking spaces in Austin. Compare amenities, pricing, and locations to find your perfect workspace."
}
```

---

### 2. Comparisons

**Collection Name:** `Comparisons`
**Slug:** `comparisons`
**URL Pattern:** `/compare/[product-a]-vs-[product-b]/`

| Field | Type | Required | Help Text |
|-------|------|----------|-----------|
| Comparison Title | PlainText | Yes | Full title (e.g., "Webflow vs WordPress") |
| Product A Name | PlainText | Yes | First product name |
| Product A Logo | Image | No | First product logo (200x200) |
| Product B Name | PlainText | Yes | Second product name |
| Product B Logo | Image | No | Second product logo (200x200) |
| Winner | Option | No | Options: "Product A", "Product B", "Tie", "Depends on Use Case" |
| Quick Verdict | PlainText | No | One-line summary of recommendation |
| Summary | RichText | No | Overview of the comparison |
| Feature Comparison | RichText | No | Detailed feature-by-feature breakdown |
| Pricing Comparison | RichText | No | Pricing details for both |
| Best For | PlainText | No | Who should choose which (e.g., "Webflow for designers, WordPress for bloggers") |
| Meta Title | PlainText | No | SEO title (50-60 chars) |
| Meta Description | PlainText | No | SEO description (150-160 chars) |

**Sample Data:**
```json
{
  "name": "Webflow vs WordPress",
  "slug": "webflow-vs-wordpress",
  "comparison-title": "Webflow vs WordPress",
  "product-a-name": "Webflow",
  "product-b-name": "WordPress",
  "winner": "Depends on Use Case",
  "quick-verdict": "Webflow for designers, WordPress for content-heavy sites",
  "meta-title": "Webflow vs WordPress 2024: Which Is Better?",
  "meta-description": "Detailed comparison of Webflow and WordPress. Compare features, pricing, ease of use, and find which website builder is right for you."
}
```

---

### 3. Templates

**Collection Name:** `Templates`
**Slug:** `templates`
**URL Pattern:** `/templates/[category]/[template-slug]/`

| Field | Type | Required | Help Text |
|-------|------|----------|-----------|
| Template Name | PlainText | Yes | Template name (e.g., "Minimal Resume") |
| Category | Option | No | Options: Define based on your template types |
| Preview Image | Image | Yes | Template preview (1200x800 recommended) |
| Template File | File | No | Downloadable template file |
| Short Description | PlainText | No | One-line description |
| Description | RichText | No | Full template description |
| Use Cases | RichText | No | When to use this template |
| Features | RichText | No | What's included |
| Is Free | Switch | No | Whether template is free |
| Meta Title | PlainText | No | SEO title (50-60 chars) |
| Meta Description | PlainText | No | SEO description (150-160 chars) |

**Category Options Example:**
- Resume
- Invoice
- Proposal
- Pitch Deck
- Social Media
- Email

---

### 4. Integrations

**Collection Name:** `Integrations`
**Slug:** `integrations`
**URL Pattern:** `/integrations/[integration-slug]/`

| Field | Type | Required | Help Text |
|-------|------|----------|-----------|
| Integration Name | PlainText | Yes | Partner product name (e.g., "Slack") |
| Partner Logo | Image | No | Partner logo (400x400, transparent PNG) |
| Category | Option | No | Options: Communication, CRM, Analytics, Marketing, Productivity, etc. |
| Short Description | PlainText | No | One-line integration description |
| What It Does | RichText | No | What the integration enables |
| Setup Guide | RichText | No | Step-by-step setup instructions |
| Use Cases | RichText | No | Example workflows and use cases |
| Documentation URL | Link | No | Link to detailed docs |
| Is Featured | Switch | No | Show on integrations homepage |
| Is Native | Switch | No | Native vs third-party (Zapier) |
| Meta Title | PlainText | No | SEO title (50-60 chars) |
| Meta Description | PlainText | No | SEO description (150-160 chars) |

**Category Options:**
- Communication (Slack, Discord, Teams)
- CRM (Salesforce, HubSpot, Pipedrive)
- Analytics (Google Analytics, Mixpanel, Amplitude)
- Marketing (Mailchimp, ActiveCampaign, Klaviyo)
- Productivity (Notion, Asana, Monday)
- Storage (Google Drive, Dropbox, OneDrive)
- Payment (Stripe, PayPal, Square)

---

### 5. Personas

**Collection Name:** `Personas`
**Slug:** `personas`
**URL Pattern:** `/for/[persona-slug]/` or `/solutions/[industry-slug]/`

| Field | Type | Required | Help Text |
|-------|------|----------|-----------|
| Persona Name | PlainText | Yes | Audience name (e.g., "Real Estate Agents") |
| Industry | PlainText | No | Industry category |
| Hero Image | Image | No | Relevant hero image |
| Tagline | PlainText | No | Compelling one-liner for this audience |
| Pain Points | RichText | No | Problems this audience faces |
| Key Features | RichText | No | Features that solve their problems |
| Benefits | RichText | No | Outcomes they can expect |
| Testimonial Quote | PlainText | No | Quote from customer in this segment |
| Testimonial Author | PlainText | No | Name and title of testimonial author |
| Testimonial Image | Image | No | Photo of testimonial author |
| CTA Text | PlainText | No | Custom CTA (e.g., "Start free trial for agencies") |
| Meta Title | PlainText | No | SEO title (50-60 chars) |
| Meta Description | PlainText | No | SEO description (150-160 chars) |

---

### 6. Glossary

**Collection Name:** `Glossary`
**Slug:** `glossary`
**URL Pattern:** `/glossary/[term-slug]/`

| Field | Type | Required | Help Text |
|-------|------|----------|-----------|
| Term | PlainText | Yes | The term being defined |
| Short Definition | PlainText | No | One-sentence definition |
| Full Definition | RichText | No | Comprehensive explanation |
| Examples | RichText | No | Real-world examples |
| Related Terms | MultiReference | No | Link to related glossary items |
| Category | Option | No | Topic category |
| Pronunciation | PlainText | No | How to pronounce (if needed) |
| Acronym Expansion | PlainText | No | What the acronym stands for |
| Meta Title | PlainText | No | SEO title (50-60 chars) |
| Meta Description | PlainText | No | SEO description (150-160 chars) |

**Note:** For Related Terms, you'll need to create the collection first, then add the MultiReference field pointing to itself.

---

### 7. Directory

**Collection Name:** `Directory`
**Slug:** `directory`
**URL Pattern:** `/directory/[category]/[listing-slug]/`

| Field | Type | Required | Help Text |
|-------|------|----------|-----------|
| Name | PlainText | Yes | Company or tool name |
| Logo | Image | No | Logo (400x400, transparent PNG) |
| Category | Option or Reference | No | Primary category |
| Short Description | PlainText | No | One-line description (under 160 chars) |
| Full Description | RichText | No | Detailed description |
| Website URL | Link | No | Official website |
| Pricing | PlainText | No | Pricing summary (e.g., "Free / $29/mo / Enterprise") |
| Pricing Model | Option | No | Options: Free, Freemium, Paid, Enterprise |
| Rating | Number | No | Rating out of 5 |
| Pros | RichText | No | Key advantages |
| Cons | RichText | No | Limitations or drawbacks |
| Features | RichText | No | Feature list |
| Is Featured | Switch | No | Highlight on category page |
| Is Verified | Switch | No | Verified listing badge |
| Meta Title | PlainText | No | SEO title (50-60 chars) |
| Meta Description | PlainText | No | SEO description (150-160 chars) |

---

### 8. Profiles

**Collection Name:** `Profiles`
**Slug:** `profiles`
**URL Pattern:** `/people/[name-slug]/` or `/companies/[name-slug]/`

| Field | Type | Required | Help Text |
|-------|------|----------|-----------|
| Name | PlainText | Yes | Person or company name |
| Profile Type | Option | No | Options: Person, Company, Product |
| Photo/Logo | Image | No | Profile image (800x800) |
| Title/Tagline | PlainText | No | Job title or company tagline |
| Short Bio | PlainText | No | Brief bio (under 200 chars) |
| Full Bio | RichText | No | Complete biography or company story |
| Key Facts | RichText | No | Notable achievements, stats, milestones |
| Twitter URL | Link | No | Twitter/X profile |
| LinkedIn URL | Link | No | LinkedIn profile |
| Website URL | Link | No | Personal or company website |
| Related Profiles | MultiReference | No | Connected people or companies |
| Meta Title | PlainText | No | SEO title (50-60 chars) |
| Meta Description | PlainText | No | SEO description (150-160 chars) |

---

### 9. Curation (Best Lists)

**Collection Name:** `Best Lists`
**Slug:** `best`
**URL Pattern:** `/best/[category-slug]/`

| Field | Type | Required | Help Text |
|-------|------|----------|-----------|
| List Title | PlainText | Yes | Full title (e.g., "Best CRM Software 2024") |
| Category | PlainText | No | Category being curated |
| Year | Number | No | Year of the list (for updates) |
| Introduction | RichText | No | Context and overview |
| The List | RichText | No | Ranked items with details |
| Methodology | RichText | No | How you evaluated the options |
| FAQ | RichText | No | Common questions about this category |
| Last Updated | DateTime | No | When the list was last reviewed |
| Meta Title | PlainText | No | SEO title (50-60 chars) |
| Meta Description | PlainText | No | SEO description (150-160 chars) |

---

### 10. Examples/Inspiration

**Collection Name:** `Examples`
**Slug:** `examples`
**URL Pattern:** `/examples/[category]/[example-slug]/`

| Field | Type | Required | Help Text |
|-------|------|----------|-----------|
| Example Name | PlainText | Yes | Name (e.g., "Stripe Landing Page") |
| Category | Option or Reference | No | Example category |
| Screenshot | Image | Yes | Full-page or section screenshot |
| Website URL | Link | No | Live URL (if public) |
| Company | PlainText | No | Company behind the example |
| Why It Works | RichText | No | Analysis of what makes it effective |
| Key Takeaways | RichText | No | Lessons to apply |
| Design Elements | RichText | No | Notable design patterns used |
| Tags | PlainText | No | Comma-separated tags |
| Is Featured | Switch | No | Show in featured section |
| Meta Title | PlainText | No | SEO title (50-60 chars) |
| Meta Description | PlainText | No | SEO description (150-160 chars) |

---

## Webflow MCP Quick Reference

### Creating a Collection

```
Tool: data_cms_tool
Action: create_collection
Parameters:
  - siteId: [your-site-id]
  - request:
      displayName: "Collection Name"
      singularName: "Item Name"
      slug: "collection-slug"
```

### Adding Fields

**PlainText Field:**
```
Tool: data_cms_tool
Action: create_collection_static_field
Parameters:
  - collection_id: [collection-id]
  - request:
      type: "PlainText"
      displayName: "Field Name"
      isRequired: true/false
      helpText: "Help text for editors"
```

**RichText Field:**
```
Tool: data_cms_tool
Action: create_collection_static_field
Parameters:
  - collection_id: [collection-id]
  - request:
      type: "RichText"
      displayName: "Field Name"
      helpText: "Help text for editors"
```

**Image Field:**
```
Tool: data_cms_tool
Action: create_collection_static_field
Parameters:
  - collection_id: [collection-id]
  - request:
      type: "Image"
      displayName: "Field Name"
      helpText: "Recommended size: WxH"
```

**Option Field:**
```
Tool: data_cms_tool
Action: create_collection_option_field
Parameters:
  - collection_id: [collection-id]
  - request:
      type: "Option"
      displayName: "Field Name"
      metadata:
        options:
          - name: "Option 1"
          - name: "Option 2"
          - name: "Option 3"
```

**Reference Field:**
```
Tool: data_cms_tool
Action: create_collection_reference_field
Parameters:
  - collection_id: [collection-id]
  - request:
      type: "Reference" (or "MultiReference")
      displayName: "Field Name"
      metadata:
        collectionId: [target-collection-id]
```

### Adding Items

```
Tool: data_cms_tool
Action: create_collection_items
Parameters:
  - collection_id: [collection-id]
  - request:
      isDraft: false
      isArchived: false
      cmsLocaleIds: ["locale-id"]
      fieldData:
        - name: "Item Name"
          slug: "item-slug"
          field-slug: "field value"
```

### Publishing Items

```
Tool: data_cms_tool
Action: publish_collection_items
Parameters:
  - collection_id: [collection-id]
  - request:
      itemIds: ["item-id-1", "item-id-2"]
```

---

## Template Page Binding Guide

After creating your CMS collection, you need to build the template page in Webflow Designer. Here's how to bind fields:

### SEO Settings (Critical)

1. Open your CMS template page in Designer
2. Click the gear icon (Page Settings)
3. Scroll to **SEO Settings**
4. Click the purple "Connect to CMS" icon next to each field:
   - **Title Tag** → Bind to `Meta Title` field
   - **Meta Description** → Bind to `Meta Description` field
5. Scroll to **Open Graph Settings**
   - **OG Title** → Bind to `Meta Title` or `Name`
   - **OG Description** → Bind to `Meta Description`
   - **OG Image** → Bind to `Hero Image` or `Screenshot`

### Content Binding

1. Select any text element (H1, paragraph, etc.)
2. Click the purple "Connect to CMS" icon in the settings panel
3. Select the appropriate field

### Image Binding

1. Select an image element
2. In settings, find "Get image from"
3. Select your image field

### Conditional Visibility

1. Select any element
2. Go to Settings → Conditional Visibility
3. Add conditions based on field values (e.g., show badge only if `Is Featured` is on)
