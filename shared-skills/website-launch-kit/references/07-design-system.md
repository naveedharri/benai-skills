# Design System

Create distinctive, non-generic designs based on user input and inspiration analysis.

## Core Philosophy

**The intake conversation shapes every design decision.**

| User Said | Design Implication |
|-----------|-------------------|
| "Bold and confident" | Large typography, strong contrast, punchy animations |
| "Calm and trustworthy" | Generous whitespace, soft colors, subtle motion |
| "Playful and fun" | Bright accents, rounded corners, bouncy animations |
| "Premium and exclusive" | Dark theme, refined details, elegant typography |
| "Modern and minimal" | Clean lines, limited palette, functional layout |

---

## Anti-Template Principles

### What Makes a Site Look Generic

- Default system fonts
- Stock Bootstrap/Tailwind color palettes
- Predictable centered layouts
- Cookie-cutter card grids
- No intentional motion
- Equal spacing everywhere

### What Makes a Site Distinctive

- Intentional typography pairing
- Custom color palette with personality
- Asymmetric or unexpected layouts
- Thoughtful use of space (generous or tight)
- Purposeful animations
- Visual surprises that reinforce the brand

---

## Typography System

### Font Selection

Based on inspiration analysis and tone:

| Vibe | Heading Font Style | Body Font Style |
|------|-------------------|-----------------|
| Modern/Tech | Geometric sans (Inter, Space Grotesk) | Clean sans |
| Premium/Luxury | Elegant serif (Playfair, Fraunces) | Refined sans |
| Friendly/Approachable | Rounded sans (Nunito, Quicksand) | Readable sans |
| Bold/Confident | Strong sans (Bebas, Oswald, Montserrat) | Clean sans |
| Creative/Artistic | Display fonts (custom per project) | Contrasting body |

### Typography Scale

```css
/* Base scale - adjust per project */
--text-xs: 0.75rem;    /* 12px - labels, captions */
--text-sm: 0.875rem;   /* 14px - small text */
--text-base: 1rem;     /* 16px - body */
--text-lg: 1.125rem;   /* 18px - large body */
--text-xl: 1.25rem;    /* 20px - small headings */
--text-2xl: 1.5rem;    /* 24px - h4 */
--text-3xl: 1.875rem;  /* 30px - h3 */
--text-4xl: 2.25rem;   /* 36px - h2 */
--text-5xl: 3rem;      /* 48px - h1 */
--text-6xl: 3.75rem;   /* 60px - hero */
--text-7xl: 4.5rem;    /* 72px - impact */
```

### Typography Treatments

**Make headlines distinctive:**
```css
/* Tight letter-spacing for impact */
.headline-tight { letter-spacing: -0.02em; }

/* Wide letter-spacing for elegance */
.headline-wide { letter-spacing: 0.1em; text-transform: uppercase; }

/* Gradient text for modern feel */
.headline-gradient {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## Color System

### Building a Custom Palette

From the inspiration analysis, create:

```css
:root {
  /* Primary - main brand color */
  --color-primary: #XXXXXX;
  --color-primary-light: #XXXXXX;  /* Hover, backgrounds */
  --color-primary-dark: #XXXXXX;   /* Active states */

  /* Accent - pop color for CTAs, highlights */
  --color-accent: #XXXXXX;

  /* Neutral - text and backgrounds */
  --color-foreground: #XXXXXX;     /* Main text */
  --color-muted: #XXXXXX;          /* Secondary text */
  --color-background: #XXXXXX;     /* Page bg */
  --color-surface: #XXXXXX;        /* Cards, sections */

  /* Semantic */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

### Color Application Rules

| Element | Color |
|---------|-------|
| Page background | background |
| Section alternates | surface or slight tint |
| Primary text | foreground |
| Secondary text | muted |
| Links | primary |
| CTAs | accent (if different) or primary |
| Highlights | primary-light or accent |

---

## Spacing System

### Spacing Scale

```css
/* Tailwind-compatible scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

### Spacing Application

| Context | Spacing |
|---------|---------|
| Between sections | 96-128px (generous) |
| Within sections | 48-64px |
| Card padding | 24-32px |
| Button padding | 12-16px vertical, 24-32px horizontal |
| Text line-height | 1.5-1.7 for body |

---

## Layout Patterns

### Breaking the Grid

Don't just center everything. Consider:

**Asymmetric splits:**
```
|  40%  |     60%      |
| text  |    image     |
```

**Overlapping elements:**
```
     ┌──────────────┐
     │    image     │
     │      ┌───────┴───────┐
     └──────┤    card       │
            └───────────────┘
```

**Edge-to-edge with contained text:**
```
|------------------------|
| image full width       |
|------------------------|
    | contained text |
```

**Diagonal flow:**
```
┌─────┐
│  1  │
└─────┘
        ┌─────┐
        │  2  │
        └─────┘
                ┌─────┐
                │  3  │
                └─────┘
```

### Section Layout Variety

Alternate layouts to create rhythm:

```
Section 1: Centered hero, text-focused
Section 2: Left-aligned problem, cards
Section 3: Right image, left text (asymmetric)
Section 4: Full-width visual, centered text overlay
Section 5: Grid of testimonials
Section 6: Centered CTA
```

---

## Visual Details

### Shadows

```css
/* Subtle - cards, inputs */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);

