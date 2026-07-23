# Component Library (Step 4)

Use these verbatim. Do not improvise, do not "improve." Copy the CSS, swap the copy. Copy only the components the page needs.

## Contents
1. Pill label
2. Buttons
3. Hero / cover
4. Hero stat strip (4-up)
5. Section wrapper
6. Problem cards (3-up)
7. Before/after VS grid
8. System 3-up cards
9. Role 4-up cards
10. Do / Don't 2-column
11. Timeline (4 weeks)
12. Commitment stat strip
13. Testimonial (dark slab)
14. Pricing card
15. Final CTA
16. Footer
17. Form fields
18. Option cards
19. Form progress bar
20. Logo bar

## 1. Pill Label (`.s-label`)

Universal section/status label. Appears above section headings.

```css
.s-label {
  display: inline-block;
  background: var(--accent-pale);
  color: var(--ink);
  font-size: 10px;
  font-weight: 900;
  padding: 6px 12px;
  border: 2px solid var(--border);
  box-shadow: var(--shadow-xs);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-family: var(--mono);
}
.s-label.green  { background: var(--green-pale); }
.s-label.amber  { background: var(--amber-pale); }
.s-label.red    { background: var(--red-pale); }
.s-label.yellow { background: var(--yellow-pale); }
```
```html
<div class="s-label">Section 01 · The Problem</div>
<div class="s-label green">Section 02 · The Answer</div>
<div class="s-label amber">Case Study</div>
```

## 2. Buttons (`.btn` + modifiers)

```css
.btn {
  display: inline-block;
  padding: 16px 28px;
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: 3px solid var(--border);
  transition: all 0.15s;
  cursor: pointer;
  font-family: var(--font);
}
.btn-primary   { background: var(--ink); color: #fffef8; box-shadow: var(--shadow); }
.btn-secondary { background: var(--bg);  color: var(--ink); box-shadow: var(--shadow); }
.btn-primary:hover,
.btn-secondary:hover { transform: translate(-2px,-2px); box-shadow: 8px 8px 0 var(--border); }
```
```html
<a href="#book" class="btn btn-primary">Book a 30-Min Call →</a>
<a href="#more" class="btn btn-secondary">Learn More</a>
```

**Button hover is sacred:** buttons shift up-and-left 2px and their shadow grows from 6px to 8px. This micro-interaction is part of the brand.

## 3. Hero / Cover

```css
.cover { border-bottom: 3px solid var(--border); background: var(--bg); position: relative; overflow: hidden; }
.cover-inner { max-width: 1120px; margin: 0 auto; padding: 88px 40px 96px; position: relative; }
.cover-pre {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--mono); font-size: 11px; font-weight: 900;
  color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.14em;
  margin-bottom: 28px;
}
.cover-pre .dot { width: 8px; height: 8px; background: var(--green); border-radius: 50%; }
.cover h1 {
  font-size: 88px;
  font-weight: 900;
  line-height: 0.96;
  letter-spacing: -0.045em;
  color: var(--ink);
  margin-bottom: 28px;
  max-width: 1080px;
}
.cover h1 .dim { color: var(--text-muted); }
.cover h1 .champion-mark {
  display: inline-block;
  background: var(--ink);
  color: var(--amber-pale);
  padding: 0 18px 4px;
  border: 3px solid var(--border);
  box-shadow: var(--shadow);
  letter-spacing: -0.045em;
}
.cover-subtitle { font-size: 22px; color: var(--text); line-height: 1.5; max-width: 760px; margin-bottom: 44px; font-weight: 500; }
.cover-ctas { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
```
```html
<section class="cover">
  <div class="cover-inner">
    <div class="cover-pre"><span class="dot"></span> Kicker text · Meta</div>
    <h1>
      Big bold headline with<br>
      <span class="dim">quieter</span> contrast and a<br>
      <span class="champion-mark">boxed highlight.</span>
    </h1>
    <p class="cover-subtitle">One or two sentence summary that explains what this page offers. Plain English, no jargon.</p>
    <div class="cover-ctas">
      <a href="#cta" class="btn btn-primary">Primary CTA →</a>
      <a href="#learn" class="btn btn-secondary">Secondary</a>
    </div>
  </div>
</section>
```

