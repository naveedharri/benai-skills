# Deploy

Once the working file is edited and the substitutions verified clean, deploy to Vercel and generate the public share link.

## Setup (already configured, no action needed)

- Vercel CLI is installed globally (`vercel`)
- Authenticated as the user
- Team: `insinexzys-projects`
- Vercel MCP connector is installed (used for the share-link step)

## Deploy commands

```bash
SLUG="<lowercase-slug>"

# Stage in /tmp, Vercel deploys whatever is in the current dir
mkdir -p /tmp/benai-$SLUG-onepager
cp /Users/aryan/BenAI-Main-OS/Projects/claude-cowork/deliverables/$SLUG/one-pager.html \
   /tmp/benai-$SLUG-onepager/index.html

cd /tmp/benai-$SLUG-onepager
vercel deploy --prod --yes --name benai-$SLUG-onepager --scope insinexzys-projects 2>&1 | grep -E "Aliased|Error" | head -3
```

The `grep "Aliased|Error"` keeps the output short, successful deploys print `Aliased: https://benai-<slug>-onepager.vercel.app [Ns]`.

Why `/tmp` and not the project folder directly: the project folder lives in the vault and the Vercel deploy would try to upload the entire vault unless you stage. The `/tmp` stage is always exactly one file (`index.html`).

The first deploy creates the project automatically (no setup needed). Subsequent deploys to the same `--name` overwrite the production alias.

## Production URL

```
https://benai-<slug>-onepager.vercel.app
```

This URL is **SSO-protected by default** (it's on the `insinexzys-projects` team). Anyone outside the team gets a 401 page. That's by design, these are confidential proposals.

## Share link (23-hour public URL)

To share with the client, generate a `_vercel_share` URL using the MCP tool:

```
mcp__664c6544-66e3-4133-9561-341e62e3abd7__get_access_to_vercel_url
  url: https://benai-<slug>-onepager.vercel.app
```

Response:

```json
{
  "success": true,
  "shareableUrl": "https://benai-<slug>-onepager.vercel.app/?_vercel_share=<token>",
  "info": "Shareable URL created. Expires on <date+23h>."
}
```

Return the `shareableUrl` to the user. The 23-hour expiry is fine for same-day follow-up, the client clicks it once, the cookie gets set, and they can keep returning.

## When to flip Deployment Protection off (permanent public URL)

Default: don't. The 23-hour share link is sufficient for ~90% of cases.

Offer the permanent-URL option only when:
- The client said they want to revisit it over the next week+
- The deck contains no genuinely confidential strategy info (most one-pagers fit here)
- The user explicitly asks

To flip it off, in the Vercel dashboard: Project Settings → Deployment Protection → toggle off. Or via the API:

```bash
curl -X PATCH "https://api.vercel.com/v9/projects/<project-id>?teamId=team_ftiJVncWphcoDqUp5dWb7bLl" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ssoProtection": null}'
```

After flipping, the bare `https://benai-<slug>-onepager.vercel.app` works for anyone, indefinitely.

## Redeploying after edits

When the user asks for changes to a deployed one-pager, edit the source file under `Projects/claude-cowork/deliverables/<slug>/one-pager.html`, then re-run the deploy commands. Same project name, same URL, only the content updates.

Generate a fresh share link each redeploy (the previous one still works until its 23h expires, but it's serving the old version).

## Common issues

### "Aliased: ..." not appearing

The deploy might have failed before alias assignment. Run without the grep filter to see the full output:

```bash
vercel deploy --prod --yes --name benai-$SLUG-onepager --scope insinexzys-projects
```

### 404 when opening the URL

Two causes:
1. The `--directory` flag (if used) pointed at a folder that doesn't have `index.html`. Always use `index.html` as the filename, not `one-pager.html` directly, Python's http.server and most static hosts default to serving `index.html` from root.
2. The deploy completed but Vercel hasn't propagated yet. Wait ~30 seconds.

### Symlink trick for local preview

For local preview without redeploying, in the source folder:

```bash
ln -sf one-pager.html index.html
```

Then `python3 -m http.server 8080 --directory <folder>` serves the file at `http://localhost:8080/`.
