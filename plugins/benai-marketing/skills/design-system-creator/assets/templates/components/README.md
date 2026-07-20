# Components

React + Tailwind starters. Pair them with [`../tokens/tailwind.preset.js`](../tokens/tailwind.preset.js).

These are intentionally thin — accessibility primitives, {{BRAND_NAME}} styling, no design system bloat. Drop them into a Next.js / Vite project, extend as needed.

Because every component consumes Tailwind classes (`bg-brand-600`, `text-ink-900`, etc.) that resolve through the generated preset, these files are drop-in for any brand that produced its tokens via this skill — no per-brand edits required.

## Dependencies

```bash
npm install react lucide-react class-variance-authority clsx tailwind-merge
```

Tailwind config:

```js
// tailwind.config.js
const brand = require('./design-system/tokens/tailwind.preset.js')
module.exports = {
  presets: [brand],
  content: ['./app/**/*.{ts,tsx,mdx}', './design-system/components/**/*.tsx'],
}
```

## Inventory

| Component                          | Use                                           |
| ---------------------------------- | --------------------------------------------- |
| [button.tsx](button.tsx)           | Primary / secondary / ghost / link           |
| [input.tsx](input.tsx)             | Text input + textarea, with label and error  |
| [card.tsx](card.tsx)               | Default card surface                          |
| [feature-card.tsx](feature-card.tsx) | Icon-chip + title + body card              |
| [badge.tsx](badge.tsx)             | Small status / category pill                  |
| [nav.tsx](nav.tsx)                 | Top navigation bar with mark + links + CTA    |
| [hero.tsx](hero.tsx)               | Marketing hero section                        |
| [testimonial.tsx](testimonial.tsx) | Case study / quote block                      |
| [cta-section.tsx](cta-section.tsx) | Closing CTA band                              |
| [stat.tsx](stat.tsx)               | Big-number stat block                         |
| [animated.tsx](animated.tsx)       | 21st.dev-style motion primitives (spotlight, counter, reveal) |
| [utils.ts](utils.ts)               | `cn()` helper (clsx + tailwind-merge)         |

## Conventions

- Every interactive component has a visible focus ring: `focus-visible:ring-2 focus-visible:ring-brand-600/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper`.
- Every component forwards `className` so it can be extended without monkey-patching.
- No component ships with `h-10 p-4 m-2` — padding/margin are Tailwind utilities on the consumer site.
- Motion uses the `motion-*` preset durations and easings.
- Components respect `prefers-reduced-motion` via the global CSS reset.