**The `.champion-mark` trick** (wrapping a word in a black box with amber-pale text plus hard shadow) is the brand's signature hero flourish. Use it for ONE emphasized phrase per hero. Not more.

## 4. Hero Stat Strip (4-up)

```css
.hero-stats {
  margin-top: 64px;
  border: 3px solid var(--border);
  box-shadow: var(--shadow);
  background: #fff;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.hero-stat { padding: 32px 24px; border-right: 3px solid var(--border); }
.hero-stat:last-child { border-right: none; }
.hero-stat .num {
  font-family: var(--mono); font-size: 42px; font-weight: 900;
  letter-spacing: -0.04em; color: var(--ink); line-height: 1;
  display: block; margin-bottom: 10px;
}
.hero-stat .num.accent { color: var(--accent); }
.hero-stat .num.green  { color: var(--green); }
.hero-stat .num.amber  { color: var(--amber); }
.hero-stat .label { font-size: 11px; color: var(--text-light); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
```
```html
<div class="hero-stats">
  <div class="hero-stat"><span class="num accent">02</span><div class="label">Weeks to Handoff</div></div>
  <div class="hero-stat"><span class="num green">01</span><div class="label">Trained Champion</div></div>
  <div class="hero-stat"><span class="num amber">05+</span><div class="label">AI Systems Shipped</div></div>
  <div class="hero-stat"><span class="num">00</span><div class="label">Vendor Lock-in</div></div>
</div>
```

## 5. Section Wrapper

All non-hero content sections share this spacing.

```css
.section { padding: 112px 40px; border-bottom: 3px solid var(--border); }
.section-inner { max-width: 1120px; margin: 0 auto; text-align: center; }
.section h2 {
  font-size: 56px; font-weight: 900; line-height: 1.02;
  letter-spacing: -0.035em; color: var(--ink);
  margin: 20px auto 24px; max-width: 860px; text-align: center;
}
.section-lead {
  font-size: 19px; color: var(--text); max-width: 720px;
  line-height: 1.6; margin: 0 auto; text-align: center;
}
.section.alt { background: var(--bg-alt); }
```
```html
<section class="section alt">
  <div class="section-inner">
    <div class="s-label red">Section 01 · The Problem</div>
    <h2>A two-line<br>declarative headline.</h2>
    <p class="section-lead">One paragraph of plain-English setup. No marketing fluff.</p>
  </div>
</section>
```

## 6. Problem Cards (3-up, red top bar)

```css
.problem-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 56px; text-align: left; }
.problem-card { background: #fff; border: 3px solid var(--border); box-shadow: var(--shadow); padding: 32px; position: relative; }
.problem-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: var(--red); }
.problem-card .badge {
  display: inline-block; font-family: var(--mono); font-size: 11px; font-weight: 900;
  background: var(--red-pale); color: #7f1d1d;
  padding: 5px 11px; border: 2px solid #991b1b;
  text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 18px;
}
.problem-card h3 { font-size: 20px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 10px; line-height: 1.2; }
.problem-card p  { font-size: 14px; color: var(--text); line-height: 1.65; }
```

**Variants:** swap `--red` / `--red-pale` / `#7f1d1d` / `#991b1b` for `--accent` / `--accent-pale` / `#1e3a8a` / `#1d4ed8` (blue), or the `--green` family, or the `--amber` family, depending on what the card represents.

## 7. Before/After VS Grid

```css
.vs-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 0; margin-top: 56px; align-items: stretch; text-align: left; }
.vs-col { background: #fff; border: 3px solid var(--border); box-shadow: var(--shadow); padding: 40px 32px; }
.vs-col.before { background: var(--bg-alt); }
.vs-col.after  { background: var(--green-pale); }
.vs-divider {
  font-family: var(--mono); font-size: 20px; font-weight: 900;
  color: var(--text-muted);
  display: flex; align-items: center; justify-content: center; padding: 0 24px;
}
.vs-col .label { font-family: var(--mono); font-size: 10px; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 20px; }
.vs-col h3 { font-size: 24px; font-weight: 900; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 20px; }
.vs-col ul { list-style: none; }
.vs-col li { font-size: 14px; color: var(--text); padding: 10px 0 10px 28px; border-bottom: 2px solid rgba(0,0,0,0.08); position: relative; }
.vs-col li:last-child { border-bottom: none; }
.vs-col.before li::before { content: "✗"; position: absolute; left: 0; color: var(--red);   font-weight: 900; font-size: 16px; }
.vs-col.after  li::before { content: "✓"; position: absolute; left: 0; color: var(--green); font-weight: 900; font-size: 16px; }
```
```html
<div class="vs-grid">
  <div class="vs-col before">
    <div class="label">Before · Old way</div>
    <h3>Status quo headline.</h3>
    <ul><li>Pain point one</li><li>Pain point two</li></ul>
  </div>
  <div class="vs-divider">→</div>
  <div class="vs-col after">
    <div class="label">After · BenAI</div>
    <h3>New-world headline.</h3>
    <ul><li>Outcome one</li><li>Outcome two</li></ul>
  </div>
</div>
```

