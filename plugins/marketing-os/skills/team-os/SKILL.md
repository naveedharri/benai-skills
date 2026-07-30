---
name: team-os
description: Install the BenAI Relay fork in an Obsidian vault as the foundation for a shared Team OS — replaces the official Relay (`system3-relay`) plugin with the BenAI fork (`benai-relay-fork`) which ships custom RBAC + access controls for team-wide vault sharing. Bundled production build ships inside the skill — user just points to their Obsidian vault path. Use when the user wants to "set up team os", "install BenAI Relay", "swap relay for the fork", "replace the official relay plugin", or "use BenAI's relay in my vault".
---

# Relay Swap — Install BenAI Relay Fork

This skill replaces the upstream Relay plugin (`system3-relay`) with the BenAI fork (`benai-relay-fork`) in a target Obsidian vault. The compiled fork ships at `${CLAUDE_PLUGIN_ROOT}/skills/team-os/reference/benai-relay-fork/` (three files: `main.js`, `manifest.json`, `styles.css`). Copy from there — do not fetch from anywhere else.

## What the user provides

**Just their Obsidian vault folder** — the one they open inside Obsidian itself. The skill will auto-detect it if they invoke `/team-os` from inside the vault, otherwise it'll walk them through finding it via Obsidian's Settings → About → "Show vault folder".

Example paths the user might give: `~/Documents/MyVault`, `/Users/jane/Obsidian/Work`, or a folder dragged from Finder/Explorer. The skill normalizes all of them.

---

# Workflow

## Step 0 — Confirm intent + locate the vault folder

Tell the user what this will do, in plain language:

> I'm about to replace the official Relay plugin with the BenAI fork in your Obsidian vault. The fork has custom RBAC + access controls. This will:
> 1. Delete the old `system3-relay` plugin if it's there.
> 2. Install the bundled BenAI Relay build.
> 3. Update Obsidian's community-plugins config to switch over.
>
> **Close Obsidian first** — modifying plugin files while it's running can corrupt the install.

### Get the vault folder (no jargon)

Don't ask for an "absolute path". Most users don't think in those terms. Try this order:

**1. Try the current working directory first.**

If the cwd contains a `.obsidian/` folder, ask:

