# Environment Check

Run this before anything else. This skill provisions paid infrastructure over the network, so it needs a real shell, working internet, and the ability to install two CLIs.

Its gate is different from the rest of this plugin. The other skills fail in a sandbox because they would report the sandbox's hardware as the user's. This one fails in a sandbox because it would spend the user's money from a machine they cannot see or clean up afterwards.

## Contents
1. The check
2. Reading the result
3. What to say when it fails
4. Why this gate exists

## 1. The check

```bash
echo "os:        $(uname -s) $(uname -r)"
echo "host:      $(hostname)"
echo "home:      $HOME"
echo "container: $([ -f /.dockerenv ] && echo yes || grep -qaE 'docker|containerd|lxc|kubepods' /proc/1/cgroup 2>/dev/null && echo yes || echo no)"
echo "homedirs:  $(ls ~ 2>/dev/null | tr '\n' ' ' | cut -c1-70)"
echo "net:       $(curl -s -o /dev/null -w '%{http_code}' --max-time 8 https://api.runpod.ai/ 2>/dev/null || echo unreachable)"
echo "railway:   $(curl -s -o /dev/null -w '%{http_code}' --max-time 8 https://backboard.railway.com/graphql/v2 2>/dev/null || echo unreachable)"
echo "node:      $(command -v node || echo missing)"
echo "npx:       $(command -v npx || echo missing)"
echo "curl:      $(command -v curl || echo missing)"
echo "jq:        $(command -v jq || echo missing)"
echo "runpodctl: $(command -v runpodctl || echo 'missing, will install')"
echo "railwaycli:$(command -v railway || echo 'missing, will install')"
```

If the Bash tool is not available at all, the environment fails immediately. Stop and go to section 3.

## 2. Reading the result

Fail the check if **any** of these is true:

| Signal | Meaning |
|---|---|
| No Bash tool available | Cannot run anything. Hard fail |
| `container: yes` | A sandbox. Do not spend money from here |
| `net:` or `railway:` unreachable | No route to a provider. Provisioning would half-complete |
| `home:` is `/root`, or `homedirs:` is empty or shows only system folders | Not the user's real home |
| `hostname` contains `sandbox`, `runsc`, `runner`, or is a random hex string | Ephemeral container |
| `npx: missing` | Cannot install the provider skills. Node is required |
| `curl: missing` | Cannot verify any endpoint |

`jq` missing is not a failure. Install it, or parse with `python3 -m json.tool` instead.

`runpodctl` and `railway` missing are expected on a first run. Install them in step 2 of the skill.

A non-200 status from either provider URL is not automatically a failure: an unauthenticated probe can legitimately return 401 or 404. `unreachable` is the failure. A number of any kind means there is a route.

## 3. What to say when it fails

For a sandbox or container:

> This one has to run in Claude Code on your own machine. It creates paid GPU resources on your RunPod account, and if it runs here I cannot guarantee you will be able to find and shut them down afterwards. Nothing has been created and nothing has been charged.

For no network route:

> I cannot reach RunPod or Railway from here, so I would be provisioning blind. Nothing has been created. Worth checking a VPN or proxy, then run this again.

For missing Node:

> This needs Node so I can install RunPod's and Railway's own agent skills. Install Node, then run this again.

In every failure case, state plainly that nothing was created and nothing was charged. That is the sentence the user actually wants.

## 4. Why this gate exists

A skill that provisions billable infrastructure from a disposable environment is a genuine hazard. The session ends, the sandbox is destroyed, and a GPU keeps billing on an account whose console the user has never opened, with resource IDs that existed only in a terminal that no longer exists.

That is why teardown commands are printed the moment each resource is created, and why this check runs before the credentials are even requested. Fail closed. An unspent afternoon is cheap; a forgotten 4×H200 Pod is about $344 a day.
