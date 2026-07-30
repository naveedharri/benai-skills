# Page Shell (Step 3)

## Contents
1. Required page wrapper
2. BenAI smiley logo (SVG)
3. Responsive breakpoints

## 1. Required page wrapper

Every page starts from this wrapper. Replace `[TITLE]`, `[PAGE KICKER]`, and `[CONTENT]`. Paste the full `:root` block from `design-tokens.md` where marked.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[TITLE] | BenAI</title>
<!-- BenAI instant-ui v1 -->
<style>
  :root {
    /* PASTE THE FULL :root BLOCK FROM design-tokens.md */
  }
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
  body { font-family: var(--font); color: var(--ink); background: var(--bg); line-height: 1.6; }
  a { color: inherit; text-decoration: none; }
  strong { font-weight: 700; color: var(--ink); }

  /* Signature top stripe - every BenAI page gets this */
  .top-stripe {
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #22c55e, #f59e0b);
    position: sticky;
    top: 0;
    z-index: 1001;
  }

  /* Header */
  .site-header {
    position: sticky; top: 4px; height: 64px;
    background: var(--ink); z-index: 1000;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; border-bottom: 3px solid var(--border);
  }
  .header-brand { display: flex; align-items: center; gap: 16px; }
  .header-brand .smiley { width: 30px; height: 30px; color: #fffef8; }
  .header-brand .brand-name { color: #fffef8; font-size: 17px; font-weight: 900; letter-spacing: -0.01em; }
  .header-divider { width: 2px; height: 24px; background: rgba(255,255,255,0.2); }
  .header-title { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.6); letter-spacing: 0.1em; text-transform: uppercase; }
  .header-nav { display: flex; gap: 24px; list-style: none; align-items: center; }
  .header-nav a { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.08em; padding: 22px 0; transition: color 0.15s; }
  .header-nav a:hover { color: #fff; }
  .header-cta { background: #fffef8; color: var(--ink); font-size: 11px; font-weight: 900; padding: 8px 16px; border: 2px solid #fffef8; text-transform: uppercase; letter-spacing: 0.08em; transition: all 0.15s; }
  .header-cta:hover { background: transparent; color: #fffef8; }

  /* PASTE COMPONENT CSS FROM components.md */
</style>
</head>
<body>

  <div class="top-stripe"></div>

  <header class="site-header">
    <div class="header-brand">
      <svg class="smiley" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="3" fill="none"/>
        <circle cx="17" cy="18" r="2.5" fill="currentColor"/>
        <circle cx="31" cy="18" r="2.5" fill="currentColor"/>
        <path d="M14 30 C14 30 18 36 24 36 C30 36 34 30 34 30" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>
      </svg>
      <span class="brand-name">BenAI</span>
      <div class="header-divider"></div>
      <span class="header-title">[PAGE KICKER]</span>
    </div>
    <div class="header-meta">
      <ul class="header-nav">
        <li><a href="#section-1">Section</a></li>
      </ul>
      <a href="#cta" class="header-cta">Book a Call</a>
    </div>
  </header>

  [CONTENT]

</body>
</html>
```

## 2. BenAI smiley logo (SVG)

The real BenAI mark is a **circle plus a single U-shaped smile. No eyes, no wide grin.** Reproduced from `benaios-site/public/logo-smiley.png`. Always use this exact markup. It uses `currentColor`, so it inherits `color` from its parent. Never add eye dots or change the smile to a full-width grin.

```html
<svg class="smiley" viewBox="0 0 48 48" fill="none">
  <circle cx="24" cy="24" r="21" stroke="currentColor" stroke-width="3.5" fill="none"/>
  <path d="M16 23 C16 29.5 19.5 33 24 33 C28.5 33 32 29.5 32 23" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" fill="none"/>
</svg>
```

- Dark header: wrap in `.header-brand` (color `#fffef8`).
- Cream footer: wrap in `.footer-logo` (color `var(--ink)`).
- Common sizes: 30px (header), 26px (form header), 24px (footer), 48px+ (hero marks).

## 3. Responsive breakpoints

Required on every page.

```css
@media (max-width: 980px) {
  .cover-inner { padding: 48px 28px 72px; }
  .cover h1 { font-size: 52px; line-height: 0.96; }
  .section { padding: 72px 28px; }
  .section h2 { font-size: 36px; }
  .hero-stats    { grid-template-columns: 1fr 1fr; }
  .problem-grid  { grid-template-columns: 1fr; }
  .vs-grid       { grid-template-columns: 1fr; }
  .vs-divider    { padding: 20px 0; }
  .system-grid   { grid-template-columns: 1fr; }
  .role-grid     { grid-template-columns: 1fr 1fr; }
  .do-dont-grid  { grid-template-columns: 1fr; }
  .timeline      { grid-template-columns: 1fr 1fr; }
  .commitment-grid { grid-template-columns: 1fr; }
  .header-nav    { display: none; }
  .final-cta h2  { font-size: 44px; }
  .testimonial-inner blockquote { font-size: 26px; }
}
@media (max-width: 720px) {
  .site-header { padding: 0 16px; height: 60px; }
  .header-brand .brand-name { font-size: 15px; }
  .header-divider, .header-title { display: none; }
}
@media (max-width: 600px) {
  .role-grid { grid-template-columns: 1fr; }
}
```

When a grid collapses, a `border-right` between columns becomes `border-bottom`, and the last one drops the border. Example for `.hero-stats`:

```css
@media (max-width: 980px) {
  .hero-stat { border-right: none; border-bottom: 3px solid var(--border); }
  .hero-stat:nth-child(3), .hero-stat:nth-child(4) { border-bottom: none; }
}
```
