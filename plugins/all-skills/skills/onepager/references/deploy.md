# Deploy (optional)

Deployment is optional. The one-pager is a single self-contained HTML file with no build step, so the file itself is always a complete deliverable. **Always write the file. Deploy only if Vercel is available.** Never claim a share link you did not actually produce.

## Decision: file-only or deploy?

Check for Vercel before deciding:

```bash
command -v vercel >/dev/null 2>&1 && vercel whoami 2>/dev/null
```

- **Vercel CLI present and authenticated** → you can deploy. Use the CLI path below.
- **A Vercel deploy MCP tool is connected** (a `deploy_to_vercel` style tool) → you can deploy through it instead of the CLI.
- **Neither** → file-only handover. This is a perfectly good outcome, not a failure.

Some reps will not have Vercel set up, and that is fine. Do not install or configure anything. Hand over the file.

## File-only handover (the fallback, and the default)

Give the user the absolute path and offer to open it locally:

```bash
OUT="<output_dir-from-config-or-./clients>"
SLUG="<lowercase-slug>"
echo "$OUT/$SLUG/one-pager.html"
# Offer to open in the default browser:
#   macOS:  open "$OUT/$SLUG/one-pager.html"
#   Linux:  xdg-open "$OUT/$SLUG/one-pager.html"
```

For a quick local preview server (optional):

```bash
cd "$OUT/$SLUG" && ln -sf one-pager.html index.html
python3 -m http.server 8080 --directory "$OUT/$SLUG"
# http://localhost:8080/
```

The file opens in any browser exactly as it will look deployed. The rep can email the HTML, host it themselves, or send a PDF print of it. Tell them the file is theirs to host or send however they like.

## Vercel deploy (CLI path)

Stage one file in a temp dir so the deploy uploads only the page, not the whole project:

```bash
SLUG="<lowercase-slug>"
OUT="<output_dir-from-config-or-./clients>"

mkdir -p "/tmp/onepager-$SLUG"
cp "$OUT/$SLUG/one-pager.html" "/tmp/onepager-$SLUG/index.html"

cd "/tmp/onepager-$SLUG"
vercel deploy --prod --yes --name onepager-$SLUG 2>&1 | grep -E "Production|Aliased|Error|https://" | head -3
```

Name the project from the slug. If the rep's config sets a `deploy.vercel_scope`, add `--scope <that scope>`. The first deploy creates the project automatically. Re-running with the same `--name` overwrites the production alias, so redeploys keep the same URL.

The deploy prints the production URL (`https://onepager-<slug>.vercel.app` or a generated deployment URL). Return that to the user.

## Vercel deploy (MCP tool path)

If a Vercel deploy MCP tool is connected instead of the CLI, deploy the staged `/tmp/onepager-<slug>/index.html` through it and capture the returned URL. Follow whatever the tool returns; do not assume a URL shape.

## Share link / access protection

If the rep's Vercel team protects deployments behind SSO (common on team plans), the bare `.vercel.app` URL returns a login wall to outsiders. Two options:

- **Generate a time-boxed share link** if a Vercel share-link tool is available (a `get_access_to_vercel_url` style tool returns a `?_vercel_share=...` URL good for ~23 hours). Fine for same-day follow-up.
- **Personal / hobby Vercel accounts** usually have no protection, so the bare URL just works. Use it directly.

If you cannot produce a working public link, fall back to the file-only handover rather than returning a URL that 401s.

## Redeploying after edits

When the user asks for changes, edit the source file under `<output_dir>/<slug>/one-pager.html`, then re-run the same deploy commands. Same project name, same URL, updated content. Regenerate the share link if you use one.

## What to return

- **Deployed:** the file path AND the working URL (the share link if protection is on).
- **File-only:** the file path, a note that it is a complete standalone deliverable, and an offer to open it locally. Do not present a Vercel URL you did not create.
