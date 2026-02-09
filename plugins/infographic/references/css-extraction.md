# CSS Extraction Guide

How to extract brand colors, fonts, and visual identity from websites using WebFetch.

---

## When to Use Website Extraction

Use this approach when:
- User says "extract from my website"
- User provides a URL as their brand reference
- User says "match my site's colors"
- User wants consistency with existing web presence

---

## Extraction Process

### Step 1: Fetch the Website

Use `WebFetch` with a targeted prompt:

```
url: [user's website URL]
prompt: "Extract the visual brand elements from this page. I need:
1. Primary brand color (the dominant color used for headers, buttons, or links)
2. Secondary/accent color (used for highlights or CTAs)
3. Background color(s)
4. Text color
5. Any notable font families mentioned in CSS or visible in styling
6. Overall visual feel (professional, playful, minimal, bold)

Return the hex codes where visible, or describe the colors if hex codes aren't available."
```

### Step 2: Parse the Response

WebFetch will return extracted information. Look for:

**Color patterns to identify:**
- `#XXXXXX` hex codes
- `rgb(X, X, X)` values (convert to hex)
- `hsl(X, X%, X%)` values (convert to hex)
- Color names like "navy", "coral", "forest green"

**Font patterns to identify:**
- Font-family declarations
- Google Fonts references
- System font stacks
- Font weight/style preferences

### Step 3: Interpret and Confirm

Present the extracted values to the user:

```
I found these brand elements on [domain]:

Colors:
- Primary: [color name] [hex]
- Accent: [color name] [hex]
- Background: [color name] [hex]
- Text: [color name] [hex]

Typography:
- Font style: [sans-serif/serif/etc.]
- Weight: [regular/bold/light]

Overall feel: [professional/playful/minimal/bold]

Use these for your infographic?
```

---

## Color Conversion Reference

### RGB to Hex

```
rgb(37, 99, 235) → #2563EB
```

Formula: Convert each value (0-255) to 2-digit hex.

### Common Color Mappings

When WebFetch returns color names instead of hex:

| Color Name | Hex Equivalent |
|------------|---------------|
| Navy | `#1E3A8A` |
| Royal blue | `#2563EB` |
| Coral | `#F97316` |
| Teal | `#14B8A6` |
| Forest green | `#166534` |
| Purple | `#7C3AED` |
| Black | `#111827` |
| White | `#FFFFFF` |
| Off-white | `#FAFAFA` |
| Cream | `#FFFBEB` |

---

## Fallback Patterns

### If WebFetch Fails

1. **Site blocks bots:**
   ```
   I couldn't access your website directly. Let me try an alternative:
   - Can you paste the CSS/hex codes from your brand guidelines?
   - Or choose from one of our preset palettes?
   ```

2. **Site has no clear brand colors:**
   ```
   Your website seems to use mostly neutral colors. Should I:
   - Use a professional default palette?
   - Let you specify colors manually?
   ```

3. **Colors extracted but look wrong:**
   ```
   The colors I found might be from ads or third-party elements.
   Do these look like your brand colors, or should we try a different approach?
   ```

### If Extraction is Partial

When only some elements are found:

```
I found your primary color (#XXXX) but couldn't identify an accent color.
What color would you like for highlights and emphasis?
```

---

## Domain-Specific Tips

### Single-Page Apps (React, Vue, Angular)

- Colors often in CSS-in-JS or utility classes
- Look for Tailwind class patterns (e.g., `bg-blue-600`)
- May need to fetch the main CSS bundle

### WordPress Sites

- Check for theme colors in `wp-content/themes/*/style.css`
- Often have customizer variables

### Squarespace/Wix

- Colors usually inline or in style blocks
- Look for brand color variables

---

## Mapping Extracted Colors to Infographic Roles

Once colors are extracted, map them:

| Extracted Element | Infographic Role |
|-------------------|-----------------|
| Button/CTA color | Accent color |
| Header/link color | Primary color |
| Page background | Background color |
| Body text color | Text color |
| Hover/focus states | Alternative accent |

---

## Example Extraction Session

**User says:** "Use colors from benai.com"

**WebFetch call:**
```
url: https://benai.com
prompt: "Extract primary color, secondary color, background color, and font style from this page. Return hex codes."
```

**WebFetch returns:**
```
Primary color: Deep blue #1E40AF used for headers and buttons
Secondary color: Bright orange #F59E0B used for CTAs and highlights
Background: White #FFFFFF
Text: Dark gray #1F2937
Font: Inter (sans-serif)
Feel: Professional, modern, tech-focused
```

**Present to user:**
```
I found these brand elements on benai.com:
- Primary: Deep blue #1E40AF
- Accent: Bright orange #F59E0B
- Background: White #FFFFFF
- Text: Dark gray #1F2937
- Font: Clean sans-serif (Inter family)
- Feel: Professional and modern

Use these?
```

---

## Saving Extracted Brand

After confirmation, save to `.infographic-brand.json`:

```json
{
  "primaryColor": "#1E40AF",
  "accentColor": "#F59E0B",
  "background": "light",
  "backgroundColor": "#FFFFFF",
  "fontStyle": "clean sans-serif",
  "tone": "professional",
  "extractedFrom": "benai.com",
  "savedAt": "2026-02-06T10:30:00Z"
}
```

The `extractedFrom` field helps track where the brand came from for future reference.
