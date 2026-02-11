# Web Design Guidelines

Quality checklist for landing page UI. Use to review code before deployment.

**Source:** Based on [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)

---

## How to Use

After building the landing page, review against these rules:
1. Check each category below
2. Fix any violations found
3. Use the output format for reporting issues

---

## Focus States

- [ ] Interactive elements have visible focus: `focus-visible:ring-*` or equivalent
- [ ] Never `outline-none` without focus replacement
- [ ] Use `:focus-visible` over `:focus` (avoid focus ring on click)
- [ ] Group focus with `:focus-within` for compound controls

---

## Forms

- [ ] Inputs have `autocomplete` and meaningful `name`
- [ ] Use correct `type` (`email`, `tel`, `url`, `number`) and `inputmode`
- [ ] Never block paste (`onPaste` + `preventDefault`)
- [ ] Labels clickable (`htmlFor` or wrapping control)
- [ ] Disable spellcheck on emails, codes, usernames (`spellCheck={false}`)
- [ ] Checkboxes/radios: label + control share single hit target
- [ ] Submit button stays enabled until request starts; spinner during request
- [ ] Errors inline next to fields; focus first error on submit
- [ ] Placeholders end with `…` and show example pattern

---

## Animation

- [ ] Honor `prefers-reduced-motion` (provide reduced variant or disable)
- [ ] Animate `transform`/`opacity` only (compositor-friendly)
- [ ] Never `transition: all`—list properties explicitly
- [ ] Set correct `transform-origin`
- [ ] Animations interruptible—respond to user input mid-animation

```typescript
// Good
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ 
    duration: 0.5,
    // Respect reduced motion
    ...(prefersReducedMotion && { duration: 0 })
  }}
/>

// Bad
style={{ transition: 'all 0.3s' }} // Never "all"
```

---

## Typography

- [ ] Use `…` not `...` (ellipsis character)
- [ ] Use curly quotes `"` `"` not straight `"`
- [ ] Non-breaking spaces: `10 MB`, `⌘ K`, brand names
- [ ] Loading states end with `…`: `"Loading…"`, `"Saving…"`
- [ ] Number columns use `font-variant-numeric: tabular-nums`
- [ ] Headings use `text-wrap: balance` or `text-pretty` (prevents widows)

---

## Content Handling

- [ ] Text containers handle long content: `truncate`, `line-clamp-*`, or `break-words`
- [ ] Flex children have `min-w-0` to allow text truncation
- [ ] Empty states handled—don't render broken UI for empty strings/arrays
- [ ] User-generated content: anticipate short, average, and very long inputs

---

## Images

- [ ] `<img>` has explicit `width` and `height` (prevents CLS)
- [ ] Below-fold images: `loading="lazy"`
- [ ] Above-fold critical images: `priority` or `fetchpriority="high"`

```tsx
// Next.js Image
<Image 
  src="/hero.jpg" 
  width={1200} 
  height={600}
  priority // Above fold
  alt="Hero image"
/>

// Lazy loaded
<Image 
  src="/feature.jpg" 
  width={400} 
  height={300}
  loading="lazy" // Below fold
  alt="Feature"
/>
```

---

## Performance

- [ ] Large lists (>50 items): virtualize
- [ ] No layout reads in render (`getBoundingClientRect`, `offsetHeight`)
- [ ] Batch DOM reads/writes
- [ ] Prefer uncontrolled inputs; controlled inputs must be cheap per keystroke
- [ ] Add `<link rel="preconnect">` for CDN/asset domains
- [ ] Critical fonts: `<link rel="preload">` with `font-display: swap`

---

## Navigation & State

- [ ] URL reflects state—filters, tabs, pagination in query params
- [ ] Links use `<Link>` component (Cmd/Ctrl+click support)
- [ ] Deep-link all stateful UI
- [ ] Destructive actions need confirmation modal or undo window

---

## Touch & Interaction

- [ ] `touch-action: manipulation` (prevents double-tap zoom delay)
- [ ] `-webkit-tap-highlight-color` set intentionally
- [ ] `overscroll-behavior: contain` in modals/drawers/sheets
- [ ] `autoFocus` sparingly—desktop only, single primary input

---

## Safe Areas & Layout

- [ ] Full-bleed layouts use `env(safe-area-inset-*)` for notches
- [ ] No unwanted scrollbars: `overflow-x-hidden` on containers
- [ ] Flex/grid over JS measurement for layout

---

## Dark Mode & Theming

- [ ] `color-scheme: dark` on `<html>` for dark themes
- [ ] `<meta name="theme-color">` matches page background
- [ ] Native `<select>`: explicit `background-color` and `color`

---

## Accessibility

- [ ] Icon buttons have `aria-label`
- [ ] Form inputs have associated labels
- [ ] Interactive elements are `<button>` not `<div onClick>`
- [ ] Links are `<a>` not `<span onClick>`
- [ ] Images have meaningful `alt` text

---

## Content & Copy

- [ ] Active voice: "Install the CLI" not "The CLI will be installed"
- [ ] Title Case for headings/buttons (Chicago style)
- [ ] Numerals for counts: "8 deployments" not "eight"
- [ ] Specific button labels: "Save API Key" not "Continue"
- [ ] Error messages include fix/next step, not just problem
- [ ] Second person; avoid first person

---

## Anti-patterns (Flag These)

```
❌ user-scalable=no or maximum-scale=1 (disabling zoom)
❌ onPaste with preventDefault
❌ transition: all
❌ outline-none without focus-visible replacement
❌ Inline onClick navigation without <Link>
❌ <div> or <span> with click handlers (should be <button>)
❌ Images without dimensions
❌ Form inputs without labels
❌ Icon buttons without aria-label
❌ Hardcoded date/number formats (use Intl.*)
❌ autoFocus without clear justification
```

---

## Output Format (for Code Review)

When reviewing, use this terse format (VS Code clickable):

```text
## src/Hero.tsx

src/Hero.tsx:42 - icon button missing aria-label
src/Hero.tsx:18 - input lacks label
src/Hero.tsx:55 - animation missing prefers-reduced-motion

## src/CTA.tsx

src/CTA.tsx:12 - "..." → "…"
src/CTA.tsx:34 - transition: all → list properties

## src/Problem.tsx

✓ pass
```

State issue + location. Skip explanation unless fix non-obvious.
