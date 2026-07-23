# How to get your PandaDoc API key

The follow-up skill creates your proposal as a PandaDoc draft over the API, so you need an API key. Official reference: https://developers.pandadoc.com/reference/api-key-authentication-process

## What you need first

- A PandaDoc account. API access requires a paid plan (Business or higher). You can also create a free Sandbox account to get a Sandbox key for testing.
- Owner or admin access. Only the account owner and admin-role users can reach the Developer Dashboard.

## Sandbox vs Production

PandaDoc issues two keys:
- Sandbox: for testing. Documents are watermarked and not legally binding. Good for setup and the dry run.
- Production: for real client proposals. On a Business plan you may need to contact PandaDoc sales to enable the Production API key.

Start with Sandbox to get set up, then switch the env var to your Production key when you are ready to send real proposals.

### How to tell which one you are on

Sandbox documents come out **watermarked with a `[DEV]` prefix in the title**. If your test proposal is titled "[DEV] Acme - ... Proposal", you are on a sandbox key and these are NOT real client documents. The wizard records this in `config/pandadoc.md` as `key_environment` (sandbox or production) and will say so out loud, so nobody mistakes a sandbox draft for a live one. Switch the env var to your production key before sending anything to a real prospect.

## Steps

1. Sign in to PandaDoc as the owner or an admin.
2. Open the Developer Dashboard from the left sidebar (or go to Settings, then API and Integrations, then API, then Enable).
3. Go to the API keys section.
4. Generate a Sandbox key now. Generate or request the Production key when you are ready for live documents.
5. Copy the key.

PandaDoc's UI changes over time. If the labels differ, look for "Developer Dashboard" or "API and Integrations" and verify against the official docs above.

## Store the key as an environment variable

Do not paste the key into any config file or into chat. Set it as an environment variable so the skill reads it at runtime. The default name the skill expects is `PANDADOC_API_KEY`.

On macOS or Linux, add to your shell profile (for example `~/.zshrc`):

```
export PANDADOC_API_KEY="your_key_here"
```

Then restart your terminal or run `source ~/.zshrc`.

The skill's `config/pandadoc.md` records only the NAME of this variable (`api_key_env: "PANDADOC_API_KEY"`), never the value.

## Confirm it works

A single read call should return your templates:

```
curl https://api.pandadoc.com/public/v1/templates \
  -H "Authorization: API-Key $PANDADOC_API_KEY"
```

If you get a list of templates back, you are set. A 401 means the key is wrong or not enabled for production yet.
