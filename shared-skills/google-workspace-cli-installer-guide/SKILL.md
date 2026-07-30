---
name: google-workspace-cli-installer-guide
description: Interactive step-by-step installer for the Google Workspace CLI (gws) on macOS, Linux, WSL, OR native Windows (Git Bash / MINGW64). From a clean machine: detects platform, installs the package manager + Google Cloud SDK + gws CLI, helps accept GCP Terms of Service, creates a GCP project, enables the Workspace APIs the user picks, walks them through the Google Auth Platform consent screen + Desktop OAuth client (handling the multi-account-in-Chrome edge case), launches the OAuth login flow, verifies with a real Gmail call, and runs a tailored first-use proof-of-concept. Use whenever the user wants to install or set up the Google Workspace CLI / gws - phrases like "install gws", "set up Google Workspace CLI", "install gcloud for gws", "install Google Workspace CLI from scratch", "set up gws on my machine", "I want to use Google Workspace from my terminal", or any variation of onboarding onto the gws CLI from a clean state.
---

# Google Workspace CLI Installer Guide

You are guiding a user through a first-time install of the Google Workspace CLI (`gws`) on a clean machine. This is a real interactive setup with real shell calls. **Don't rush. Verify every step before moving on. Be patient with the Cloud Console clicks - that's where most users fumble.**

Realistic time: **15-20 minutes if everything goes smoothly, 30-45 minutes for a first-time GCP user** (Terms of Service + manual OAuth client creation add the extra time). Tell the user this upfront.

**Always assume the user wants to install the CLI.** Don't pitch an MCP alternative or ask if they'd prefer one - just install.

---

## Pre-flight: detect platform and confirm shell access

Run all checks before doing anything. If a check fails, STOP and surface it - don't try to recover by skipping.

### Check 1: Bash is available

```bash
which echo
```

If this errors, the agent doesn't have shell access. Stop and ask the user to run from a real shell (Claude Code in terminal / IDE / desktop app).

### Check 2: Detect platform

```bash
uname -s
```

Branch:
- `Darwin` → **macOS**
- `Linux` → check `/proc/version` for "microsoft" → if found, **WSL**; else **Linux**
- `MINGW*` / `MSYS*` / `CYGWIN*` → **Windows** (Git Bash / MINGW64)
- anything else → stop and ask user

Save the platform - every subsequent step branches on it.

### Check 3: Write access to ~/.config/

```bash
mkdir -p ~/.config && touch ~/.config/.test && rm ~/.config/.test
```

If this fails, surface the error.

(Removed in this version: the old "do you actually want to do this - or use MCP?" pre-flight. Always proceed with the install.)

---

## Step 1: Package manager

Branch by platform.

### macOS

```bash
which brew
```

If missing, install Homebrew:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After install, follow the printed instructions to add brew to `$PATH`. Apple Silicon:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

Intel Macs use `/usr/local/bin/brew` instead.

### Linux / WSL

Use the system package manager (`apt`, `dnf`, etc.). Skip Homebrew - it's uncommon on Linux.

### Windows (native, Git Bash / MINGW64)

```powershell
winget --version
```

Should be v1.0+. If missing, the user installs **App Installer** from Microsoft Store. Otherwise, no setup needed.

---

## Step 2: Install Google Cloud SDK (`gcloud`)

```bash
which gcloud
```

If missing, branch by platform.

### macOS

```bash
brew install --cask google-cloud-sdk
```

### Linux / WSL

