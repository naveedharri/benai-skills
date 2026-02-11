# Visual Assets Guide

How to use icons and AI-generated images in landing pages.

---

## Decision Tree: Icons vs Images

```
What asset do you need?
│
├── Abstract concept (speed, security, growth)?
│   └── Use ICONS
│
├── UI element (checkmark, arrow, menu)?
│   └── Use ICONS
│
├── Product screenshot or mockup?
│   └── Use AI-GENERATED IMAGE
│
├── Hero visual for SaaS/tech?
│   └── Use AI-GENERATED IMAGE
│
├── Team/founder photo?
│   └── REQUEST FROM CLIENT (don't generate faces)
│
├── Client logos?
│   └── REQUEST FROM CLIENT
│
└── Decorative/ambient visual?
    └── Use AI-GENERATED IMAGE (abstract patterns, gradients)
```

---

## Icons

### Recommended Library: Lucide React

**Why Lucide:** Clean, modern, consistent stroke width, tree-shakeable, MIT licensed.

**Installation:**
```bash
npm install lucide-react
```

**Basic Usage:**
```tsx
import { Home, ArrowRight, Check, X } from 'lucide-react';

<Home className="w-6 h-6" />
<ArrowRight className="w-4 h-4 text-primary" />
```

### Finding Icons

Use the `better-icons` CLI to search across 150+ collections:

```bash
# Search for icons
npx better-icons search arrow
npx better-icons search home --prefix lucide --limit 10

# Get SVG directly
npx better-icons get lucide:home > icon.svg

# With options
npx better-icons get lucide:check --color '#333' --size 24
```

### Icon Collections (Priority Order)

| Collection | Prefix | Style | Best For |
|------------|--------|-------|----------|
| **Lucide** | `lucide` | Outlined, 24px | Default choice |
| **Heroicons** | `heroicons` | Outlined/Solid | Tailwind projects |
| **Phosphor** | `ph` | Outlined, playful | Friendly brands |
| **Tabler** | `tabler` | Outlined, 24px | Extensive set |
| **Radix** | `radix-icons` | Minimal, 15px | Subtle UI |

### Icon Style Guidelines

| Guideline | Rule |
|-----------|------|
| Consistency | Use ONE collection per project |
| Size | 20-24px for inline, 32-48px for features |
| Color | `currentColor` (inherits text color) |
| Stroke width | Keep default (usually 1.5-2px) |

---

## AI Image Generation

### Primary Method: Gemini Image Generation

Use the built-in `generate_image` tool for:
- Product mockups
- Hero visuals
- Conceptual illustrations
- Abstract patterns
- Marketing graphics

**Prompt Tips for Landing Pages:**

```
Product mockup:
"Professional product mockup of [product] on a minimal desk setup, 
soft lighting, clean white background, high-quality photography"

Hero visual:
"Modern tech startup illustration, abstract geometric shapes, 
gradient colors [primary color] to [secondary color], 
minimalist style, no text"

Feature illustration:
"Simple flat illustration representing [concept], 
using [brand color], clean lines, white background"
```

### Advanced: inference.sh (Optional)

For more control over AI models, use inference.sh:

```bash
# Install CLI
curl -fsSL https://cli.inference.sh | sh && infsh login

# Generate with FLUX
infsh app run falai/flux-dev-lora --input '{
  "prompt": "professional SaaS dashboard interface mockup"
}'

# High quality with Seedream
infsh app run bytedance/seedream-4-5 --input '{
  "prompt": "cinematic product shot, studio lighting"
}'
```

**Available models:**
| Model | Best For |
|-------|----------|
| `falai/flux-dev-lora` | High quality, custom styles |
| `google/gemini-3-pro-image-preview` | Google's latest |
| `bytedance/seedream-4-5` | 4K cinematic quality |
| `falai/reve` | Text rendering in images |

---

## Section-by-Section Visual Guide

### Hero Section

| Business Type | Visual Approach |
|---------------|-----------------|
| **Service** | Text-focused, no image or subtle gradient |
| **SaaS** | Product screenshot/mockup (AI-generated) |
| **Agency** | Abstract illustration or gradient |

```tsx
// Service: Text-focused hero (no image)
<Hero headline="..." subtitle="..." />

// SaaS: With product image
<Hero 
  headline="..." 
  image="/product-mockup.png" // AI-generated
/>
```

### Problem Section (3 Cards)

**Always use icons.** Generate appropriate icons based on the problem.

```tsx
<Problem
  headline="Sound familiar?"
  problems={[
    {
      title: "...",
      description: "...",
      icon: <Clock className="w-8 h-8" />, // Time-related problem
    },
    {
      title: "...",
      icon: <AlertTriangle className="w-8 h-8" />, // Risk/warning
    },
    {
      title: "...",
      icon: <TrendingDown className="w-8 h-8" />, // Decline/loss
    },
  ]}
/>
```

### Solution/Features Section

**Use icons for service businesses, images for products.**

```tsx
// Service: Icons
<Feature icon={<Zap />} title="Fast" description="..." />
<Feature icon={<Shield />} title="Secure" description="..." />
<Feature icon={<Sparkles />} title="Smart" description="..." />

// Product: Product screenshots
<Feature image="/feature-1.png" title="..." description="..." />
```

### Process Section

**Always use numbered steps with optional icons.**

```tsx
<Process
  steps={[
    { number: 1, title: "Discovery", icon: <Search /> },
    { number: 2, title: "Strategy", icon: <Target /> },
    { number: 3, title: "Design", icon: <Palette /> },
    { number: 4, title: "Launch", icon: <Rocket /> },
  ]}
/>
```

### Testimonials

**Avatar photos optional.** If client doesn't provide photos:
- Use initials/placeholder
- Or use abstract shapes

```tsx
// With photo (from client)
<Testimonial image="/client-photo.jpg" />

// Without photo (initials)
<Testimonial initials="JD" />
```

---

## Quick Reference

### Common Icons by Use Case

| Use Case | Lucide Icon |
|----------|-------------|
| Time/Speed | `Clock`, `Timer`, `Zap` |
| Security | `Shield`, `Lock`, `ShieldCheck` |
| Growth | `TrendingUp`, `ArrowUpRight`, `Rocket` |
| Money | `DollarSign`, `Wallet`, `PiggyBank` |
| Communication | `Mail`, `MessageCircle`, `Phone` |
| Success | `Check`, `CheckCircle`, `Award` |
| Warning | `AlertTriangle`, `AlertCircle`, `X` |
| Navigation | `ArrowRight`, `ChevronRight`, `ExternalLink` |
| Users | `User`, `Users`, `UserCheck` |
| Settings | `Settings`, `Cog`, `Sliders` |
| Search | `Search`, `Filter`, `Scan` |
| Data | `BarChart`, `LineChart`, `PieChart` |

### Image Generation Prompts by Section

| Section | Prompt Template |
|---------|-----------------|
| **Hero** | "Modern [industry] hero illustration, abstract, [brand colors], minimalist, no text" |
| **Product** | "Clean mockup of [product type], on [surface], soft shadows, studio lighting" |
| **Feature** | "Simple icon illustration representing [concept], flat design, [color]" |
| **Background** | "Abstract gradient pattern, subtle, [colors], seamless" |

---

## Do NOT Generate

- Human faces (use client photos or skip)
- Client/company logos
- Text-heavy graphics (use actual text)
- Copyrighted content
