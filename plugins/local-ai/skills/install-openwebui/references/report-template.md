# Report Template

Every skill in this plugin delivers its result as a rendered HTML report, not as a wall of chat text. Terminal output is fine for progress; the *result* is a page.

Use this exact design system so every report in the plugin looks like one product.

## Contents
1. Rules
2. The skeleton
3. Components
4. Per-skill layouts
5. Save and open

## 1. Rules

- Write the file, then open it. Never paste the HTML into chat.
- Save to the user's Desktop unless they name a path: `~/Desktop/<skill>-<YYYY-MM-DD>.html`.
- One self-contained file. Inline all CSS. No build step, no framework, no CDN except the Google Fonts link below.
- Never use em dashes in the copy. Periods, commas, colons.
- Never invent a number. If something was not detected, write "not detected", not a plausible value.
- Keep the chat summary to three lines maximum, then the file path. The page carries the detail.
- Light theme only. Do not add a dark mode.

## 2. The skeleton

Start from this every time. Fill in `TITLE`, `EYEBROW`, `HEADLINE`, `LEDE` and the body.

```html
<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TITLE</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#F6F6F4; --core:#FFF; --shell:rgba(15,15,20,.022);
  --hair:rgba(15,15,20,.075); --hair-2:rgba(15,15,20,.14);
  --ink:#0C0C0F; --ink-2:rgba(12,12,15,.615); --ink-3:rgba(12,12,15,.395);
  --violet:#5B4BD6; --emerald:#047857; --amber:#B45309; --rose:#BE123C;
  --ease:cubic-bezier(.32,.72,0,1);
  --lift:0 1px 2px rgba(15,15,20,.028), 0 8px 22px -10px rgba(15,15,20,.055), 0 26px 60px -26px rgba(15,15,20,.085);
}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--ink);font-family:'Geist',ui-sans-serif,system-ui,sans-serif;
  line-height:1.5;letter-spacing:-.011em;-webkit-font-smoothing:antialiased}
.mesh{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.orb{position:absolute;border-radius:50%;filter:blur(130px)}
.orb-a{width:900px;height:900px;top:-440px;left:-220px;background:radial-gradient(circle,rgba(91,75,214,.18),transparent 68%)}
.orb-b{width:720px;height:720px;bottom:-380px;right:-300px;background:radial-gradient(circle,rgba(4,120,87,.13),transparent 70%)}
.wrap{position:relative;z-index:1;max-width:1080px;margin:0 auto;padding:72px 30px 80px}
.mono{font-family:'Geist Mono',ui-monospace,monospace}
.eyebrow{display:inline-flex;align-items:center;gap:7px;padding:4px 11px;border-radius:999px;
  background:rgba(255,255,255,.85);border:1px solid var(--hair);font-size:9.5px;font-weight:500;
  text-transform:uppercase;letter-spacing:.19em;color:var(--ink-2)}
h1{font-size:clamp(2rem,4.4vw,3.1rem);font-weight:600;line-height:1.02;letter-spacing:-.042em;margin:18px 0 0}
h2{font-size:1.02rem;font-weight:550;letter-spacing:-.026em}
.lede{font-size:1rem;color:var(--ink-2);line-height:1.56;max-width:660px;margin-top:14px;font-weight:350}
.sub{font-size:.845rem;color:var(--ink-2);line-height:1.56;font-weight:350}
.tiny{font-size:.755rem;color:var(--ink-3);line-height:1.55}
.grad{background:linear-gradient(102deg,#0C0C0F 4%,#5B4BD6 52%,#047857 96%);
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px;margin-top:30px;align-items:stretch}
.grid>div{display:flex;flex-direction:column;gap:14px;min-width:0}
.c3{grid-column:span 3}.c4{grid-column:span 4}.c6{grid-column:span 6}
.c8{grid-column:span 8}.c12{grid-column:span 12}
@media(max-width:860px){.grid{grid-template-columns:1fr}.c3,.c4,.c6,.c8,.c12{grid-column:span 1}}
.shell{background:var(--shell);border:1px solid var(--hair);border-radius:1.6rem;padding:5px;
  flex:1 1 0;display:flex;flex-direction:column;transition:border-color .8s var(--ease)}
.shell:hover{border-color:var(--hair-2)}
.core{background:var(--core);border-radius:calc(1.6rem - 5px);box-shadow:var(--lift);
  padding:22px;flex:1 1 auto}
.ok{border-color:rgba(4,120,87,.26)}
.ok>.core{background:linear-gradient(162deg,rgba(4,120,87,.05),var(--core) 52%)}
.chip{display:inline-block;font-family:'Geist Mono',monospace;font-size:9.5px;padding:3px 8px;
  border-radius:999px;background:rgba(15,15,20,.038);border:1px solid var(--hair);color:var(--ink-2);
  white-space:nowrap;margin:0 4px 4px 0}
.chip-e{background:rgba(4,120,87,.075);border-color:rgba(4,120,87,.22);color:var(--emerald)}
.chip-v{background:rgba(91,75,214,.075);border-color:rgba(91,75,214,.22);color:var(--violet)}
.chip-a{background:rgba(180,83,9,.075);border-color:rgba(180,83,9,.22);color:var(--amber)}
.chip-r{background:rgba(190,18,60,.07);border-color:rgba(190,18,60,.2);color:var(--rose)}
.kpi{font-size:clamp(1.6rem,2.7vw,2.2rem);font-weight:600;letter-spacing:-.042em;line-height:1}
.kpi-l{font-size:9.5px;text-transform:uppercase;letter-spacing:.16em;color:var(--ink-3);margin-top:8px}
.row{display:grid;grid-template-columns:118px 1fr;gap:18px;padding:9px 0;border-top:1px solid var(--hair);align-items:baseline}
.row:first-of-type{border-top:none}
.row>b{font-family:'Geist Mono',monospace;font-size:11.5px;font-weight:500;letter-spacing:-.01em}
.row>span{font-size:.795rem;color:var(--ink-2);font-weight:350;line-height:1.48}
.row.hot>b{color:var(--emerald)}
.row.head{padding:0 0 7px}
.row.head>b,.row.head>span{font-family:'Geist Mono',monospace;font-size:8px;text-transform:uppercase;
  letter-spacing:.13em;color:var(--ink-3);font-weight:500}
.bar{display:flex;height:38px;border-radius:.6rem;overflow:hidden;border:1px solid var(--hair);margin-top:14px}
.bar>span{display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:500;
  letter-spacing:.04em;color:#fff;text-transform:uppercase}
.b1{background:linear-gradient(180deg,#6E5CE9,#5B4BD6)}
.b2{background:linear-gradient(180deg,#059669,#047857)}
.b3{background:linear-gradient(180deg,#9C9CA4,#84848C)}
.li{display:grid;grid-template-columns:13px 1fr;gap:8px;font-size:.8rem;line-height:1.45;
  color:var(--ink-2);font-weight:350;margin-top:6px}
.li>i{font-style:normal;font-family:'Geist Mono',monospace;font-size:11px;font-weight:500}
.yes>i{color:var(--emerald)} .no>i{color:var(--rose)} .warn>i{color:var(--amber)}
pre{font-family:'Geist Mono',monospace;font-size:.775rem;line-height:1.8;padding:15px;
  border-radius:.75rem;background:#FAFAF9;border:1px solid var(--hair);overflow-x:auto;margin-top:11px;
  box-shadow:inset 0 1px 3px rgba(15,15,20,.035)}
.foot{margin-top:auto;padding-top:11px;border-top:1px solid var(--hair);
  font-family:'Geist Mono',monospace;font-size:10px;color:var(--ink-3);line-height:1.5}
footer{margin-top:34px;padding-top:22px;border-top:1px solid var(--hair);text-align:center}
</style></head><body>
<div class="mesh"><div class="orb orb-a"></div><div class="orb orb-b"></div></div>
<div class="wrap">
  <span class="eyebrow">EYEBROW</span>
  <h1>HEADLINE</h1>
  <p class="lede">LEDE</p>
  <div class="grid">
    <!-- body -->
  </div>
  <footer><p class="tiny">Generated DATE · figures detected on this machine, nothing invented</p></footer>
</div></body></html>
```

