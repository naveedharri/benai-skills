# Phase 5: Post-Launch Steps

Each step below is self-contained. The user picks from the "What's your next move?" menu — read only the section they selected.

After completing any step, show the menu again.

---

## Connect Custom Domain

### What Claude Does
- Updates `robots.txt` and `sitemap.ts` with the new domain
- Updates OG/meta tags with the production URL
- Redeploys to Vercel

### What You Do

**1. Buy a domain** (if you don't have one):
- **Namecheap** — namecheap.com (usually cheapest, ~$10/year)
- **Google Domains** — domains.google
- **GoDaddy** — godaddy.com

Pick a `.com` if available.

**2. Connect it to Vercel:**
1. Go to **vercel.com** → your project → **Settings** → **Domains**
2. Type your domain (e.g., `yourbusiness.com`) and click **Add**
3. Vercel shows DNS records to add:
   ```
   Type: A    Name: @    Value: 76.76.21.21
   ```
4. Go to your domain registrar (Namecheap, etc.) → **DNS Settings**
5. Add the records Vercel showed you
6. Wait 5-30 minutes

**3. Verify:** Open your domain in a browser — site loads with a lock icon (HTTPS is automatic).

### Video Guide
Search YouTube: **"How to connect custom domain to Vercel"** — Vercel's official channel has a 3-minute walkthrough.

### After This Step
Paste your domain here so Claude can update all URLs in the site (sitemap, robots.txt, OG tags, canonical).

---

## Install Google Analytics

### What Claude Does
- Adds the GA4 tracking script to `app/layout.tsx`
- Wraps it in a cookie consent check (if cookie banner is installed)
- Redeploys to Vercel

### What You Do

**1. Create a Google Analytics account:**
1. Go to **analytics.google.com**
2. Click **Start measuring**
3. Enter your business name
4. Create a property → enter your website URL
5. You'll get a **Measurement ID** that starts with `G-`

**2. Paste your Measurement ID here** — Claude will add it to your site and redeploy.

### Video Guide
Search YouTube: **"How to set up Google Analytics 4 for beginners"** — there are many good 5-minute walkthroughs.

### What You'll See After Setup
Within 24-48 hours, your GA dashboard will show:
- Real-time visitors on your site
- Where visitors come from (Google, social media, direct)
- Which pages they view
- How long they stay

---

## Set Up Google Search Console

### What Claude Does
- Adds the verification meta tag to `app/layout.tsx`
- Redeploys so Google can verify
- Confirms your sitemap URL for submission

### What You Do

**1. Add your site to Search Console:**
1. Go to **search.google.com/search-console**
2. Click **Add Property**
3. Choose **URL prefix** → enter your full URL (e.g., `https://yourbusiness.com`)

**2. Verify ownership:**
1. Choose **HTML tag** verification method
2. Google gives you a meta tag — copy it
3. Paste it here — Claude will add it and redeploy
4. Go back to Search Console → click **Verify**

**3. Submit your sitemap:**
1. In Search Console, go to **Sitemaps** in the left menu
2. Enter `sitemap.xml` and click **Submit**

Your site will start appearing in Google search results within a few days to a few weeks.

### Video Guide
Search YouTube: **"Google Search Console setup tutorial"** — Google's own channel has an official guide.

### What You'll See After Setup
- Which search queries bring people to your site
- How many impressions and clicks you get
- Any indexing issues Google finds

---

## Connect Forms / Lead Capture

### What Claude Does
- Wires the form `action` to your chosen endpoint
- Adds success/error state handling
- Tests the form submission
- Redeploys to Vercel

### What You Do

Pick one option based on what your site needs:

### Option A: Contact Form → Email

**Formspree** (free for 50 submissions/month):
1. Go to **formspree.io** → create a free account
2. Create a new form → you get an endpoint URL like `https://formspree.io/f/abcd1234`
3. Paste the endpoint URL here

**Tally** (free, unlimited):
1. Go to **tally.so** → create your form
2. Copy the embed code
3. Paste it here

### Option B: Email Signup → Newsletter

**Beehiiv** (free up to 2,500 subscribers):
1. Go to **beehiiv.com** → create an account
2. **Settings** → **Embeds** → copy the embed code
3. Paste it here

**Mailchimp** (free up to 500 contacts):
1. Go to **mailchimp.com** → create an account
2. **Audience** → **Signup Forms** → **Embedded Forms**
3. Copy the form action URL → paste it here

### After Setup
Claude will wire it up and redeploy. Then test:
1. Fill out the form on your live site
2. Check you received the submission
3. Try on mobile too

---

## Add Legal Pages

### What Claude Does
- Creates `/privacy-policy` page with your policy content
- Creates `/terms` page with your terms content
- Adds links to both in the site footer
- Adds a cookie consent banner (if requested)
- Redeploys to Vercel

### What You Do

**1. Generate a Privacy Policy:**
1. Go to **termly.io/products/privacy-policy-generator** (free)
2. Answer the questions about your site (what data you collect, analytics, etc.)
3. Copy the generated policy text
4. Paste it here

**2. Generate Terms of Service:**
1. Go to **termly.io/products/terms-and-conditions-generator** (free)
2. Answer the questions
3. Copy the generated terms
4. Paste it here

**3. Cookie Consent (if you have EU visitors):**
Just say "add cookie banner" — Claude will add a GDPR-compliant banner that:
- Shows a notice about cookies
- Has Accept/Decline buttons
- Only loads analytics after consent

### Video Guide
Search YouTube: **"How to create a privacy policy for your website free"** — several good guides using Termly.

---

## Continue Editing

No reference needed. The user stays in the conversation and can:
- Click any element in the preview panel to reference it
- Describe changes in plain text ("make the hero section taller", "change the CTA color to blue")
- Ask to add new sections, modify copy, swap images, etc.

After changes are made, redeploy with `npx vercel --prod` and show the menu again.

---

## I'm Done For Now

End the session with:

```
You're all set! Your site is live at [production URL].

Come back anytime — run /website-launch-kit and pick up where you left off.
```
