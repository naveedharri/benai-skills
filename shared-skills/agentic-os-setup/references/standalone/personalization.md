# Personalization Recipes

Concrete edits for the most common "make it mine" asks. Use after the initial setup is running — once the user has seen real data flow, they can describe what's wrong and what they want changed.

The pattern is the same across every recipe: agent locates the right file, makes the edit, restarts the dev server (or redeploys via Railway if production). Non-technical user only sees "before / after" — they don't see the diff.

---

## Tabs (the left-side menu on a profile page)

**File:** `app/profile/[name]/page.tsx`. The `sections` array under `DashboardShell` controls which tabs appear, in what order, with what label and icon.

### "Hide a tab"
Remove the matching entry from both `sections[0].items` AND the `views` array (the view is what gets mounted when the tab is active — leaving it in `views` is harmless but cleaner to remove).

### "Rename a tab"
Edit the `label` on the matching `items` entry. Don't change `key` (used internally for the active-tab state).

### "Reorder tabs"
Reorder entries in `sections[0].items`. The active-tab state defaults to the first entry.

### "Change the icon"
Swap the `icon` string. The shell renders whatever Unicode glyph or emoji is passed. Examples already in use: `◎`, `▶`, `◍`, `✉`, `◫`, `✦`, `📚`, `✓`, `☉`, `►`. Or use a real emoji.

---

## What each refresh pulls

**File:** `lib/server/snapshot-prompts.ts`. Each snapshot has a `buildPrompt` function returning a template string. These are plain English instructions sent to the Agent SDK.

### "Track these Twitter accounts instead"
Open the `research` prompt. Find the line about "Apify tweet-scraper for accounts" and replace the example list with the user's accounts. Save → click Refresh on the Research tab → done.

### "Pull only the last 7 days of meetings, not 14"
Open the `meetings` prompt. Change `last 14d` → `last 7d` (also update `meetings_count_14d` field name if you want to be tidy).

### "Don't classify cold pitches as 'fyi' — put them in 'needs_reply' instead"
Open the `comms` prompt → Categorization section → move the "cold sponsorship pitch" criterion from `fyi` to `needs_reply`.

### "Generate draft replies in a different tone"
Open the `comms` prompt → the `draft_reply` description. Edit the voice line. Example before: "Direct, conversational, no buzzwords, no em-dashes." Edit to whatever the user wants — keep one sentence.

### "Add a new field to a snapshot"
1. Add the field to the JSON shape inside the prompt.
2. Add it to the matching TypeScript interface in `lib/types.ts`.
3. Add a UI block to the matching view component under `components/views/profile/`.

---

## Team members (profiles)

**File:** `lib/config.ts`. `PROFILES` is the source of truth.

### "Add a teammate"
Append to `PROFILES`. Drop a square JPG at `public/avatars/<Name>.jpg`. Restart dev server. New route `/profile/<Name>` is live.

### "Remove a teammate"
Remove from `PROFILES`. Their `/profile/<Name>` route returns 404. Snapshot data (community.json etc.) is unaffected — it's global, not per-profile.

### "Reorder profiles / change who's primary"
First entry in `PROFILES` is the primary by default — they get the synthesis-leaning overview. Either reorder, or set the `PRIMARY_PROFILE` env var to override without touching `PROFILES`.

---

## Branding

**Files:**
- `lib/config.ts` → `ORG_NAME` (shows in header eyebrows, all snapshot prompts as "the {{ORG_NAME}} dashboard")
- `middleware.ts` → basic auth realm string ("…@ {{ORG_NAME}} Dashboard")
- `public/avatars/<Name>.jpg` → per-profile pictures
- `app/globals.css` → all design tokens. Colors live in CSS variables at the top: `--canvas`, `--ink`, `--accent`, `--primary`, etc. Change them in one place.

### "Use brand colors X and Y"
Open `app/globals.css`. The first `:root { ... }` block has every color token. Replace the ones you want — `--accent` for action highlights, `--primary` for positive variants, `--alert` for urgent, `--ink` for body text.

---

## Add a new tab + snapshot

End-to-end recipe for adding e.g. a "Stripe" tab that pulls revenue data.

1. **Register the snapshot name.** `lib/server/paths.ts`:
   ```ts
   export const VALID_SNAPSHOTS = [
     "community", "youtube", "comms", "meetings", "intelligence", "research",
     "stripe",   // ← add
   ] as const;
   ```

