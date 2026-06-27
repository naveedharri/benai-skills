# Design Quality Rules

Hard constraints for code generation. These prevent the most common "looks cheap" mistakes.

> **IMPORTANT:** During Phase 2 (Clone), the inspiration site's actual extracted values ALWAYS take priority over these defaults. These rules are fallbacks for when extraction is ambiguous or when adding NEW sections in Phase 4 that don't exist on the inspiration site.

---

## Typography Scale

| Element | Classes | Never |
|---------|---------|-------|
| Hero H1 | `text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight` | Never smaller than `text-4xl` |
| Section H2 | `text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight` | Never smaller than `text-3xl` |
| Section subtitle | `text-lg md:text-xl text-muted-foreground max-w-2xl` | Never wider than `max-w-2xl` |
| Body text | `text-base md:text-lg leading-relaxed text-muted-foreground` | Never `text-gray-500` on dark bgs |
| Card titles | `text-xl font-semibold` | Never same size as body |
| Small/meta text | `text-sm text-muted-foreground` | Never for primary content |

## Spacing Rules

| Context | Classes | Never |
|---------|---------|-------|
| Between sections | `py-20 md:py-28 lg:py-32` | Never less than `py-16` |
| Section inner | `space-y-12 md:space-y-16` | Never less than `space-y-8` |
| Card grid gaps | `gap-6 md:gap-8` | Never less than `gap-4` |
| Container padding | `px-4 sm:px-6 lg:px-8` | Never skip mobile padding |
| Max text width | `max-w-3xl mx-auto` | Never full-width paragraphs |
| Max grid width | `max-w-7xl mx-auto` | Never wider than `max-w-7xl` |

## Component Rules

| Component | Required | Never |
|-----------|----------|-------|
| Primary CTA | `h-12 px-8 text-base font-medium rounded-lg` | Never smaller than `h-10` |
| Card | `rounded-xl border bg-card p-6 md:p-8` | Never `rounded-sm` or no border |
| Card hover | `hover:shadow-lg hover:border-primary/20 transition-all duration-300` | Never skip hover state |
| Badge | `text-xs font-medium px-3 py-1 rounded-full` | Never full-size text |
| Input | `h-12 rounded-lg border px-4 text-base` | Never shorter than `h-10` |

## Layout Rules

| Context | Rule |
|---------|------|
| Feature grids | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` |
| Hero | `min-h-[90vh]` or `min-h-screen` — never short heroes |
| Section headings | Center-aligned, capped at `max-w-3xl mx-auto` |
| CTA sections | High contrast bg (dark or accent). Never same as adjacent section. |
| Navbar | `fixed top-0 z-50 backdrop-blur-md bg-background/80 border-b` |
| Footer | Always `border-t`. Include legal links. |

## Color & Contrast

| Rule | Details |
|------|---------|
| Text on dark bg | `text-white` or `text-neutral-100`. Never `text-gray-500`. |
| CTA contrast | Min 4.5:1 ratio against section background |
| Section alternation | Alternate `bg-background` and `bg-muted/50` for rhythm |
| Gradient usage | Only hero or CTA sections. Max 2 gradient sections per page. |

## Animation Rules

| Rule | Details |
|------|---------|
| Scroll reveal | `opacity: 0→1` + `translateY: 20px→0`. Duration `0.5-0.7s`. |
| Stagger | Grid items stagger `0.1s` delay. Max 5 items. |
| Hover | Cards: `translateY(-4px)`. Buttons: `scale(1.02)`. |
| No layout shift | Only animate `transform` and `opacity`. Never `width`, `height`, `margin`. |
| Reduced motion | Always respect `prefers-reduced-motion`. Framer Motion handles this. |
| Duration limits | Entrance: `0.4-0.7s`. Hover: `0.2-0.3s`. Never exceed `1s`. |

## Mobile-First Rules

| Rule | Details |
|------|---------|
| Touch targets | All buttons/links min `44px` height. |
| Font sizes | Hero H1 min `text-3xl` on mobile. Body min `text-base`. |
| No horizontal scroll | Never allow `overflow-x`. |
| Mobile nav | Hamburger at `md:` breakpoint. |
| Mobile padding | Min `px-4` on containers. |
| Stack on mobile | All grids → `grid-cols-1`. |

## Accessibility

| Rule | Details |
|------|---------|
| Contrast ratio | > 4.5:1 for all text |
| Focus states | `focus-visible:ring-*` on all interactive elements |
| Semantic HTML | `<main>`, `<section>`, `<nav>`, `<button>` (not `<div onClick>`) |
| Images | Explicit `width`/`height`, `alt` text. Hero: `priority`. Below fold: `loading="lazy"`. |
| Icon buttons | Must have `aria-label` |
