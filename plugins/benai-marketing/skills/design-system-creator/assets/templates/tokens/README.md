# Token templates

Three files, all parameterized with `{{PLACEHOLDER}}` tokens.

## How to use

1. Pick the brand's primary hex from the user's decision (Branch A: sign-off Q1; Branch B: from reconciliation).
2. Derive the 50–900 shades using HSL math:
   - `600` = primary
   - `700` = primary with lightness −12%
   - `800` = primary with lightness −25%
   - `900` = primary with lightness −45%
   - `500` = primary with lightness +15%
   - `400` = primary with lightness +30%
   - `300` = primary with lightness +50%
   - `200` = primary with lightness +70%
   - `100` = primary with lightness +85%
   - `50`  = primary with lightness +95%
3. Pick the ink scale. Default set (works for most cool-blue/neutral brands):
   - `100: #EEF0F4`, `200: #E0E3EA`, `300: #C8CDD7`, `400: #97A0B0`, `500: #6B7486`, `600: #4A5568`, `700: #28344A`, `900: <INK_HEX>`
   - The 900 should have a slight undertone pulling toward the primary's hue (cool brand → cool near-black, warm brand → warm near-black).
4. Pick paper/surface/line:
   - If warm canvas: `paper: #FBFAF7`, `surface: #FFFFFF`, `line: #E6E3DC`, `line-soft: #EEECE5`.
   - If pure-white canvas: `paper: #FFFFFF`, `surface: #FFFFFF`, `line: #E6E6E6`, `line-soft: #F0F0F0`.
5. Compute `INK_RGB` as the RGB tuple for `INK_HEX` (e.g., `#0F1A2E` → `15, 26, 46`).
6. Do a global find-and-replace on all three template files using a consistent script — JSON, CSS, and the Tailwind preset must stay in sync.

## The substitution table

| Placeholder          | Type                      | Example                          |
| -------------------- | ------------------------- | -------------------------------- |
| `{{BRAND_NAME}}`     | Brand display name        | `Lantern`                        |
| `{{BRAND_SLUG}}`     | Kebab-case slug           | `lantern`                        |
| `{{BRAND_SHORT_DESCRIPTION}}` | One sentence     | `AI services for US local businesses.` |
| `{{PRIMARY_HEX}}`    | Primary color             | `#2859D9`                        |
| `{{BRAND_50}}`…`{{BRAND_900}}` | Derived shades  | `#F2F5FE` / `#EAF0FD` / … / `#0E2358` |
| `{{INK_100}}`…`{{INK_700}}` | Derived ink steps  | `#EEF0F4` / … / `#28344A`        |
| `{{INK_HEX}}`        | Primary text color        | `#0F1A2E`                        |
| `{{INK_RGB}}`        | Same color as R, G, B     | `15, 26, 46`                     |
| `{{PAPER_HEX}}`      | Page background           | `#FBFAF7`                        |
| `{{SURFACE_HEX}}`    | Card / raised bg          | `#FFFFFF`                        |
| `{{LINE_HEX}}`       | Dividers on paper         | `#E6E3DC`                        |
| `{{LINE_SOFT_HEX}}`  | Subtle separators         | `#EEECE5`                        |
| `{{FONT_FAMILY}}`    | Typeface                  | `Inter`                          |

## Writing the outputs

After substitution, the three files go to:

- `design-system/tokens/tokens.json`
- `design-system/tokens/tokens.css`
- `design-system/tokens/tailwind.preset.js`

Verify the three are consistent — running the same color through all three should produce the same hex in each.