## 3. Components

Copy these into the `.grid`. Every card is `shell` wrapping `core`, never a bare box.

**Card**
```html
<div class="c4"><div class="shell"><div class="core">
  <h2>Title</h2><p class="sub" style="margin-top:8px">Body.</p>
</div></div></div>
```

**Recommended card** — add `ok` to the shell: `<div class="shell ok">`

**Number tile**
```html
<div class="c3"><div class="shell"><div class="core">
  <div class="kpi grad">24 GB</div><div class="kpi-l">Usable budget</div>
  <p class="tiny" style="margin-top:12px">Note.</p>
</div></div></div>
```

**Two-column table** (tiers, specs, anything keyed)
```html
<div class="row head"><b>Memory you have</b><span>What to run in it</span></div>
<div class="row hot"><b>24 GB</b><span>Qwen3.6 27B at Q6.</span></div>
```
Always label both columns with a `row head`. Add `hot` to the row that applies to this user.

**Memory split bar** — widths must be the real proportions
```html
<div class="bar"><span class="b1" style="flex:0 0 64%">The model</span>
<span class="b2" style="flex:0 0 22%">Your chat</span><span class="b3" style="flex:1">App</span></div>
```

**Checklist**
```html
<div class="li yes"><i>✓</i><span>Ollama running on :11434</span></div>
<div class="li no"><i>✕</i><span>No models pulled yet</span></div>
<div class="li warn"><i>!</i><span>LM Studio server is off</span></div>
```

**Command block** — use `<pre>` for anything the user may need to re-run.

**Card footer** — `<div class="foot">macOS · M4 Max · 64 GB</div>` pinned to the bottom of a card.

## 4. Per-skill layouts