```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

Or use the distro-native packages from the official Cloud SDK install instructions.

### Windows

From PowerShell:

```powershell
winget install --id Google.CloudSDK --silent --accept-source-agreements --accept-package-agreements --disable-interactivity
```

This is a large install (~500 MB). Be patient.

### Verify

```bash
gcloud --version
```

Should print `Google Cloud SDK <version>` plus components.

### Windows-specific gotchas (read these - they bite every install)

**Gotcha 1: PATH doesn't refresh in the current shell.** After `winget install`, an existing Git Bash / PowerShell session still won't see `gcloud`. Either restart the shell, or add the path manually for the session:

```bash
export PATH="/c/Users/<you>/AppData/Local/Google/Cloud SDK/google-cloud-sdk/bin:$PATH"
```

**Gotcha 2: "Python was not found" error.** If `gcloud --version` errors with *"Python was not found; run without arguments to install from the Microsoft Store, or disable this shortcut from Settings > Apps > Advanced app settings > App execution aliases"*, the Microsoft Store python.exe alias is intercepting gcloud's Python call. The Cloud SDK ships with its own bundled Python - point gcloud at it:

```bash
export CLOUDSDK_PYTHON="/c/Users/<you>/AppData/Local/Google/Cloud SDK/google-cloud-sdk/platform/bundledpython/python.exe"
```

For a permanent fix, the user can either disable the python.exe execution alias in **Settings → Apps → Advanced app settings → App execution aliases**, or set `CLOUDSDK_PYTHON` permanently via `setx`.

**Tip for the agent:** persist these env vars to a file (e.g. `/tmp/gws-session-path.sh`) and `source` it at the start of every Bash call, since each Bash tool call starts a fresh shell.

---

## Step 3: Install Google Workspace CLI (`gws`)

The **npm path works on every platform** - use it universally.

```bash
which gws || npm install -g @googleworkspace/cli
```

Verify:

```bash
gws --version
```

Should print `gws 0.X.X` and `This is not an officially supported Google product.`

(macOS users *can* try `brew install googleworkspace-cli` if available in their tap - but `npm install -g @googleworkspace/cli` is the simpler universal path and also bundles native binaries.)

---

## Step 4: Pick which APIs to enable

Don't skip this conversation. Ask the user explicitly which Google Workspace services they actually plan to use.

> "Which Google Workspace services do you want to use? Pick whatever's relevant - you can add more later by re-running auth login."
>
> Common starter set (most people pick all of these):
> - **Gmail** - read, compose, send, draft
> - **Google Drive** - list, read, upload, share
> - **Google Sheets** - create, read, update, format
> - **Google Docs** - create, read, update
> - **Google Calendar** - list events, create events, manage attendees
>
> Power-user additions:
> - **Google Tasks** - to-do list management
> - **Google Chat** - send to spaces, list messages
> - **Google Slides** - create and update presentations
> - **Google Forms** - create and read forms
> - **Apps Script** - programmatic Apps Script management
> - **Admin SDK** - workspace user/group management (Workspace admins only)

Save the user's selection - you'll reference it again when enabling APIs (Step 6b).

**Important nuance to flag honestly up front:** *Enabling* an API on the GCP project (Step 6b) is separate from *requesting an OAuth scope* for it (Step 7). The default `gws auth login` scope set in v0.22.5 includes Drive, Sheets, Gmail, Calendar, Docs, Slides, and Tasks - **but not** Forms, Chat, Apps Script, or Admin SDK. If the user wants those, you'll need to dig into custom scope flags at auth time (`gws auth login --help`). Tell them this now so they aren't surprised later.

---

## Step 5: Authenticate gcloud + accept GCP Terms of Service

### 5a. `gcloud auth login`

```bash
gcloud auth login
```

Browser opens. The user signs in with the Google account `gws` should act as (typically their primary Google account). Verify:

```bash
gcloud auth list
```

Should show their account marked `*` as active.

### 5b. Accept GCP Terms of Service (first-time GCP users only)

Brand-new GCP users haven't accepted the Terms of Service. This blocks project creation in Step 6a with:

```
ERROR: (gcloud.projects.create) Operation [...] failed: 9: Callers must accept Terms of Service
```

**TOS cannot be accepted via the CLI.** The user must do it once via the web console. Open the cloud console for them:

| Platform | Command |
|---|---|
| macOS | `open https://console.cloud.google.com/` |
| Linux | `xdg-open https://console.cloud.google.com/` |
| WSL | `cmd.exe /c start https://console.cloud.google.com/` |
| Windows (PowerShell) | `Start-Process "https://console.cloud.google.com/"` |

Tell the user:
1. Sign in with the Google account from 5a (use the avatar to switch if Chrome defaults to a different account)
2. Accept the Terms of Service prompt (country dropdown + checkbox)
3. Close the tab - done

Wait for them to confirm before continuing.

---

## Step 6: Create GCP project, enable APIs, and configure OAuth

This is the meaty manual step. Take your time. **This is where most installs fumble on first try - give exact instructions, not vague pointers.**

### 6a. Create the GCP project

```bash
PROJECT_ID="gws-cli-$(date +%s | tail -c 9)"
gcloud projects create "$PROJECT_ID" --name "My gws CLI"
gcloud config set project "$PROJECT_ID"
echo "$PROJECT_ID" > /tmp/gws-project-id.txt   # persist for later steps
```