/* Default - elevated cards */
--shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);

/* Large - modals, popovers */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

/* Colored shadow - brand feel */
--shadow-primary: 0 4px 14px 0 rgba(var(--color-primary-rgb), 0.3);
```

### Borders and Radius

```css
/* Radius scale */
--radius-sm: 0.25rem;   /* Subtle rounding */
--radius: 0.5rem;       /* Default */
--radius-md: 0.75rem;   /* Cards */
--radius-lg: 1rem;      /* Large cards */
--radius-xl: 1.5rem;    /* Sections */
--radius-full: 9999px;  /* Pills, circles */
```

### Gradients

```css
/* Subtle background gradient */
.bg-gradient-subtle {
  background: linear-gradient(180deg, var(--color-surface) 0%, var(--color-background) 100%);
}

/* Hero gradient */
.bg-gradient-hero {
  background: radial-gradient(ellipse at top, var(--color-primary-light) 0%, transparent 50%);
}

/* Text gradient */
.text-gradient {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## Animation Principles

### Page Load Sequence

Stagger elements for a polished entrance:

```typescript
// Using Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
```

### Scroll Animations

Reveal sections as they enter viewport:

```typescript
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function Section({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
```

### Hover Effects

Subtle but noticeable:

```css
/* Button hover */
.btn {
  transition: all 0.2s ease;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Card hover */
.card {
  transition: all 0.3s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile first */
--screen-sm: 640px;   /* Small tablets */
--screen-md: 768px;   /* Tablets */
--screen-lg: 1024px;  /* Laptops */
--screen-xl: 1280px;  /* Desktops */
--screen-2xl: 1536px; /* Large screens */
```

### Mobile Considerations

- Touch targets minimum 44x44px
- Reduce section spacing on mobile
- Stack horizontal layouts
- Simplify animations (reduce motion)
- Font sizes adjust down proportionally

---

## Visual Assets by Business Type

Choose the right assets based on business context. See `12-visual-assets.md` for full guide.

### Service Businesses (Agency, Consulting, Coaching)

| Section | Asset |
|---------|-------|
| Hero | Text-focused, no image needed |
| Problem | Icons (lucide-react) |
| Solution | Icons |
| Process | Numbered steps with icons |
| Social Proof | Client logos (request) or none |
| CTA | No visual |

**Icon style:** Outlined (lucide), consistent 24-32px size

### Product/SaaS Businesses

| Section | Asset |
|---------|-------|
| Hero | Product mockup (AI-generated) |
| Features | Product screenshots + icons |
| Problem/Solution | Icons or illustrations |
| Social Proof | User avatars (request) |

**Image generation:** Use for mockups, UI screenshots, abstract visuals

### Never Generate

- Human faces (request from client)
- Client logos
- Copyrighted content

---

## Design Checklist

Before development, confirm:

- [ ] Typography: Heading + body fonts selected
- [ ] Colors: Full palette defined with CSS variables
- [ ] Spacing: Section and element spacing decided
- [ ] Layout: Each section layout sketched
- [ ] Motion: Animation level (none/subtle/dramatic)
- [ ] Details: Shadows, borders, radius defined
- [ ] Responsive: Mobile adaptations planned
- [ ] Visual assets: Icons identified, images generated