## 8. System / Product 3-Up Cards (numbered)

```css
.system-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 56px; text-align: left; }
.system-card { background: #fff; border: 3px solid var(--border); box-shadow: var(--shadow); padding: 36px 32px; }
.system-card .num {
  font-family: var(--mono); font-size: 48px; font-weight: 900;
  color: var(--accent); letter-spacing: -0.04em; line-height: 1;
  margin-bottom: 20px; display: block;
}
.system-card:nth-child(2) .num { color: var(--green); }
.system-card:nth-child(3) .num { color: var(--amber); }
.system-card h3 { font-size: 22px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 12px; line-height: 1.2; }
.system-card p  { font-size: 14px; color: var(--text); line-height: 1.65; }
.system-card .tag {
  display: inline-block; margin-top: 16px;
  font-family: var(--mono); font-size: 10px; font-weight: 700;
  background: var(--bg); color: var(--text-light);
  padding: 5px 10px; border: 2px solid var(--border-light);
  text-transform: uppercase; letter-spacing: 0.08em;
}
```
```html
<div class="system-grid">
  <div class="system-card">
    <span class="num">01</span>
    <h3>Thing one</h3>
    <p>One or two sentence description.</p>
    <span class="tag">Tag · Category</span>
  </div>
  <div class="system-card"><span class="num">02</span><h3>Thing two</h3><p>...</p></div>
  <div class="system-card"><span class="num">03</span><h3>Thing three</h3><p>...</p></div>
</div>
```

## 9. Role / Feature 4-Up Cards (with icon box)

```css
.role-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 48px; text-align: left; }
.role-card { background: #fff; border: 3px solid var(--border); box-shadow: var(--shadow); padding: 32px 28px; position: relative; }
.role-card .num { font-family: var(--mono); font-size: 11px; font-weight: 900; color: var(--text-muted); letter-spacing: 0.1em; margin-bottom: 18px; display: block; }
.role-card .icon {
  width: 44px; height: 44px;
  background: var(--accent-pale);
  border: 3px solid var(--border);
  box-shadow: var(--shadow-xs);
  display: flex; align-items: center; justify-content: center;
  color: var(--ink);
  margin-bottom: 20px;
}
.role-card:nth-child(2) .icon { background: var(--green-pale); }
.role-card:nth-child(3) .icon { background: var(--amber-pale); }
.role-card:nth-child(4) .icon { background: var(--yellow-pale); }
.role-card h3 { font-size: 18px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 10px; line-height: 1.2; }
.role-card p  { font-size: 13px; color: var(--text); line-height: 1.6; }
```

## 10. Do / Don't 2-Column

```css
.do-dont-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 40px; text-align: left; }
.do-col, .dont-col { background: #fff; border: 3px solid var(--border); box-shadow: var(--shadow); padding: 32px; }
.do-col   { border-top: 8px solid var(--green); }
.dont-col { border-top: 8px solid var(--text-muted); }
.do-col h3, .dont-col h3 { font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px; }
.do-col ul, .dont-col ul { list-style: none; }
.do-col li, .dont-col li { padding: 10px 0 10px 28px; border-bottom: 2px solid var(--border-light); font-size: 14px; color: var(--text); position: relative; }
.do-col li::before   { content: "✓"; position: absolute; left: 0; color: var(--green);      font-weight: 900; font-size: 16px; }
.dont-col li::before { content: "✗"; position: absolute; left: 0; color: var(--text-muted); font-weight: 900; font-size: 16px; }
```

