# Logo motif library

A small set of pre-designed mark motifs. Pick one based on the brand's positioning, then use it inside the mark templates (`mark-template.svg`, `lockup-horizontal-template.svg`, `lockup-stacked-template.svg`) by substituting the `{{MOTIF_PATHS}}` placeholder.

Each motif is expressed as one or more SVG `<path>` / `<rect>` elements, already sized to fit inside a 64×64 grid with ~8px padding. The fill/stroke uses the placeholders `{{PRIMARY}}`, `{{PAPER}}`, `{{INK}}`.

When picking, align motif semantics to positioning:
- **Sage / guide / trust brands**: lantern, compass, beacon, keystone
- **Craft / technical brands**: node, prism, grid
- **Human-first / warm brands**: hearth, spark
- **Direct / bold brands**: wedge, aperture

Always pair with a wordmark unless the brand is extremely well-known. Mark-only is earned, not claimed.

---

## 1. Lantern — flame inside a rounded frame

**Best for:** trust / guide / calm-authority brands. The brand that "shows you the way" or "cuts through noise."

```xml
<path d="M 24 10 Q 32 3 40 10" stroke="{{PRIMARY}}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="12" y="12" width="40" height="44" rx="6" fill="{{PRIMARY}}"/>
<path d="M 32 24 C 28 28, 24 33, 24 38 C 24 44, 27 48, 32 48 C 37 48, 40 44, 40 38 C 40 33, 36 28, 32 24 Z" fill="{{PAPER}}"/>
```

Inverse (dark backgrounds):

```xml
<path d="M 24 10 Q 32 3 40 10" stroke="{{PAPER}}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="12" y="12" width="40" height="44" rx="6" fill="{{PAPER}}"/>
<path d="M 32 24 C 28 28, 24 33, 24 38 C 24 44, 27 48, 32 48 C 37 48, 40 44, 40 38 C 40 33, 36 28, 32 24 Z" fill="{{INK}}"/>
```

---

## 2. Compass — needle pointing up-right inside a circle

**Best for:** wayfinding / navigation / guidance brands.

```xml
<circle cx="32" cy="32" r="22" fill="none" stroke="{{PRIMARY}}" stroke-width="3"/>
<path d="M 32 18 L 38 36 L 32 32 L 26 36 Z" fill="{{PRIMARY}}"/>
<circle cx="32" cy="32" r="2.5" fill="{{PRIMARY}}"/>
```

---

## 3. Keystone — five-sided arch stone

**Best for:** infrastructural / foundational brands ("we hold your business together").

```xml
<path d="M 20 20 L 44 20 L 48 32 L 40 52 L 24 52 L 16 32 Z" fill="{{PRIMARY}}"/>
<path d="M 26 32 L 38 32" stroke="{{PAPER}}" stroke-width="3" stroke-linecap="round"/>
```

---

## 4. Hearth — arch opening with flame inside

**Best for:** warm / community / gathering brands.

```xml
<path d="M 14 52 L 14 30 Q 14 14, 32 14 Q 50 14, 50 30 L 50 52 Z" fill="{{PRIMARY}}"/>
<path d="M 32 30 C 28 33, 26 37, 26 41 C 26 45, 29 47, 32 47 C 35 47, 38 45, 38 41 C 38 37, 35 34, 32 30 Z" fill="{{PAPER}}"/>
```

---

## 5. Spark — single angular 4-point star

**Best for:** creative / AI / innovation brands that want a simple marker, not a glyph.

```xml
<path d="M 32 8 L 38 26 L 56 32 L 38 38 L 32 56 L 26 38 L 8 32 L 26 26 Z" fill="{{PRIMARY}}"/>
```

---

## 6. Node — three connected dots

**Best for:** network / platform / connectivity brands. Simple and clean.

```xml
<circle cx="16" cy="20" r="6" fill="{{PRIMARY}}"/>
<circle cx="48" cy="20" r="6" fill="{{PRIMARY}}"/>
<circle cx="32" cy="48" r="6" fill="{{PRIMARY}}"/>
<path d="M 16 20 L 32 48 L 48 20" stroke="{{PRIMARY}}" stroke-width="3" fill="none" stroke-linecap="round"/>
```

---

## 7. Prism — simple triangle refracting

**Best for:** clarity / data / transformation brands (without the "transform" word).

```xml
<path d="M 12 48 L 32 12 L 52 48 Z" fill="{{PRIMARY}}"/>
<path d="M 32 12 L 32 48" stroke="{{PAPER}}" stroke-width="2"/>
<path d="M 22 38 L 42 38" stroke="{{PAPER}}" stroke-width="2"/>
```

---

## 8. Aperture — five-segment circle opening

**Best for:** vision / focus / camera-like brands.

```xml
<circle cx="32" cy="32" r="22" fill="{{PRIMARY}}"/>
<path d="M 32 14 L 42 22 L 32 32 Z" fill="{{PAPER}}"/>
<path d="M 42 22 L 50 32 L 32 32 Z" fill="{{PAPER}}" opacity="0.82"/>
<path d="M 50 32 L 42 42 L 32 32 Z" fill="{{PAPER}}" opacity="0.64"/>
<path d="M 42 42 L 32 50 L 32 32 Z" fill="{{PAPER}}" opacity="0.46"/>
<path d="M 32 50 L 22 42 L 32 32 Z" fill="{{PAPER}}" opacity="0.28"/>
<circle cx="32" cy="32" r="4" fill="{{PAPER}}"/>
```

---

## 9. Wedge — bold diagonal slash with dot

**Best for:** direct / punchy / "we move fast" brands.

```xml
<rect x="12" y="12" width="40" height="40" rx="6" fill="{{PRIMARY}}"/>
<path d="M 18 46 L 46 18" stroke="{{PAPER}}" stroke-width="5" stroke-linecap="round"/>
<circle cx="46" cy="18" r="3" fill="{{PAPER}}"/>
```

---

## 10. Grid — 2×2 squares with one offset

**Best for:** system / design-first / structured brands.

```xml
<rect x="14" y="14" width="14" height="14" rx="2" fill="{{PRIMARY}}"/>
<rect x="36" y="14" width="14" height="14" rx="2" fill="{{PRIMARY}}" opacity="0.6"/>
<rect x="14" y="36" width="14" height="14" rx="2" fill="{{PRIMARY}}" opacity="0.6"/>
<rect x="36" y="36" width="14" height="14" rx="2" fill="{{PRIMARY}}"/>
```

---

## How to offer these to the user

In Branch A's sign-off step, suggest **2–3 motifs** that fit the brand positioning (not all 10 — too much choice). Show the inline SVG rendered and ask which direction feels right. If none, offer to design one custom from their specific positioning concept (requires describing a shape in words, then iterating).

In Branch B, use the motif from the user's existing logo — don't substitute a generic one. If the logo they sent doesn't fit the 64×64 grid cleanly, embed the original logo paths into the template and adjust the viewBox.
