# CSS Extraction Guide

Use this when the user wants to extract their brand style from a website.

---

## Approach 1: Browser Available (Preferred)

If you have browser/web access (e.g., through an MCP tool or browser automation):

1. Navigate to the user's URL
2. Inject this JavaScript to extract styles:

```javascript
(() => {
  const getComputedColor = (el, prop) => {
    const val = getComputedStyle(el).getPropertyValue(prop);
    return val && val !== 'rgba(0, 0, 0, 0)' ? val : null;
  };

  const rgbToHex = (rgb) => {
    if (!rgb || rgb === 'transparent') return null;
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return null;
    return match.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
  };

  // Helper: find logo
  const findLogo = () => {
    // 1. Look for explicit logo class/id
    const logoSelectors = [
        'header img[src*="logo"]', 'nav img[src*="logo"]', '.logo img', '#logo img',
        'a[class*="brand"] img', 'header svg', 'a[href="/"] img'
    ];
    for (const sel of logoSelectors) {
        const el = document.querySelector(sel);
        if (el) return el.src || el.outerHTML; // Return src for img, markup for svg
    }
    // 2. Fallback: Check for favicon
    const favicon = document.querySelector('link[rel*="icon"]');
    if (favicon) return favicon.href;
    
    return null;
  };

  // Extract colors from key elements
  const body = document.body;
  const h1 = document.querySelector('h1');
  const h2 = document.querySelector('h2');
  const button = document.querySelector('button, .btn, [class*="button"], a[class*="btn"]');
  const link = document.querySelector('a:not([class*="btn"])');
  const nav = document.querySelector('nav, header');

  // Extract CSS custom properties (variables)
  const rootStyles = getComputedStyle(document.documentElement);
  const cssVars = {};
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.selectorText === ':root' || rule.selectorText === ':root, :host') {
          const text = rule.cssText;
          const varMatches = text.matchAll(/--([\w-]+)\s*:\s*([^;]+)/g);
          for (const m of varMatches) {
            cssVars[m[1]] = m[2].trim();
          }
        }
      }
    } catch(e) {} // Cross-origin sheets will throw
  }

  // Build result
  const result = {
    brand: {
        logo: findLogo(),
        name: document.title.split(/[-|]/)[0].trim() || 'Company Name'
    },
    colors: {
      bodyBackground: rgbToHex(getComputedColor(body, 'background-color')),
      bodyText: rgbToHex(getComputedColor(body, 'color')),
      headingColor: h1 ? rgbToHex(getComputedColor(h1, 'color')) : null,
      buttonBackground: button ? rgbToHex(getComputedColor(button, 'background-color')) : null,
      buttonText: button ? rgbToHex(getComputedColor(button, 'color')) : null,
      linkColor: link ? rgbToHex(getComputedColor(link, 'color')) : null,
      navBackground: nav ? rgbToHex(getComputedColor(nav, 'background-color')) : null,
    },
    fonts: {
      body: getComputedStyle(body).fontFamily.split(',')[0].replace(/['"]/g, '').trim(),
      heading: h1 ? getComputedStyle(h1).fontFamily.split(',')[0].replace(/['"]/g, '').trim() : null,
    },
    sizes: {
      h1: h1 ? getComputedStyle(h1).fontSize : null,
      h2: h2 ? getComputedStyle(h2).fontSize : null,
      body: getComputedStyle(body).fontSize,
    },
    borderRadius: button ? getComputedStyle(button).borderRadius : null,
    cssVariables: cssVars,
  };

  return JSON.stringify(result, null, 2);
})();
```

3. Parse the result and map to the brand config structure.

---

## Approach 2: Web Fetch (Fallback)

If no browser is available, use `web_fetch` to get the page HTML/CSS:

1. Fetch the URL
2. Look for:
   - `<link rel="stylesheet">` URLs → fetch those too
   - Inline `<style>` blocks
   - CSS custom properties (`--primary-color`, `--brand-*`, etc.)
   - Common class patterns: `.btn`, `.button`, `.header`, `.nav`
3. Parse colors, fonts, and spacing from the CSS.

---

## Approach 3: Manual Collection

If extraction doesn't work, ask the user directly:

Use `AskUserQuestion`:

**"What's your primary brand color?"**
- Blue family
- Green family
- Red/Orange family
- Purple family
- Neutral (black/gray)
- I'll give you the exact hex code

**"What vibe are your fonts?"**
- Modern & clean (sans-serif)
- Classic & professional (serif)
- Technical & code-like (monospace)
- Bold & punchy (display)

**"What's your background style?"**
- Light/white backgrounds
- Dark/navy backgrounds
- Cream/warm backgrounds
- Mixed

---

## Mapping Extracted Values to Config

Once you have colors, map them:

```json
{
  "brand": {
    "colors": {
      "primary": "[buttonBackground or linkColor — the action color]",
      "secondary": "[bodyBackground — the main background]",
      "accent": "[any standout color that's not primary]",
      "text": "[bodyText — the default text color]",
      "headingText": "[headingColor — if different from body text]"
    },
    "fonts": {
      "heading": "[heading font → map to closest PowerPoint-safe font]",
      "body": "[body font → map to closest PowerPoint-safe font]"
    },
    "borderRadius": "[borderRadius value]"
  }
}
```

### PowerPoint-Safe Font Mapping

Web fonts don't work in PPTX. Map to closest available:

| Web Font | PPTX Equivalent |
|----------|----------------|
| Inter, Helvetica, SF Pro | Arial or Calibri |
| Roboto, Open Sans | Calibri |
| Lato, Source Sans | Calibri Light |
| Playfair Display, Merriweather | Georgia |
| Montserrat, Poppins | Trebuchet MS |
| Fira Code, JetBrains Mono | Consolas |
| Times New Roman, Garamond | Palatino or Garamond |
| Any unknown | Calibri (safe default) |

---

## Saving the Config

After extraction, save to `case-study-config.json` at the project root.
On next run, check if this file exists first → skip extraction if brand is already saved.

Show the user a summary: "I've captured your brand style: [primary color] + [fonts]. Saved for future use."
