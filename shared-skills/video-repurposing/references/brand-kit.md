---
name: brand-kit
description: One-time brand kit captured in intake and reused for all styled output
metadata:
  tags: video, brand, captions, colors, fonts
---

# Brand Kit (one-time, per user)

All styled output (captions, title cards, graphics) uses the user's brand, captured once during intake and reused forever.

Ask for these in the first session. Use the default only when the user has no preference.

| Setting | What to ask | Default if they have no preference |
|---|---|---|
| Colors | brand dark, background/light, 1-2 accents | dark `#0A0A14`, light `#F5F2EA`, accent `#B8E0B0` |
| Fonts | heading font (Google Fonts name) | Inter (via `@remotion/google-fonts`) |
| Caption style | frosted pill (default) or bold pill | frosted |
| Background rule | never pure `#000` black, use the brand dark | applies to everyone |

Store the answers in the Remotion project (a `BRAND` constant or `src/lib/brand.ts`) so every composition reads from one place. All code in the references uses example values, swap in the user's kit.
