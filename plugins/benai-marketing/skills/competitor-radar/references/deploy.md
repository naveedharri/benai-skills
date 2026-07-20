# Deploy and Slack

## Deploy: git push, NOT the Vercel CLI

The Vercel project is git-connected to `insinexzy/benai-competitor-radar` (branch `main`).
A push to `main` auto-builds production at the stable URL
`https://benai-competitor-radar.vercel.app`. The URL never changes.

In a cloud routine, never use the Vercel CLI, a Vercel token, or api.vercel.com. Cloud
egress resolves to the wrong Vercel account by design. The git push IS the deploy. Locally,
`vercel deploy --prod` works and is fine for first setup.

```bash
cd <repo checkout>
git config user.name "insinexzy"
git config user.email "200930792+insinexzy@users.noreply.github.com"   # unknown authors are blocked by Vercel
# overwrite index.html with the freshly built file, then:
git add index.html radar_data.js
git commit -m "Competitor radar refresh <YYYY-MM-DD>"
git pull --rebase origin main && git push origin HEAD:main
# verify: poll curl -s "https://benai-competitor-radar.vercel.app/?v=<n>" until HTTP 200 shows the new week
```

## Slack

Post to `#team-chat` via the Slack connector: a short line plus the live URL, e.g.
`Competitor Radar refreshed for week ending <date>: https://benai-competitor-radar.vercel.app`.