2. **Write the prompt.** Add an entry to `SNAPSHOT_PROMPTS` in `lib/server/snapshot-prompts.ts`:
   ```ts
   stripe: {
     mcp_servers: ["stripe"],   // assumes you've added a stripe MCP
     buildPrompt: (snapshotPath) => `Pull Stripe revenue data for the last 30 days. Write JSON to ${snapshotPath}. Shape: { updated_at, mrr, new_subscribers_7d, failed_payments: [...], top_customers: [...] }`,
   },
   ```

3. **Define the TypeScript type.** `lib/types.ts`:
   ```ts
   export interface StripeSnapshot {
     updated_at: string;
     mrr: number;
     new_subscribers_7d: number;
     failed_payments: Array<{ customer: string; amount: number; reason: string }>;
     top_customers: Array<{ name: string; mrr: number }>;
   }
   ```
   Then add `stripe?: StripeSnapshot` to `ProfileBundle`.

4. **Wire the data read.** `lib/data.ts`: add `const stripe = () => readSnap<any>("stripe", {});` plus a getter, then include `stripe: getStripe()` in `getProfileBundle`.

5. **Build the view.** Create `components/views/profile/stripe.tsx` exporting `ProfileStripe({ data })`. Use `Card`, `KPI`, etc. from `components/`. Copy the pattern from any existing view file.

6. **Add the tab.** `app/profile/[name]/page.tsx`:
   - Import: `import { ProfileStripe } from "@/components/views/profile/stripe";`
   - Add to `sections[0].items`: `{ key: "stripe", label: "Stripe", icon: "💰" }`
   - Add to `views`: `{ key: "stripe", label: "Stripe", node: <ViewWithRefresh snapshot="stripe" profile={name} updatedAt={data.stripe?.updated_at}><ProfileStripe data={data} /></ViewWithRefresh> }`

7. **Wire the new MCP key.** `scripts/write-mcp-config.mjs`: add the env-var-driven block for the Stripe MCP. Set `MCP_STRIPE_KEY` in `.env.local` and on Railway.

8. **Restart / redeploy.** Click Refresh on the new tab. Done.

---

## Refresh button behavior

**File:** `components/ViewWithRefresh.tsx`. Defaults to showing "updated <relative time>" and a Refresh button. To hide the button (e.g. for a read-only synthesis tab), remove the wrapper around that view's node in `app/profile/[name]/page.tsx`.

---

## Sending replies from the Comms tab

**File:** `app/api/comms/send/route.ts`. Currently wired for LinkedIn (Unipile). To add Circle DM send:

```ts
if (source === "circle") {
  if (!room_id) return NextResponse.json({ error: "room_id required" }, { status: 400 });
  // Call the circle-community MCP via the SDK, OR direct fetch if the MCP has an HTTP endpoint
  // for chat_send. Use CIRCLE_OWNER_EMAIL from env.
  ...
}
```

YouTube comment replies need OAuth on the YouTube Data API — not supported by the read-only Vidiq MCP.

---

## Auth (basic auth password rotation)

**Local:** edit `.env.local`, restart `npm run dev`.
**Railway:** `railway variables --set "BASIC_AUTH_PASS=$(openssl rand -hex 12)"`. Auto-redeploys.

To disable auth (for local dev), set both `BASIC_AUTH_USER` and `BASIC_AUTH_PASS` to empty.

---

## Common "small thing" requests

| User says | Where to look |
|---|---|
| "The dates are showing in UTC, I want PST" | `lib/utils.ts` → `rel()` or wherever the format happens. Currently UTC throughout. |
| "Make the basic auth realm say my company" | Already does — `middleware.ts` uses `{{ORG_NAME}}`. No change needed. |
| "I don't like the green primary color" | `app/globals.css` → `--primary` token. |
| "I want the dashboard to default to a specific tab" | `DashboardShell`'s `defaultView` prop in `app/profile/[name]/page.tsx`. |
| "Add a logo to the top-left" | `components/DashboardShell.tsx` — there's a `brandAvatar` prop that takes an image URL. Pass a path to a file in `public/`. |
| "Refresh all snapshots at once" | Already wired — the "Refresh all" button in the top-right of any profile page uses `RefreshAllAction`. |
| "Schedule refreshes automatically" | Not built. Add a cron Lambda / Railway cron service that POSTs to `/api/refresh/<name>` on a schedule, using basic-auth headers. |

---

## When the user asks for something not on this list

The dashboard is a real Next.js app. Anything is editable. Always:

1. Locate the file by reading the structure (`app/`, `components/`, `lib/`).
2. Make the smallest possible edit.
3. Restart dev server (or trigger Railway redeploy via `railway up --ci --detach`).
4. Verify the change actually rendered.

Resist scope creep. If the user says "rename the Comms tab", don't also restructure the comms view. One change at a time.