Project ID rules: 6-30 chars, lowercase letters / digits / hyphens, must start with a letter, must end with letter or digit, globally unique. The pattern above generates a unique ID using a Unix timestamp suffix.

If creation fails with `Callers must accept Terms of Service`, the user hasn't completed Step 5b - go back and finish it.

### 6b. Enable the Workspace APIs (skip the UI - use gcloud)

The original skill recommended enabling APIs via Cloud Console UI. Don't. `gcloud services enable` is faster, scriptable, and lets you enable everything in a single call:

```bash
gcloud services enable \
  gmail.googleapis.com \
  drive.googleapis.com \
  sheets.googleapis.com \
  docs.googleapis.com \
  calendar-json.googleapis.com \
  slides.googleapis.com \
  forms.googleapis.com \
  --project "$PROJECT_ID"
```

Adjust the list based on Step 4 selections. Service identifier reference:

| Service | API identifier |
|---|---|
| Gmail | `gmail.googleapis.com` |
| Drive | `drive.googleapis.com` |
| Sheets | `sheets.googleapis.com` |
| Docs | `docs.googleapis.com` |
| Calendar | `calendar-json.googleapis.com` |
| Slides | `slides.googleapis.com` |
| Forms | `forms.googleapis.com` |
| Tasks | `tasks.googleapis.com` |
| Chat | `chat.googleapis.com` |
| Apps Script | `script.googleapis.com` |
| Admin SDK | `admin.googleapis.com` |

### 6c. Try `gws auth setup` (it WILL bail in v0.22.5 - that's expected)

```bash
gws auth setup --project "$PROJECT_ID"
```

In v0.22.5 this fails with:

```
OAuth client creation requires manual setup in the Google Cloud Console.
```

That's the expected fork. The error message even gives you the right URLs. Proceed to 6d.

### 6d. Open the Google Auth Platform overview

Launch this URL in the user's browser (replace `<PROJECT_ID>` and `<email>`):

```
https://console.cloud.google.com/auth/overview?project=<PROJECT_ID>&authuser=<email>
```

Use the platform-appropriate command:

| Platform | Command |
|---|---|
| macOS | `open "<url>"` |
| Linux | `xdg-open "<url>"` |
| WSL | `cmd.exe /c start "" "<url>"` |
| Windows (PowerShell) | `Start-Process "<url>"` |

**Always include `&authuser=<their-email>`.** This avoids the multi-account-in-Chrome trap - see below.

### Multi-account-in-Chrome troubleshooting (very common)

Symptoms the URL loaded under the wrong Google account:
- Page title says **"You need additional access to the project"** with a list of "Missing or blocked permissions" (`clientauthconfig.clients.list`, `oauthconfig.verification.get`, `resourcemanager.projects.get`, `serviceusage.quotas.get`)
- Project picker (top-left) shows "Select a project" instead of the project name
- The avatar in the top-right is a different person

Two fixes:
1. Re-open the URL with the correct `&authuser=<the-target-email>`
2. Or, click the profile avatar (top-right) → switch to / add the right Google account

What the user **should** see when correctly logged in:
- Page title: **OAuth overview** under the **Google Auth Platform** sidebar
- Center message: **"Google auth platform not configured yet"** with a **Get started** button
- Project picker shows the project name (e.g. "My gws CLI")

### 6e. The "Get started" wizard (the new Google Auth Platform UI)

Click **Get started**. Google replaced the old "OAuth consent screen" page with a 4-step wizard in 2024-2025. Walk the user through each step exactly:

**Step 1 of 4 - App information**
- App name: `My gws CLI` (or whatever the user prefers - purely cosmetic)
- User support email: pick the user's Gmail from the dropdown
- → **Next**

**Step 2 of 4 - Audience**
- Choose **External**
- → **Next**

**Step 3 of 4 - Contact information**
- Email addresses: the user's Gmail
- → **Next**

**Step 4 of 4 - Finish**
- Tick **"I agree to the Google API Services User Data Policy"**
- → **Continue** / **Create**

The wizard exits to the Google Auth Platform left-nav view (Branding, Audience, Clients, Data access, Verification centre, Settings).

### 6f. Add the user as a test user

The OAuth app starts in "Testing" mode. Without a test user listed, the user will hit `Error 403: access_denied` at OAuth time.

1. Click **Audience** in the left nav
2. Scroll to the **Test users** section
3. Click **+ Add users**
4. Enter the user's Gmail address
5. **Save**

