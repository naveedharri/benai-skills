# Deployment Guide

Deploy the landing page to Vercel or other platforms.

## Pre-Deployment Checklist

Before deploying:

- [ ] All content is finalized
- [ ] Images are optimized
- [ ] Forms are connected (if applicable)
- [ ] Meta tags are set (title, description, OG image)
- [ ] Favicon is in place
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance is acceptable (Lighthouse 90+)

---

## Vercel Deployment

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login (first time)
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? [Select your account]
# - Link to existing project? N (for new)
# - Project name? [your-project-name]
# - Directory? ./
# - Override settings? N
```

### Option 2: Git Integration

```bash
# Push to GitHub first
git init
git add .
git commit -m "Initial landing page"
git remote add origin [your-repo-url]
git push -u origin main

# Then in Vercel:
# 1. Go to vercel.com
# 2. Import Git Repository
# 3. Select your repo
# 4. Deploy
```

### Environment Variables

If the project uses env vars:

```bash
# In Vercel dashboard:
# Settings → Environment Variables

# Or via CLI:
vercel env add VARIABLE_NAME
```

---

## Post-Deployment

### Get the URL

```
"Your site is live!

Production URL: https://[project-name].vercel.app

You can also add a custom domain in Vercel settings.

Want to set up a custom domain?"
```

### Custom Domain Setup

```bash
# In Vercel dashboard:
# Settings → Domains → Add

# Steps:
# 1. Enter your domain (e.g., example.com)
# 2. Add DNS records as shown
# 3. Wait for propagation (up to 48h, usually minutes)
```

DNS records to add:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

---

## Alternative Platforms

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### GitHub Pages (Static only)

```bash
# Add to package.json
"homepage": "https://username.github.io/repo-name"

# Build and deploy
npm run build
npx gh-pages -d out  # or dist, build folder
```

### Railway

```bash
# Via Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## Production Optimizations

### Next.js specific

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-image-domain.com'],
  },
  // Enable static export if no server features needed
  output: 'export', // Optional: for static hosting
}
```

### Build command

```bash
# Default for Vercel
npm run build

# Verify build works locally first
npm run build && npm run start
```

---

## Analytics Setup (Optional)

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Google Analytics

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## Form Handling

### If using contact forms:

**Option 1: Formspree**

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <input type="email" name="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

**Option 2: Vercel Serverless**

```typescript
// app/api/contact/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  // Send email, save to DB, etc.
  return Response.json({ success: true });
}
```

**Option 3: Resend/SendGrid**

```bash
npm install resend
```

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'contact@yourdomain.com',
  to: 'you@email.com',
  subject: 'New Contact Form',
  html: '<p>Message content</p>',
});
```

---

## Deployment Success Message

```
"Your landing page is live!

🌐 URL: [production-url]

Next steps:
1. Test the live site
2. Submit to Google Search Console
3. Share on social media
4. Set up analytics (optional)

Anything else you need?"
```

---

## Troubleshooting

### Build Fails

```bash
# Check build locally first
npm run build

# Common issues:
# - TypeScript errors
# - Missing dependencies
# - Environment variables not set
```

### 404 on Routes

```javascript
// next.config.js for static export
module.exports = {
  output: 'export',
  trailingSlash: true, // Helps with static hosting
}
```

### Images Not Loading

```javascript
// next.config.js
module.exports = {
  images: {
    unoptimized: true, // For static export
    // Or add remote domains
    domains: ['example.com'],
  },
}
```

### Environment Variables Not Working

```bash
# Ensure they're in Vercel:
# Settings → Environment Variables

# For client-side access, prefix with NEXT_PUBLIC_
NEXT_PUBLIC_API_URL=https://api.example.com
```
