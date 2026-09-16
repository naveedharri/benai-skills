---
name: youtube-link-setup
description: "Stage 3 of the Ben AI publishing chain. Makes a video's tracking links real before the video is published: imports the UTM links into Bitly on the c.benai.co domain, builds and publishes the Kit landing page when there is a lead magnet, registers it in the n8n form, and verifies every short link resolves to the right destination. Works with or without a Bitly API token; without one it walks the browser bulk-upload path, which needs no terminal. Use when someone says \"upload the links to Bitly\", \"import the UTMs\", \"make the Bitly links\", \"set up the lead magnet\", \"create the landing page\", \"test the links\", or has just run benai-utm-creator."
---

# YouTube Link Setup

Stage 3. Takes the CSV and code from `benai-utm-creator` and makes them real: short links
live on `c.benai.co`, lead magnet page live in Kit if there is one, every link verified.

Owns the links only. Does not touch the video description or YouTube Studio.

Needs nothing from the video itself, so it can run while YouTube is still processing.

## Steps

```
Task Progress:
- [ ] 1. Confirm the backhalves are free
- [ ] 2. Show the links and get the go      ← HUMAN CHECKPOINT
- [ ] 3. Import to Bitly
- [ ] 4. Lead magnet page built, published and tested end to end
- [ ] 5. Verify every link resolves
- [ ] 6. Tick Bitly imported on the Notion card
```

### 1. Confirm the backhalves are free

Open `https://c.benai.co/<code>-accelerator`. A 404 means the code is clean. Anything that
resolves means links for this code already exist: stop and report rather than duplicating.

### 2. The human checkpoint

Show the full list of links with their destinations and say plainly what the import costs:
Bitly's monthly quota is finite and links are awkward to unpick. Wait for an explicit go.

Say how many links are being imported. Five and six are both correct answers depending on the
lead magnet, and the operator should see which one is happening.

### 3. Import to Bitly

Two paths. Pick by what exists, and say which one you are using.

- **Token present** (`BITLY_TOKEN` in the environment): use `references/bitly-import-api.md`.
  Deterministic, no browser. Run it yourself; never show the operator a command and never echo
  the token into the transcript or a note.
- **No token:** use `references/bitly-bulk-upload.md`. Point-and-click in the browser, six
  steps, no terminal. This is the normal path.

### 4. Lead magnet, if there is one

Only when the Ship Brief said yes. Read `references/kit-lead-magnet.md`.

The slug must be exactly `<code>-free`. Any other slug breaks the free link with no visible
error anywhere.

The Kit redirect takes the long URL, never the Bitly short link. Routing it through Bitly
loses the attribution the page exists to capture.

Kit landing pages cannot be built through the Kit MCP, because every Ben AI page is
`editor_version: v1` which the API cannot edit. Duplicate and edit in the browser. The Kit MCP
still finds the template and reads back `public_url` and `last_published_at` as proof the slug
is right and the page published.

`benai.kit.com` returns 403 to the sandbox, browser user-agent included. That is Kit blocking
the datacenter IP, not a broken page. Verify through the Kit API plus Chrome, never the shell.

> [!important] Do not close stage 3 with the lead magnet unbuilt
> On 2026-08-26 this step was left until after the description was written, and stage 5 reported
> `blocker: the -free link 404s`. The Bitly link was correct; its destination did not exist. If
> the Brief says the lead magnet is needed, the Kit page gets built before `Bitly imported` is
> ticked.
>
> The reference now carries the full click path, the two fields that break (the redirect's stale
> `utm_campaign`, and the slug needing the `benai.co/` prefix stripped), and the six-point live
> test that has to pass. It ran end to end successfully on 2026-08-26.

### 5. Verify every link resolves

Read `references/link-verification.md`. Do not skip this on the grounds that the CSV was right.
Bitly does not always store what it was given.

Bitly reorders the query string alphabetically on import. Every parameter survives, so check
that all four are present rather than comparing the string character for character.

### 6. Tick the card

`Bitly imported` on the Notion card. An unchecked box is how `youtube-description` knows not to
write a description full of dead links.

## Hard rules

- **Never rename a backhalf that is already live.** It breaks the link everywhere it has been
  published. When a suffix convention changes it applies to new videos only. The Cowork suffix
  moved from `-cowork` to `-os` on 2026-08-26 on exactly this basis, and every earlier link
  keeps `-cowork`.
- **No terminal for the operator.** Either you run the API path yourself, or they click through
  the browser. Never hand someone a shell command.
- **Never echo the Bitly token** into a transcript, a note, or a vault file.
- **Four of the six links go in the description**: accelerator, free, aioperator, agency.
  Importing all six is right. Publishing all six is not.