## 11. Timeline (4 weeks)

```css
.timeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-top: 56px; border: 3px solid var(--border); box-shadow: var(--shadow); background: #fff; text-align: left; }
.timeline-step { padding: 36px 28px; border-right: 3px solid var(--border); position: relative; }
.timeline-step:last-child { border-right: none; }
.timeline-step::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 6px; }
.timeline-step:nth-child(1)::before { background: var(--accent); }
.timeline-step:nth-child(2)::before { background: var(--green); }
.timeline-step:nth-child(3)::before { background: var(--amber); }
.timeline-step:nth-child(4)::before { background: var(--ink); }
.timeline-step .week { font-family: var(--mono); font-size: 11px; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 12px; display: block; }
.timeline-step h4 { font-size: 20px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 10px; line-height: 1.2; }
.timeline-step p  { font-size: 13px; color: var(--text); line-height: 1.55; }
.timeline-step .result { font-family: var(--mono); font-size: 11px; font-weight: 700; color: var(--green); margin-top: 14px; display: block; }
```

## 12. Commitment Stat Strip (3-up, big numbers)

```css
.commitment-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border: 3px solid var(--border); box-shadow: var(--shadow); background: #fff; }
.commitment { padding: 44px 32px; border-right: 3px solid var(--border); text-align: center; }
.commitment:last-child { border-right: none; }
.commitment .num {
  font-family: var(--mono); font-size: 52px; font-weight: 900;
  color: var(--ink); letter-spacing: -0.04em; line-height: 1;
  display: block; margin-bottom: 12px;
}
.commitment .num span { font-size: 20px; }
.commitment .label { font-size: 12px; color: var(--text-light); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
```

## 13. Testimonial (dark slab)

```css
.testimonial { background: var(--ink); padding: 120px 40px; border-bottom: 3px solid var(--border); position: relative; }
.testimonial::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #3b82f6, #22c55e, #f59e0b); }
.testimonial-inner { max-width: 920px; margin: 0 auto; }
.testimonial-inner .s-label { background: #fffef8; color: var(--ink); margin-bottom: 20px; }
.testimonial-inner blockquote {
  font-size: 38px; font-weight: 700; color: #fffef8;
  letter-spacing: -0.025em; line-height: 1.18;
  margin-bottom: 32px; max-width: 880px;
}
.testimonial-meta { display: flex; align-items: center; gap: 20px; }
.testimonial-avatar {
  width: 64px; height: 64px;
  background: linear-gradient(135deg, var(--accent-pale), var(--amber-pale));
  border: 3px solid #fffef8;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 900; color: var(--ink);
}
.testimonial-meta cite { font-style: normal; color: rgba(255,255,255,0.75); }
.testimonial-meta cite .name { display: block; font-weight: 900; font-size: 15px; color: #fff; }
.testimonial-meta cite .role { font-size: 12px; font-family: var(--mono); letter-spacing: 0.04em; }
```

## 14. Pricing Card

```css
.pricing-card { max-width: 720px; margin: 0 auto; background: #fff; border: 3px solid var(--border); box-shadow: var(--shadow); position: relative; }
.pricing-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #3b82f6, #22c55e, #f59e0b); }
.pricing-header { padding: 44px 44px 32px; border-bottom: 3px solid var(--border); }
.pricing-tier {
  display: inline-block; font-size: 10px; font-weight: 900; color: #fff;
  background: var(--ink); padding: 4px 12px;
  text-transform: uppercase; letter-spacing: 0.1em;
  box-shadow: var(--shadow-xs); margin-bottom: 16px;
}
.pricing-header h3 { font-size: 36px; font-weight: 900; letter-spacing: -0.03em; margin-bottom: 10px; line-height: 1.05; }
.pricing-tagline { font-size: 15px; color: var(--text); line-height: 1.55; }
.pricing-rows { padding: 12px 44px; }
.pricing-row { display: flex; align-items: baseline; gap: 8px; padding: 16px 0; border-bottom: 2px solid var(--border-light); }
.pricing-row:last-child { border-bottom: none; }
.pricing-row .label  { font-size: 14px; color: var(--text); flex: 1; font-weight: 500; }
.pricing-row .amount { font-size: 16px; font-weight: 900; color: var(--ink); font-family: var(--mono); }
.pricing-row .amount.check { color: var(--green); font-size: 13px; }
.pricing-footer { padding: 32px 44px 44px; border-top: 3px solid var(--border); background: var(--bg-alt); }
```

