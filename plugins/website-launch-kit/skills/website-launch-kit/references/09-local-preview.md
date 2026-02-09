# Local Preview Guide

Run the development server and give user access to view their site.

## Starting the Dev Server

### Next.js Project

```bash
npm run dev
```

Default: `http://localhost:3000`

### Vite Project

```bash
npm run dev
```

Default: `http://localhost:5173`

---

## What to Tell the User

After starting the server:

```
Your site is now running locally!

Open this URL in your browser:
→ http://localhost:3000

What you'll see:
- The full landing page with all sections
- Interactive elements (buttons, forms, animations)
- Responsive design (resize your browser to see mobile view)

Take a look and let me know:
1. What do you like?
2. What should change?
3. Any sections need work?
```

---

## Preview Checklist

Before showing user:

### Visual Check
- [ ] All sections render without errors
- [ ] Typography displays correctly (fonts loaded)
- [ ] Colors match the design system
- [ ] Images/placeholders display properly
- [ ] Spacing looks intentional

### Functional Check
- [ ] CTAs have correct href
- [ ] Form inputs are interactive
- [ ] Animations play on scroll
- [ ] Mobile menu works (if applicable)
- [ ] No console errors

### Responsive Check
- [ ] Desktop (1440px+)
- [ ] Laptop (1024px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

---

## Common Issues

### Fonts Not Loading

```bash
# Check if fonts are properly imported
# In Next.js, check src/styles/fonts.ts
# Ensure fonts are applied to html/body
```

### Images Not Showing

```bash
# Check image paths
# For Next.js public folder: /image.jpg
# For src imports: import img from './image.jpg'
```

### Styles Not Applying

```bash
# Check Tailwind config includes all paths
# Ensure globals.css is imported in layout
# Check for CSS variable definitions
```

### Port Already in Use

```bash
# Kill the process on that port
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>

# Or use different port
npm run dev -- --port 3001
```

---

## Showing Specific Sections

If user wants to jump to a section:

```
To jump directly to a section, add the section ID to the URL:

- Hero: http://localhost:3000#hero
- Problem: http://localhost:3000#problem
- Solution: http://localhost:3000#solution
- Process: http://localhost:3000#process
- Testimonials: http://localhost:3000#testimonials
- FAQ: http://localhost:3000#faq
- Contact: http://localhost:3000#contact
```

---

## Mobile Preview

### Option 1: Browser DevTools

```
In Chrome/Edge:
1. Right-click → Inspect
2. Click the device toggle icon (or Ctrl+Shift+M)
3. Select device or set custom dimensions
```

### Option 2: Local Network Access

If user wants to view on their phone:

```bash
# Find your local IP
# Windows
ipconfig

# Mac
ifconfig | grep "inet "

# Access from phone (same network)
http://192.168.x.x:3000
```

Note: May need to configure server to listen on 0.0.0.0:

```javascript
// next.config.js
module.exports = {
  // ...
}

// Or run with:
npm run dev -- --hostname 0.0.0.0
```

---

## Hot Reloading

Changes update automatically:

```
The dev server has hot reload enabled.

When I make changes:
- The browser will refresh automatically
- No need to manually refresh
- State may reset on some changes

If you don't see changes:
1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Restart dev server
```

---

## Build Preview

To test the production build locally:

```bash
# Build the project
npm run build

# Start production server
npm run start
```

This shows exactly what will be deployed.

---

## Performance Check

Quick performance validation:

```bash
# In browser DevTools:
1. Open Network tab
2. Refresh page
3. Check:
   - Total page size
   - Number of requests
   - Largest content paint (LCP)

# Lighthouse audit:
1. Open DevTools
2. Go to Lighthouse tab
3. Run audit
4. Review scores
```

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

---

## Ending the Server

When done previewing:

```bash
# In the terminal running the server
Ctrl+C

# This stops the development server
```