### 6g. Create the Desktop OAuth client

1. Click **Clients** in the left nav
2. Click **+ Create client**
3. Application type: **Desktop app**
4. Name: `gws CLI`
5. **Create**
6. A dialog appears with Client ID + Client Secret. Click the **download icon (⬇)** to download `client_secret_*.json`

Tell the user to leave the JSON in their default Downloads folder - the agent will move it.

### 6h. Move the JSON into place

```bash
mkdir -p ~/.config/gws
NEWEST=$(ls -t ~/Downloads/client_secret_*.json 2>/dev/null | head -1)
mv "$NEWEST" ~/.config/gws/client_secret.json
ls -la ~/.config/gws/client_secret.json
```

On Windows that's `C:\Users\<user>\.config\gws\client_secret.json`.

---

## Step 7: Run `gws auth login`

```bash
gws auth login
```

### 7a. If the browser auto-opens

Walk the user through:

1. Sign in with the Google account from Step 5a
2. **"Google hasn't verified this app"** - click **Advanced** → **"Go to My gws CLI (unsafe)"**. (It's their own OAuth client - safe.)
3. Approve the requested scopes → **Continue**
4. Page redirects to `localhost:XXXXX` and shows **"you can close this tab"** - done

### 7b. If the browser does NOT auto-open (common on Windows)

`gws` prints:

```
Open this URL in your browser to authenticate:

  https://accounts.google.com/o/oauth2/auth?...
```

…then blocks waiting for the localhost callback. **Don't kill the process.** Launch the URL via the platform-appropriate command:

| Platform | Command |
|---|---|
| macOS | `open "<url>"` |
| Linux | `xdg-open "<url>"` |
| WSL | `cmd.exe /c start "" "<url>"` |
| Windows (PowerShell) | `Start-Process "<url>"` |

(Tip: on Windows from PowerShell, paste the URL into a `$url = '...'` assignment using single quotes, then `Start-Process $url` - that handles the URL's special characters cleanly.)

### 7c. Verify the listener is alive (if user is slow)

If the user takes a while in the browser and you're worried `gws` died, check the localhost port. The redirect URL in 7b's output looks like `redirect_uri=http://localhost:<port>` - grab that port and:

```bash
netstat -an | grep -i LISTENING | grep ":<port>"
```

If it's gone, `gws auth login` is dead - re-run it.

### 7d. Don't pass `--scopes` shorthand

Don't run `gws auth login --scopes gmail,drive,sheets`. The CLI sends those literal strings to Google, which rejects them. Use the default scope set (no `--scopes` flag) or check `gws auth login --help` for the correct override syntax.

### 7e. On success

The auth output prints:

```json
{
  "account": "<email>",
  "credentials_file": "...config/gws/credentials.enc",
  "encryption": "AES-256-GCM (key in OS keyring or local .encryption_key)",
  "message": "Authentication successful. Encrypted credentials saved.",
  "scopes": [...],
  "status": "success"
}
```

Credentials live encrypted at `~/.config/gws/credentials.enc`, with the key in the OS keyring (macOS Keychain, Windows Credential Manager, libsecret on Linux).

---

## Step 8: Verify the install

```bash
gws gmail users getProfile --params '{"userId":"me"}'
```

Should return JSON with the user's email, history ID, message count, and thread count. If it does, you're done with install - move to the demo.

### Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| `401 Token expired or revoked` | OAuth token didn't store, or expired | Re-run `gws auth login` |
| `403 accessNotConfigured` | API not enabled on the GCP project | `gcloud services enable <api>.googleapis.com --project <PROJECT_ID>` |
| `403 access_denied` at OAuth | User isn't on the OAuth Test users list | Step 6f - add them |
| `command not found: gws` | npm global path not on `$PATH` | Restart shell. Verify with `npm config get prefix` and ensure that path's bin dir is on PATH |
| Browser refused to open | Headless / restricted env | Copy the URL printed by the CLI, open in any browser manually |

---

## Step 9: Tailored first-use demo (most important step)

Don't run a generic test command. **Look at what the user actually does** and build a one-shot proof-of-concept around their real workflow. This is what makes the install worth their time.

### Probe their workflow

```bash
gws gmail +triage --max 5         # recent unread inbox
gws calendar +agenda --week        # upcoming calendar
gws drive files list --params '{"pageSize": 10, "orderBy": "modifiedTime desc", "fields": "files(id,name,mimeType,modifiedTime)"}'
```

Look at what came back. Patterns to notice:

- **Heavy meeting-prep traffic in calendar** → meeting-prep automation
- **Lots of client onboarding emails** → templated send
- **Recently-edited spreadsheets** → sheet-update workflow
- **Newsletter-style scheduled sends** → digest pattern
- **Newsletter / promo-heavy unread mail dominant** → inbox sender heat-map
- **Sparse calendar + active Drive** → Drive inventory or Sheet template
- **No clear pattern** → ask what they want directly

### Ask what they want to demo

> "Based on what I'm seeing in your workspace, here are a few proof-of-concept workflows that would be high-leverage for you:
>
> 1. [tailored option A - based on what you saw]
> 2. [tailored option B]
> 3. [tailored option C]
>
> Or, if none fit, what's a recurring Google Workspace task you'd most want to automate?"

### Build a real PoC

Whatever they pick, **actually build it end-to-end and let them see the artifact in their account.** Don't print example commands and stop - execute them and produce a real artifact (URL, inbox notification, calendar event).

Common PoC patterns:

**A. Weekly digest emailed to self.** `gmail +triage` + `calendar +agenda` → format → send via `gws gmail +send` or raw API.

**B. New Sheet populated from a spec the user describes.** `gws sheets spreadsheets create` → `spreadsheets values update` (with `valueInputOption: USER_ENTERED` so formulas evaluate) → `spreadsheets batchUpdate` for header formatting, conditional formatting, frozen rows, currency / percent formats. End with the URL.

**C. Calendar event batch.** Loop a list, run `gws calendar +insert` per event. Show events appearing in their calendar.

**D. Doc template populated.** `gws docs documents create` → `documents batchUpdate` to populate with TITLE / HEADING / NORMAL_TEXT styles. Send the link.

**E. Bulk personalized email send.** CSV → loop → `gws gmail +send` (or raw API for HTML).

**F. Spreadsheet template** (e.g. monthly budget, expense tracker, habit tracker). Same flow as B: create blank → values.update with categories + SUM/IFERROR/percentage formulas → batchUpdate for currency formatting + conditional color rules + frozen rows + section headers + column widths. End with URL.

After the PoC runs, show the user the artifact (URL, inbox notification, calendar event). **Open the URL in their browser via `open` / `xdg-open` / `Start-Process`** - don't just print it.

---

## Step 10: Hand-off

Tell the user clearly:

### 1. Token expiry
The OAuth user-grant expires every few weeks. When commands fail with `401 Token expired or revoked`, run `gws auth login` again. 30 seconds. **No need to redo any GCP setup.**

### 2. Adding APIs / scopes later
- Enable the new API on the project: `gcloud services enable <api>.googleapis.com --project <PROJECT_ID>`
- Re-run `gws auth login` to re-grant scopes that include the new API

For Forms / Chat / Apps Script / Admin SDK - these aren't in the default `gws auth login` scope set. Check `gws auth login --help` for scope override flags.

### 3. Putting workflows on a schedule

The killer use case for the CLI is unattended automation. Branch by platform:

**macOS / Linux / WSL - cron:**
```bash
# crontab -e, then:
0 8 * * 1 /full/path/to/script.sh > /tmp/gws-monday.log 2>&1
```

**Windows - Task Scheduler:**
- Save your `gws ...` commands in a `.bat` or `.ps1` file
- Open **Task Scheduler** → **Create Basic Task** → set trigger (e.g. "Weekly, Monday, 8 AM") → set action to run your script
- The encrypted credential is in Windows Credential Manager, so scheduled tasks running as the same user pick it up automatically

The CLI uses tokens stored in the OS keyring, so scheduled jobs run with the user's credentials with zero extra setup.

### 4. Help & docs

- `gws --help`, `gws gmail --help`, `gws sheets --help`, etc. for command reference
- `gws schema <service.resource.method>` (e.g. `gws schema sheets.spreadsheets.batchUpdate`) to inspect any Google API method's schema
- `gws auth --help` to list auth subcommands

**Note:** older skill versions reference `gws auth check` and `gws doctor` - those don't exist in v0.22.5. Use `gws auth --help` to see what's actually available.

### 5. Persistent state on disk
- Project ID: `<PROJECT_ID>` (also stored in `gcloud config get project`)
- OAuth client secret: `~/.config/gws/client_secret.json`
- Encrypted credentials: `~/.config/gws/credentials.enc` (key in OS keyring)
- npm global path for `gws`: `npm config get prefix`/bin

---

## Common gotchas (cheat sheet - refer to this often)

| Symptom | Fix |
|---|---|
| `command not found: gws` after install | Restart shell. Check `npm config get prefix` and ensure that path's bin dir is on PATH. |
| OAuth: "Access blocked: app not verified" | Click **Advanced** → "Go to [project] (unsafe)". User's own OAuth client - safe. |
| `Some requested scopes were invalid` on auth login | Don't pass `--scopes` shorthand. Run plain `gws auth login`. |
| `403 accessNotConfigured` | Specific API not enabled on the project. `gcloud services enable <api>.googleapis.com`. |
| `401 Token expired or revoked` | `gws auth login`. 30 seconds. |
| `403 access_denied` at OAuth | User isn't on the OAuth test users list. Step 6f. |
| Browser doesn't open | Copy the printed URL, launch via `open` / `xdg-open` / `Start-Process`. Or check the `redirect_uri=http://localhost:<port>` listener is still alive. |
| Wrong Google account got authed | `gws auth logout`, then `gws auth login` and pick the correct account. |
| Multiple Google accounts | Use `--profile` for separate accounts: `gws auth login --profile work`, then `gws -p work gmail +triage`. |
| Cloud Console shows "**You need additional access**" page | Multi-account-in-Chrome bug. Append `&authuser=<email>` to the URL, or switch accounts via the avatar menu. |
| `Callers must accept Terms of Service` | First-time GCP user. Visit console.cloud.google.com once, accept TOS, retry. |
| `gws auth setup` fails on OAuth client creation | Expected in v0.22.5. Walk through 6d-6h manually. |
| `gws auth setup` fails with "No GCP project configured" | Create project first via `gcloud projects create`, then `gcloud config set project`. |
| **(Windows)** `gcloud` command not found after winget install | Restart shell, or `export PATH="<install>/google-cloud-sdk/bin:$PATH"` for the session. |
| **(Windows)** `gcloud` errors *"Python was not found"* | Microsoft Store python.exe alias intercepts. Set `CLOUDSDK_PYTHON` to the bundled Python at `<install>/google-cloud-sdk/platform/bundledpython/python.exe`. |
| **(Windows)** `start` doesn't work in Git Bash | Use `cmd //c start "<url>"` from Git Bash or `Start-Process "<url>"` from PowerShell. |

---

## Hard rules - don't deviate

- **Always assume the user wants to install the CLI.** Don't pitch MCP - just install. (MCP is fine but not relevant in this skill.)
- **Detect platform once at the start, branch all commands.** macOS, Linux, WSL, and Windows have different package managers, browser-launch commands, scheduling tools, and PATH refresh behaviors. Hard-coding bash-on-mac assumptions breaks every Windows install.
- **Always launch URLs in the user's browser** for them via the platform-appropriate command (`open` / `xdg-open` / `Start-Process` / `cmd.exe /c start`). Don't print URLs and expect copy-paste - that's friction.
- **Walk the user click-by-click through the Cloud Console UI.** Section 6d-6h is non-negotiable. Vague instructions ("set up the OAuth consent screen") fail. Every click, every field name, every dropdown choice. Use exact label text from the actual Google Auth Platform wizard, not paraphrases.
- **Never skip the verification step after each install.** Silent partial installs are the #1 user pain point.
- **Don't run destructive commands during install / demo.** No `delete`, no `drop`, no overwrite without explicit consent.
- **Don't rush the OAuth flow.** Wait for the user to complete each browser step before running the next CLI command.
- **The first-use demo MUST be tailored.** Generic "send a test email" is forgettable. A real working PoC against the user's actual workflow is what makes the install worth their time.
- **If the OAuth flow takes long, verify the localhost listener** before assuming the user fumbled. The `gws` process is still alive on a localhost port - `netstat -an | grep LISTENING | grep :<port>` confirms.
- **Use a session env-vars file** (e.g. `/tmp/gws-session-path.sh`) and `source` it at the top of every shell call. Bash tool calls don't share state across invocations, so PATH and `CLOUDSDK_PYTHON` exports don't persist without this.
- **Use `&authuser=<email>` in every Cloud Console URL** you launch for the user. Multi-account-in-Chrome failures look mysterious and waste 10 minutes if you don't.