## 15. Final CTA (dark, gradient top)

```css
.final-cta { background: var(--ink); padding: 120px 40px; text-align: center; position: relative; }
.final-cta::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #3b82f6, #22c55e, #f59e0b); }
.final-cta-inner { max-width: 820px; margin: 0 auto; }
.final-cta .s-label { background: #fffef8; color: var(--ink); margin-bottom: 20px; }
.final-cta h2 { font-size: 68px; font-weight: 900; color: #fffef8; letter-spacing: -0.04em; line-height: 1; margin-bottom: 24px; }
.final-cta p  { color: rgba(255,255,255,0.75); font-size: 19px; line-height: 1.6; margin-bottom: 40px; max-width: 620px; margin-left: auto; margin-right: auto; }
.final-cta .btn-primary { background: #fffef8; color: var(--ink); border-color: #fffef8; padding: 20px 36px; font-size: 15px; }
.final-cta .btn-primary:hover { box-shadow: 8px 8px 0 #fffef8; }
```

## 16. Footer

```css
.site-footer { background: var(--bg-alt); padding: 40px 0; }
.footer-inner { max-width: 1120px; margin: 0 auto; padding: 0 40px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
.footer-logo { display: flex; align-items: center; gap: 10px; }
.footer-logo .smiley { width: 24px; height: 24px; color: var(--ink); }
.footer-logo span { font-weight: 900; font-size: 14px; letter-spacing: -0.01em; }
.footer-meta { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; font-family: var(--mono); }
```

## 17. Form Fields (for onboarding/intake)

```css
.f { margin-bottom: 18px; }
.f label {
  display: block;
  font-size: 10px; font-weight: 900;
  color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.1em;
  margin-bottom: 6px;
}
.f input, .f textarea {
  width: 100%;
  padding: 14px 16px;
  font-family: var(--font); font-size: 16px;
  color: var(--ink);
  background: #fafafa;
  border: 2px solid #e2e8f0;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.f input:focus, .f textarea:focus {
  border-color: #334155;
  box-shadow: 3px 3px 0 #334155;
}
.f textarea { min-height: 120px; resize: vertical; line-height: 1.5; }
.f input::placeholder, .f textarea::placeholder { color: #bbb; font-size: 15px; }
.f-row { display: flex; gap: 16px; }
.f-row .f { flex: 1; }
```

## 18. Option Cards (radio-group replacement)

```css
.opts { display: flex; flex-direction: column; gap: 10px; }
.opt {
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 15px; font-weight: 500; color: var(--text);
  display: flex; align-items: center; gap: 14px;
}
.opt:hover { border-color: #334155; background: #f8fafc; }
.opt.on {
  border-color: #334155;
  background: var(--accent-pale);
  color: var(--ink);
  font-weight: 600;
  box-shadow: 3px 3px 0 #334155;
}
```

## 19. Form Progress Bar

```css
.prog { height: 5px; background: #f0f0ee; position: relative; overflow: hidden; }
.prog-fill {
  height: 100%; width: 0%;
  background: linear-gradient(90deg, rgba(59,130,246,0.35), rgba(34,197,94,0.3), rgba(245,158,11,0.25));
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}
.prog-fill::after {
  content: ''; position: absolute;
  top: 0; left: -150%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
  animation: progShimmer 2.5s ease-in-out infinite;
}
@keyframes progShimmer { 0% { left: -150%; } 100% { left: 250%; } }
```

## 20. Logo Bar (social proof row)

```css
.logo-bar { background: var(--bg-alt); padding: 48px 40px; border-bottom: 3px solid var(--border); }
.logo-bar-inner { max-width: 1120px; margin: 0 auto; text-align: center; }
.logo-bar-label { font-family: var(--mono); font-size: 11px; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 24px; }
.logos { display: flex; align-items: center; justify-content: center; gap: 48px; flex-wrap: wrap; }
.logo-placeholder { font-family: var(--mono); font-size: 14px; font-weight: 900; color: var(--text-light); padding: 12px 20px; border: 2px solid var(--border-light); letter-spacing: -0.01em; }
```
