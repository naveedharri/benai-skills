# Environment Check

Run this before anything else. Keep it short: **nothing in this skill runs on the user's machine**, so their hardware is irrelevant and you must not report on it.

This gate exists for one reason only. Provisioning billable infrastructure from a disposable environment is a hazard: the session ends, the environment is destroyed, and a GPU keeps billing on an account whose console the user has never opened, with resource IDs that existed only in a terminal that no longer exists.

So the check asks three things, and nothing else:

1. Is there a shell that will still exist when this finishes?
2. Can both providers be reached?
3. Are the tools present to install the provider CLIs?

## 1. The check

```bash
echo "container: $([ -f /.dockerenv ] && echo yes || grep -qaE 'docker|containerd|lxc|kubepods' /proc/1/cgroup 2>/dev/null && echo yes || echo no)"
echo "runpod:    $(curl -s -o /dev/null -w '%{http_code}' --max-time 8 https://api.runpod.ai/ 2>/dev/null || echo unreachable)"
echo "ovh:       $(curl -s -o /dev/null -w '%{http_code}' --max-time 8 https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/models 2>/dev/null || echo unreachable)"
echo "npx:       $(command -v npx >/dev/null && echo present || echo missing)"
echo "curl:      $(command -v curl >/dev/null && echo present || echo missing)"
echo "jq:        $(command -v jq >/dev/null && echo present || echo 'missing, will install')"
echo "runpodctl: $(command -v runpodctl >/dev/null && echo present || echo 'missing, will install')"
```

If the Bash tool is not available at all, the environment fails immediately.

**Do not check the operating system, the hostname, the home directory, or whether `/Applications` exists.** Those belong to the skills that read local hardware. Here they are noise, and reporting "a real Mac" tells the user you checked something that does not matter.

## 2. Reading the result

Fail only on these:

| Signal | Meaning |
|---|---|
| No Bash tool | Cannot run anything. Hard fail |
| `container: yes` | A disposable environment. Do not spend money or handle keys from here |
| `runpod: unreachable` | No route to the provider. Fails Route B; Route A can still proceed |
| `ovh: unreachable` | No route to the provider. Fails Route A; Route B can still proceed |
| `npx: missing` | Cannot install the provider CLI. Node is required for Route B only |
| `curl: missing` | Cannot verify any endpoint |

One unreachable provider fails only its own route: say which route is closed and continue if the user's route is open. Both unreachable means no network worth trusting; stop.

`jq` and `runpodctl` missing are expected on a first run; install them when the chosen route needs them.

A non-200 status from the provider probe is **not** a failure. An unauthenticated probe can legitimately return 401 or 404. Only the literal word `unreachable` fails.

## 3. What to say when it fails

Sandbox or container:

> This one has to run in Claude Code on your own machine. It creates paid GPU resources on your RunPod account, and from here I cannot guarantee you would be able to find and shut them down afterwards. Nothing has been created and nothing has been charged.

No network route:

> I cannot reach RunPod from here, so I would be provisioning blind. Nothing has been created. Worth checking a VPN or proxy, then run this again.

Missing Node:

> This needs Node so I can install RunPod's own agent skills. Install Node, then run this again.

In every failure case, say plainly that nothing was created and nothing was charged. That is the sentence the user actually wants.

## 4. What to say when it passes

One line, about the providers and nothing else:

> Both providers reachable, tools present. Nothing runs on your machine here, so your hardware does not matter.

Then move on. Do not enumerate what you found.
