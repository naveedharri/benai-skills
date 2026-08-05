# Safety Gate

Run this after confirming a harness is up and before ngrok is touched. It decides whether this instance is safe to put on the public internet. It covers both browser harnesses: Open WebUI and Odysseus.

The rest of this plugin installs things on one machine, where a mistake is recoverable. This skill hands out a URL. A mistake here is other people, and it cannot be taken back once the link is forwarded.

There is no password in front of the tunnel. The harness's own login is the only lock, which is the right call for usability and means every check below is load bearing.

## Contents
1. The check
2. Reading the result
3. Refusals and how to clear them
4. What to say before opening the tunnel
5. Why this gate exists

## 1. The check

`$PORT` and `$HARNESS` come from the preflight in `tunnel-steps.md`.

**The universal check, and the one that decides.** Run it for both harnesses:

```bash
echo "api, no session: $(curl -s -o /dev/null -w '%{http_code}' --max-time 8 "http://localhost:$PORT/api/models")"
```

That must be `401`. A `200` means this instance serves data to anyone who asks, whatever any config field claims. Trust this number over everything below it.

**Then the harness-specific part.**

Open WebUI exposes its posture directly:

```bash
curl -s --max-time 8 "http://localhost:$PORT/api/config" | python3 -c "
import sys,json
d=json.load(sys.stdin); f=d.get('features',{})
print('version:      ', d.get('version','unknown'))
print('auth:         ', f.get('auth'))
print('signup:       ', f.get('enable_signup'))
print('trusted_hdr:  ', f.get('auth_trusted_header'))
print('onboarding:   ', d.get('onboarding'))
"
```

Odysseus keeps `/api/config` behind the login, so read it from the outside instead:

```bash
echo "version:  $(curl -s --max-time 8 "http://127.0.0.1:$PORT/api/version")"
echo "config:   $(curl -s -o /dev/null -w '%{http_code}' --max-time 8 "http://127.0.0.1:$PORT/api/config")   # want 401"
echo "register: $(curl -s -o /dev/null -w '%{http_code}' --max-time 8 "http://127.0.0.1:$PORT/register")     # want 302"
```

`/register` returning `302` means it bounces to the login, so `signup_enabled` is off, which is the default. A `200` there means the registration form is being served and anyone with the link can make an account: treat that exactly like Open WebUI's `signup: True` below.

Also check what the tunnel would sit next to:

```bash
# is the server bound to every interface, or just loopback?
lsof -nP -iTCP:$PORT -sTCP:LISTEN | tail -n +2
```

## 2. Reading the result

| Field | Harness | Safe value | What the unsafe value means |
|-------|---------|-----------|------------------------------|
| `api, no session` | both | `401` | `200` means no login is enforced. Nothing else matters. |
| `auth` | Open WebUI | `True` | `False` means it has no login at all. Anyone reaching the URL is admin. |
| `signup` | Open WebUI | `False` | `True` means anyone with the link creates their own account. |
| `onboarding` | Open WebUI | `None` or absent | `True` means no admin account exists yet and the first visitor becomes admin. |
| `trusted_hdr` | Open WebUI | `False` | `True` means it trusts a header for identity. Behind a public tunnel a visitor can send that header themselves. |
| `/register` | Odysseus | `302` | `200` means open registration. Same danger as `signup: True`. |
| `/api/config` | Odysseus | `401` | `200` means config is readable without a session. Investigate before exposing. |

Every row for the running harness has to read safe. The universal `401` on its own is not enough, and `auth: True` on its own is not enough either.

## 3. Refusals and how to clear them

### Refuse: the unauthenticated API call returns 200
Do not tunnel. Whatever the config says, this instance is handing out data without a login. Investigate before anything else, because it contradicts the config and one of the two is lying.

### Refuse: `auth` is False (Open WebUI)
Do not tunnel. This is the one case with no workaround worth offering, because there would be nothing whatsoever between a stranger and a fully open AI console with the user's chat history in it.

Say: "Open WebUI is running with its login turned off, so anything I expose would be open to whoever has the link. Turn authentication back on, create your account, and I will pick this up again."

Clearing it means restarting Open WebUI without `WEBUI_AUTH=False` and creating an admin account. That is a restart of their server, so ask before doing it.

### Refuse: the initial admin password is unchanged (Odysseus)
Odysseus prints an initial admin password on first run. If the user has not signed in and changed it, the login is real but the credential is in a log file and, for anyone who knows the project, guessable in shape.

Ask directly whether they have changed it. If they have not, have them do that first. It takes a minute and it is the difference between a login and a formality.

### Refuse: `onboarding` is True
No admin account exists. The first person to load the page claims the instance. Tell the user to open it locally and create their account first, which takes a minute. Then re-run the gate.

### Refuse: `trusted_hdr` is True
Header based identity is safe on a private network and unsafe on a public URL, because the visitor controls their own headers. Do not tunnel until it is off, and explain why in one sentence.

### Refuse by default: `signup` is True, or `/register` returns 200
Open signup plus a public URL means anyone holding the link registers themselves and is inside. With no second lock, the link is the only thing they need, so treat this as a refusal rather than a warning.

Offer the fix in the same breath: turn signup off, and the user creates the teammate's account themselves. On Open WebUI that is Settings, Admin Panel, Users. On Odysseus it is the admin account creating the user, with `signup_enabled` left off. That takes a minute and closes it properly.

Only proceed with signup left on if the user says so after hearing that, and record the choice in the report so it is visible later.

### Note, do not refuse: bound to `*`
If `lsof` shows `*:PORT` rather than `127.0.0.1:PORT`, the server was already reachable across the local network before any tunnel existed. Worth telling the user, since it is usually news to them. It does not block sharing.

## 4. What to say before opening the tunnel

Once the gate passes, the consent message names what actually becomes reachable. Do not soften it and do not bury it under the URL.

> This puts your [Open WebUI / Odysseus] on a public web address. Your login is what keeps people out, so anyone with an account on this instance can sign in from anywhere, use your models, and see what is in it, including your chat history and any documents you have loaded. The address works for anyone the link gets forwarded to. It stays open until you stop it or your machine sleeps.
>
> Who are you sharing this with?

Then wait. The last question is not filler: it moves the user from "make it work" to "who is on the other end", which is the decision they should be making.

## 5. Why this gate exists

The plausible failure is not dramatic. It is an instance with signup left on, a link pasted into a group chat, and a month later an ngrok agent still running on a laptop that someone else has been using. Every condition here is one that looks harmless locally and only becomes a problem the moment the URL exists.

Check before, not after. There is no after with a shared link.