**scan-my-machine** — `scan-YYYY-MM-DD.html`
1. Three number tiles: total memory, usable budget, free disk.
2. `c8` card: the tier table with the user's row marked `hot`. `c4` card: the memory split bar plus its legend.
3. `c6` recommended card (`ok`): the primary model pick, its chips, and a `<pre>` with the exact pull command. `c6` card: alternates.
4. `c12` card: what is already installed, as a checklist.
5. `c12` card: the ceiling, one line on what this machine cannot run.

**pick-my-harness** — `harness-YYYY-MM-DD.html`
1. `c8` recommended card (`ok`): the tool, why it won, its three capability chips, and the install command. `c4` card: what it cannot do.
2. `c12` card: the four answers given, so the reasoning is auditable.
3. `c12` card: the other four tools as a `row` table with their capability chips, so the choice is visible in context.

**install-openwebui** and **local-ai-setup** — `setup-YYYY-MM-DD.html`
1. `c12` recommended card (`ok`): the URL, big, plus the real prompt sent and the real reply received.
2. `c4` × 3: how to restart it, what is installed, what it cannot do.
3. `c12` card: the pre-empted confusions from `handover.md`, as a checklist.
4. **local-ai-setup only, when step 6b ran and the CLI test passed.** `c12` card titled "Use it from Claude Code". The chat window is what this page is about, so this card sits below the confusions, not at the top.

   The full launch block in a `<pre>`, every value real, so it pastes and runs with nothing to look up. Copy the variable set from `claude-code-wiring.md` section 4 verbatim, with the model ID exactly as `ollama list` prints it including the tag after the colon. Under the `<pre>`, four `li` lines: the two `OLLAMA_` variables the server must be running with and that the server has to be restarted to pick them up; it must be `ANTHROPIC_AUTH_TOKEN` and not `ANTHROPIC_API_KEY`, with any non empty value; every alias points at the one installed model; and unlike a rented pod nothing here expires, so the block keeps working as long as Ollama is running.

   Then the real `claude -p` prompt and the real reply underneath, as sent and as received. If the reply carried stray system prompt text, print that too rather than tidying it: it is the honest picture of a small model driving an agent. A `sub` line offers the `~/.claude/settings.json` `env` form from section 5, carrying its warning that this makes the local model the default for every project on the machine.

   Close the card with a `tiny` line naming the way back to the hosted model, from section 7. A user who cannot find that concludes Claude Code is broken.

   Never print this card on the strength of the endpoint returning 200. Ollama answers 200 while feeding the model a truncated prompt, and the session then invents tool results with exit code 0. The card goes on the page only after `claude -p` returned the sentinel and the server log carried no `truncating input prompt` line.

**allow-team** — `share-YYYY-MM-DD.html`
1. `c12` recommended card (`ok`): the public URL in `kpi grad` at full width, and the two verification codes as a `row` table labelled sign in page and api without a session, with the required value beside each.
2. `c4` × 3: how to stop sharing, with the exact command in a `<pre>`. Who can reach it, named. What the free plan does not give, meaning the URL changes on restart.
3. `c12` card: the safety gate result as a checklist, one line per field checked, so the decision to expose is auditable later.
4. `c12` card: what to tell the teammate. They sign in with an Open WebUI account the user creates for them. The ngrok warning page on first visit is expected. The link dies when the machine sleeps.

This report is a live door key, even without a password in it. End it with a `c12` card saying the tunnel is for a session and not a deployment, carrying the stop command again.

**rented-server-setup** — `rented-YYYY-MM-DD.html`
1. `c12` recommended card (`ok`): the Open WebUI chat URL in `kpi grad` at full width, then the real prompt sent and the real reply received underneath it.
2. `c4` × 3: the model with its index score and licence as chips. The GPU, count and region. The cost, as hourly in `kpi` with the monthly projection as `kpi-l`.
3. `c12` card: first login, as a numbered checklist. The first account to register becomes admin, so they must create theirs before sharing the URL. Signup is already off.
4. `c12` card (`ok` border removed): teardown, with the exact commands in a `<pre>`, one per resource, labelled with what data dies with each.
5. `c12` card: the cost and residency gate result as a `row` table, one line per check, so the decision to spend is auditable later.
6. **Privacy path only** — `c12` card: the ten-row data flow table from `trust-boundary.md` section 4, with the real region in every cell and row 9 left as "unconfirmed" unless RunPod has answered in writing. Then a `c12` card carrying the reviewer paragraph from section 6, in a `<pre>` so it can be copied verbatim into the customer's own documentation.
7. `c12` card: what this setup will not do. The chat URL changes if the pod is ever recreated, and the interface goes down with the pod.

Never put the API key on this page, including truncated. If the key has been exposed anywhere, the page should say to rotate it instead.

This report is a running meter. End it with a `c12` card carrying the teardown command again, and the plain line that nothing here turns itself off.

## 5. Save and open

```bash
open ~/Desktop/scan-2026-08-04.html          # macOS
xdg-open ~/Desktop/scan-2026-08-04.html      # Linux
start ~/Desktop/scan-2026-08-04.html         # Windows
```

Then in chat: one line saying what was found, one line with the file path. Nothing else.
