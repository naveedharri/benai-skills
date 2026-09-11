# Setting up the lead magnet in Kit

Written from the walkthrough Oskar ran with Juan on 2026-08-26, start to finish, ending in a
live test that worked. This replaces the earlier version, which described the flow in the
abstract and had never been run.

Everything here is point-and-click. No terminal.

## Where this fits in the chain

**Stage 3, straight after the Bitly import.** It needs two things that only exist once the
links are live, so it cannot run earlier:

- the `<code>-free` slug, which becomes the Kit page's own URL
- the `<code>-kityout` **long** URL, which becomes the redirect after someone subscribes

> [!warning] Skipping it does not fail quietly, it fails at stage 5
> On 2026-08-26 the lead magnet was left until after the description was written. Stage 5 then
> reported `blocker: the -free link 404s`, because the Bitly link was pointing at a Kit page
> that did not exist yet. The links were right; the destination was missing.
>
> So: if the Ship Brief says the lead magnet is needed, this page gets built before stage 3 is
> called done. Do not tick `Bitly imported` and move on with a `-free` link pointing at nothing.

## What you need open

1. The **Notion page** for the resource being given away. This is both the thing itself and the
   link that goes in the confirmation email.
2. **Bitly**, on `ben@benai.co`, for the two URLs above.
3. **Kit**, signed in. Access is granted by invitation to a Google account.

## Step 1: read what you are actually giving away

Open the Notion page for the resource and look at it. It matters because the page's headline has
to describe the real thing. A setup guide, a skill, a template and a repo are all different
promises, and the H1 has to match whichever it is.

## Step 2: duplicate the most recent landing page

In Kit: **Audience** in the left nav, then **Landing pages & forms**.

Two things make this findable: sort **by newest**, and switch from tile view to **list view**.
Both controls sit just under the blue bar.

Find the most recent page, click the **three dots** on its right, and choose **Duplicate**.
Never build one from scratch. The duplicate carries the layout, the styling and the offer
section below the fold, all of which are already right.

## Step 3: the H1

The headline on the page, currently something like "Get this setup guide right in your inbox".

**It has to name what you are giving away.** If the resource is a second-brain setup guide, the
H1 says setup guide. Not "get the skills", not a generic "get the resource".

## Step 4: the page title, top left

Currently reads "Copy of <previous name>". This is the internal name and it becomes part of how
the page is found later.

**It must be a noun, never a verb.** This is a firm rule and Oskar spelled it out with examples.

| Good, because they are nouns | Bad, because they are verbs |
|---|---|
| `Local AI` | `Make Money` |
| `Sales Skills` | `Learn AI` |
| `Marketing Skills` | `Read This` |
| `Sales OS Routines` | |
| `Skill Builder Kit` | |
| `Baalda Setup` | |

Remember to strip the words "Copy of" before publishing.

## Step 5: settings, on the far right

Four fields, and two of them are where things break.

### Redirect to an external page

This is where a subscriber lands **after** they submit the form. It is not how they arrive.

Paste the **long UTM URL** of the `-kityout` destination, which points at
`benai.co/accelerator-offer`. Get it from Bitly: find the `<code>-kityout` link and copy the
**long URL underneath it**, not the short `c.benai.co` link.

**Check the `utm_campaign` before pasting.** On a duplicated page it still carries the previous
video's campaign, which is exactly the mistake caught on 2026-08-26: the field said
`how-to-run-ai-locally-in-18-minutes-easy-setup` on a page for a completely different video. It
must be this video's campaign slug.

Why the long URL and not the short one: routing this through Bitly loses the attribution the
page exists to capture. The subscriber never sees this URL either way, so there is nothing to
tidy up.

The logic reads: *"your resource is on its way to your inbox, and in the meantime here is the
accelerator."*

### Domain name

The page's own slug, and **this is what caused the 404**.

It must be exactly the `-free` backhalf: `<code>-free`, and nothing else.

Copy it from Bitly, then **delete the `benai.co/` prefix and the slash**. Only the slug goes in
this field. Paste the whole short link and the page will not resolve.

### Confirmation email

Click **Edit email contents**. The email reads "here's your resource, click here to access".

The URL behind that button is the **Notion page link** for the resource. Copy it from Notion's
address bar.

### Advanced, and SEO & analytics

Nothing to change in either. Click through them.

## Step 6: save and publish

**Save and publish, not just save.** In Oskar's words, if you do not, everything you just did is
gone. This is the single easiest way to lose the whole setup.

## Step 7: test it for real, end to end

Do not skip this. It takes a minute and it is the only proof.

1. Open the `c.benai.co/<code>-free` short link, the one that will be in the description.
2. Confirm the landing page loads and the H1 matches the resource.
3. Fill the form in with a real name and a real inbox and submit.
4. Confirm the thank-you state appears: "your resource is on its way to your inbox", and
   scrolling down shows the accelerator offer.
5. Open the inbox. The email should have arrived, from Ben, reading "here's your resource".
6. Click **click here to access** and confirm it lands on the right Notion page.

All six, or it is not done.

## Recording it on the card

`Kit page URL` gets the published page URL. `Lead magnet` moves to `Live`. The Kit MCP can read
back `public_url` and `last_published_at` as proof the slug is right and the page published,
which is worth doing because `benai.kit.com` returns 403 to the sandbox and cannot be checked
from the shell.
