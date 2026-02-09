# Code Architecture

Flexible project setup for landing pages. Choose the right stack for the project.

## Stack Selection

Choose based on project needs:

| Requirement | Recommended Stack |
|-------------|------------------|
| Simple landing page | Vite + React + Tailwind |
| Needs SEO/SSR | Next.js + Tailwind |
| Needs CMS | Next.js + Sanity/Contentful |
| Needs forms/backend | Next.js with API routes |
| Client prefers | Whatever they specify |

**Default recommendation:** Next.js + Tailwind (best balance of features + SEO)

---

## Project Setup

### Next.js + Tailwind (Recommended)

```bash
npx create-next-app@latest [project-name] --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

This gives you:
- `/src/app` - App router pages
- `/src/components` - React components
- Tailwind CSS configured
- TypeScript ready

### Vite + React (Simpler)

```bash
npm create vite@latest [project-name] -- --template react-ts
cd [project-name]
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## Folder Structure

```
src/
├── app/                    # Next.js app router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (the landing page)
│   └── globals.css         # Global styles + Tailwind
├── components/
│   ├── ui/                 # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── sections/           # Landing page sections
│   │   ├── hero.tsx
│   │   ├── problem.tsx
│   │   ├── solution.tsx
│   │   ├── process.tsx
│   │   ├── testimonials.tsx
│   │   ├── faq.tsx
│   │   ├── cta.tsx
│   │   └── footer.tsx
│   └── layout/             # Layout components
│       ├── header.tsx
│       ├── container.tsx
│       └── section-wrapper.tsx
├── lib/
│   └── utils.ts            # Utility functions (cn, etc.)
├── styles/
│   └── fonts.ts            # Font configuration
└── types/
    └── index.ts            # TypeScript types
```

---

## Essential Dependencies

### Always Install

```bash
npm install clsx tailwind-merge
npm install lucide-react        # Icons
npm install framer-motion       # Animations (optional but recommended)
```

### Utility Function (lib/utils.ts)

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Component Sources

### shadcn/ui as Reference

Use shadcn/ui for component structure and accessibility patterns, then customize heavily.

**How to use:**
1. Look up the component on ui.shadcn.com
2. Understand the structure and accessibility features
3. Build your own version with custom styling

**What to take:**
- Radix UI primitives for accessibility
- Component structure patterns
- Keyboard navigation handling

**What to customize:**
- All visual styling
- Colors, spacing, borders
- Animations and transitions
- Typography

### Installing shadcn/ui (Optional)

If you want to use as a starting point:

```bash
npx shadcn@latest init
npx shadcn@latest add button card input
```

Then modify the components in `components/ui/` extensively.

---

## Tailwind Configuration

### Extend with Custom Design Tokens

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Custom colors from research phase
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      spacing: {
        // Custom spacing scale if needed
        'section': 'var(--spacing-section)',
      },
      borderRadius: {
        'brand': 'var(--radius)',
      },
    },
  },
}
```

### CSS Variables (globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Colors - populated from research phase */
  --color-primary: #XXXXXX;
  --color-primary-foreground: #XXXXXX;
  --color-secondary: #XXXXXX;
  --color-secondary-foreground: #XXXXXX;
  --color-accent: #XXXXXX;
  --color-accent-foreground: #XXXXXX;
  --color-background: #XXXXXX;
  --color-foreground: #XXXXXX;
  --color-muted: #XXXXXX;
  --color-muted-foreground: #XXXXXX;

  /* Typography */
  --font-heading: 'Font Name';
  --font-body: 'Font Name';

  /* Spacing */
  --spacing-section: 6rem;

  /* Borders */
  --radius: 0.5rem;
}
```

---

## Font Setup

### Using Google Fonts (Next.js)

```typescript
// src/styles/fonts.ts
import { Inter, Playfair_Display } from 'next/font/google';

export const fontHeading = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});
```

```typescript
// src/app/layout.tsx
import { fontHeading, fontBody } from '@/styles/fonts';

export default function RootLayout({ children }) {
  return (
    <html className={`${fontHeading.variable} ${fontBody.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
```

---

## Image Handling

### Next.js Image Component

```typescript
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Description"
  width={1200}
  height={800}
  priority // For above-the-fold images
  className="object-cover"
/>
```

### Placeholder Images

During development, use placeholder services:
- `https://placehold.co/1200x800`
- `https://picsum.photos/1200/800`

---

## Form Handling

### Basic Form with Validation

```typescript
// Using React Hook Form + Zod (optional)
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

---

## Main Page Structure

```typescript
// src/app/page.tsx
import { Hero } from '@/components/sections/hero';
import { Problem } from '@/components/sections/problem';
import { Solution } from '@/components/sections/solution';
import { Process } from '@/components/sections/process';
import { Testimonials } from '@/components/sections/testimonials';
import { FAQ } from '@/components/sections/faq';
import { CTA } from '@/components/sections/cta';
import { Footer } from '@/components/sections/footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <Problem />
      <Solution />
      <Process />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
```

---

## SEO Setup

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title | Brand Name',
  description: 'Meta description from intake',
  openGraph: {
    title: 'Page Title',
    description: 'Description',
    images: ['/og-image.jpg'],
  },
};
```

---

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run linter
```