> I see this folder (`{cwd}`) is already an Obsidian vault. Is this the one you want to install BenAI Relay into? (yes / no — I'll ask where it is)

If yes, set `VAULT="$(pwd)"` and skip to Step 1.

**2. Otherwise, ask in plain language with platform-specific hints.**

`AskUserQuestion` framed like:

> Where is your Obsidian vault — the folder you open inside Obsidian itself?
>
> Easiest way to find it:
> - **Open Obsidian** → Settings → "About" → click **"Show vault folder"** (or right-click your vault name in the vault switcher → "Reveal in Finder/Explorer"). Drag that folder into this chat, or copy its path.
> - On **macOS** it usually looks like `/Users/yourname/Documents/MyVault` or `~/Obsidian/MyVault`.
> - On **Windows** it usually looks like `C:\Users\yourname\Documents\MyVault`.
> - The folder you want is the one with a hidden `.obsidian` subfolder inside it (not the Documents folder above it).

Accept any of:
- A pasted path (with or without quotes, `~` expansion, trailing slash).
- A folder dragged-and-dropped (which the terminal usually expands to a path).
- "I don't know" → walk the user through the Obsidian UI step ("Settings → About → Show vault folder").

Normalize whatever they give you: strip surrounding quotes, expand `~`, drop trailing `/`. Save as `VAULT`.

Do not proceed until `VAULT` is set.

## Step 1 — Verify it's a valid Obsidian vault

```bash
VAULT="<paste>"
test -d "$VAULT/.obsidian" || echo "NOT_A_VAULT"
```

If `NOT_A_VAULT` prints, tell the user the path doesn't contain `.obsidian/` and ask them to re-check. Do not proceed.

## Step 2 — Snapshot current plugins

```bash
ls "$VAULT/.obsidian/plugins/" 2>/dev/null
cat "$VAULT/.obsidian/community-plugins.json" 2>/dev/null
```

Show the user what's there. If `community-plugins.json` doesn't exist, that's fine — Obsidian creates it on first community plugin install. We'll handle both cases.

Confirm with the user before proceeding:
- If `system3-relay` is present, we'll remove it.
- If `benai-relay-fork` already exists, we'll overwrite it (warn and ask).

## Step 3 — Confirm Obsidian is closed

```bash
pgrep -x Obsidian && echo "OBSIDIAN_RUNNING"
```

If `OBSIDIAN_RUNNING`, stop and tell the user to quit Obsidian (Cmd+Q on macOS), then re-run. Do not proceed while it's running.

## Step 4 — Remove the official plugin (if present)

```bash
if [ -d "$VAULT/.obsidian/plugins/system3-relay" ]; then
  rm -rf "$VAULT/.obsidian/plugins/system3-relay"
  echo "Removed system3-relay"
fi
```

This is destructive — that's why Step 0 told the user upfront. If the user has unsaved local changes inside that plugin's folder (rare; usually it's just compiled build artifacts), they should back it up first.

## Step 5 — Install the fork from the skill bundle

```bash
SRC="${CLAUDE_PLUGIN_ROOT}/skills/team-os/reference/benai-relay-fork"
DST="$VAULT/.obsidian/plugins/benai-relay-fork"

mkdir -p "$DST"
cp "$SRC/main.js" "$SRC/manifest.json" "$SRC/styles.css" "$DST/"
ls -la "$DST"
```

You should see the three files (`main.js`, `manifest.json`, `styles.css`) at the destination.

## Step 6 — Update `community-plugins.json`

Obsidian uses this file to track which community plugins are enabled. We need to:
- Remove `system3-relay` from the enabled list.
- Add `benai-relay-fork` to the enabled list.

```bash
CFG="$VAULT/.obsidian/community-plugins.json"
if [ ! -f "$CFG" ]; then echo '[]' > "$CFG"; fi

python3 - <<PY
import json, pathlib
p = pathlib.Path("$CFG")
data = json.loads(p.read_text() or "[]")
data = [x for x in data if x != "system3-relay"]
if "benai-relay-fork" not in data:
    data.append("benai-relay-fork")
p.write_text(json.dumps(data, indent=2) + "\n")
print("community-plugins.json:", data)
PY
```

## Step 7 — Verify

```bash
test -f "$VAULT/.obsidian/plugins/benai-relay-fork/main.js" && echo "INSTALLED OK"
grep -q "benai-relay-fork" "$VAULT/.obsidian/community-plugins.json" && echo "ENABLED OK"
test ! -d "$VAULT/.obsidian/plugins/system3-relay" && echo "OFFICIAL REMOVED OK"
```

All three should print `OK`.

## Step 8 — Tell the user how to finish

> Done. Open Obsidian and load this vault. The BenAI Relay plugin should be active. If you don't see it:
> - Settings → Community plugins → confirm "BenAI Relay" is toggled on.
> - If Obsidian shows a "safe mode" banner, click "Trust author and enable" or disable safe mode in Settings → Community plugins.
> - Sign in with your Relay.md credentials when prompted.

---

# Troubleshooting

**`NOT_A_VAULT`** — the path is wrong, or it's pointing at a parent. The right folder is the one that has a hidden `.obsidian` folder inside it directly (e.g. `~/Documents/MyVault`, not `~/Documents`). Easiest way to find it: open Obsidian → Settings → About → "Show vault folder".

**Plugin doesn't appear in Obsidian.** Check `.obsidian/community-plugins.json` — it must contain `"benai-relay-fork"`. Restart Obsidian.

**Obsidian shows "Failed to load plugin".** The bundled `main.js` may be incompatible with the user's Obsidian version. Check `manifest.json`'s `minAppVersion` against Obsidian's "About" panel. The bundled fork requires Obsidian 0.15.0+.

**User wants to revert to upstream Relay.** Remove `<vault>/.obsidian/plugins/benai-relay-fork/`, edit `community-plugins.json` to remove `benai-relay-fork`, then install `system3-relay` from the Obsidian community plugins store normally.

**Want to update the bundled fork later.** The plugin is built into this skill — to update, the maintainer rebuilds `relay-fork`, copies the three artifacts into `shared-skills/team-os/reference/benai-relay-fork/`, runs `./sync-skills.sh && ./build-zips.sh`, and republishes.
