# Pulling YouTube data through Claude in Chrome

Rebuilt 2026-08-20 after a live run. The previous version of this file was missing from the synced
skill. Everything below was verified working against an unlisted video.

## Hard constraint: the container cannot reach YouTube

`youtube-transcript-api` from bash fails with `IpBlocked`, and `curl` on a watch page returns 302.
Do not retry either. Every YouTube read goes through Chrome.

## The one trick that makes this cheap

From a tab already on `youtube.com`, `fetch()` is same-origin and returns the **full** watch-page
HTML with cookies attached. That gives you title, duration and the complete description without
navigating. Use it instead of loading each video.

```js
const h = await (await fetch('/watch?v=VIDEO_ID')).text();
const title = JSON.parse('"' + h.match(/"title":"((?:[^"\\]|\\.)*?)","lengthSeconds"/)[1] + '"');
const dur   = +h.match(/"lengthSeconds":"(\d+)"/)[1];
const desc  = JSON.parse('"' + h.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/)[1] + '"');
```

Chapter lines out of a description:

```js
[...desc.matchAll(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*[–\-—]\s*(.+)$/gm)].map(m => m[1] + ' | ' + m[2])
// The character class deliberately includes an em dash. Ben's format is an en dash, and a
// wrongly typed em or hyphen still has to be caught so it can be reported and fixed.
```

## Known failures, so you do not rediscover them

- **List pages do not render.** `/channel/.../videos`, `/playlist?list=...` and YouTube Studio all
  come back with a ~350-character body and a stub `ytInitialData`. Scrolling and waiting do not help.
  Never try to scrape the video grid from the DOM.
- **`/feeds/videos.xml` 404s.** Not available here.
- **Tabs die mid-session.** Anything stored on `window` can vanish between calls. Either re-derive
  state in each call or accept re-fetching. Keep each call self-contained where you can.
- **JS responses cap at roughly 1000 characters.** Store bulk data on `window` and read it back in
  slices; do not try to return a transcript in one go.

## Getting the channel's recent uploads

The DOM route is dead, so use YouTube's own InnerTube API from the tab. Two steps.

```js
// 1. credentials out of any watch page
const h  = await (await fetch('/watch?v=ANY_ID')).text();
const K  = h.match(/"INNERTUBE_API_KEY":"([^"]+)"/)[1];
const CV = h.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)[1];
const CID = h.match(/"channelId":"(UC[\w-]{22})"/)[1];

// 2. browse the uploads playlist: VL + UU + channel id without the UC
const r = await fetch('/youtubei/v1/browse?key=' + K + '&prettyPrint=false', {
  method: 'POST', headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({context:{client:{clientName:'WEB', clientVersion: CV, hl:'en', gl:'US'}},
                        browseId: 'VLUU' + CID.slice(2)})});
const j = await r.text();
const ids = [...new Set([...j.matchAll(/"videoId":"([\w-]{11})"/g)].map(m => m[1]))];
```

Notes:
- The `VL` prefix is required. Without it the API returns 400.
- A 200 with a tiny body and `alerts: [{... "The playlist does not exist."}]` means the channel id
  is wrong. **Always read the channel id out of a watch page**, never transcribe it from a
  screenshot or a Studio URL: doing that once produced `UC3K7KN8B_ierAXvrxVNnbZQ` when the real id
  is `UC3KK7ENB_ierAXvrxVNnbZQ`, and every request silently returned nothing.
- The list is newest first and excludes unlisted videos, so the video you are preparing will not
  appear in it.

## Timestamped transcript for one video

The transcript panel does have to be opened in the DOM; there is no fetch shortcut.

```js
document.querySelector('tp-yt-paper-button#expand')?.click();          // expand description
await new Promise(r => setTimeout(r, 1200));
[...document.querySelectorAll('button')]
  .find(b => /show transcript/i.test(b.getAttribute('aria-label') || ''))?.click();
await new Promise(r => setTimeout(r, 2500));

window.__ts = [...document.querySelectorAll('ytd-transcript-segment-renderer, transcript-segment-view-model')]
  .map(s => {
    const raw = (s.innerText || '').trim();
    const m = raw.match(/^(\d{1,2}:\d{2}(?::\d{2})?)/);              // NOT /\d+:\d+/
    if (!m) return null;
    let t = raw.slice(m[1].length).trim()
               .replace(/^\d+\s*(minutes?,?\s*)?\d*\s*seconds?/i, '') // a11y duplicate
               .replace(/\n+/g, ' ').trim();
    return m[1] + ' | ' + t;
  }).filter(Boolean);
window.__ts.length
```

`/\d+:\d+/` swallows the accessibility "X seconds" label and yields junk like `0:088`. Use the
anchored pattern.

Read it back in slices of about 8 lines at 130 characters:

```js
window.__ts.slice(0, 15).map(l => l.slice(0, 130)).join('\n')
```

## Finding transitions without reading everything

Reading 75 segments at 8 lines per call is 10 round trips. Filter first, then read only the windows
around each candidate.

```js
const p = /(so what is|first|second|next|lastly|another|besides|you might be wondering|
             what does this cost|pricing|multiple account|team|maintenance|token efficien|
             highly recommend|limitations)/i;
window.__hits = window.__ts.map((l, i) => ({i, l})).filter(o => p.test(o.l));
window.__hits.map(o => o.i + ' ' + o.l.slice(0, 58)).join('\n')
```

Then `window.__ts.slice(n-1, n+7)` around each hit to confirm the exact boundary line.

## Preroll ads lie about duration

Immediately after navigating, `.ytp-time-duration` can report the ad's length. Wait, then re-read.
Cross-check against `"lengthSeconds"` from the fetched HTML, which is always the real value.
