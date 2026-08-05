# Environment Check

Run this before anything else. These skills read real hardware and install real software, so they need a shell on the user's own machine. In a sandboxed or containerised environment they will either fail or, worse, silently report the sandbox's specs as if they were the user's.

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
echo "apps:      $([ -d /Applications ] && echo '/Applications present' || echo 'none')"
echo "homedirs:  $(ls ~ 2>/dev/null | tr '\n' ' ' | cut -c1-70)"
echo "brew:      $(command -v brew || echo missing)"
```

If the Bash tool is not available at all, the environment fails the check immediately. Stop and go to section 3.

## 2. Reading the result

Fail the check if **any** of these is true:

| Signal | Meaning |
|--------|---------|
| No Bash tool available | Cannot run anything. Hard fail. |
| `container: yes` | Running inside Docker, a VM, or a sandbox. |
| `os: Linux` but the user is talking about a Mac or Windows PC | You are seeing a sandbox, not their machine. |
| `home:` is `/root`, or `homedirs:` is empty or shows only system folders | Not the user's real home directory. |
| `os: Darwin` but no `/Applications` | Not a real macOS install. |
| `hostname` is a random hex string or contains `sandbox`, `runsc`, `runner` | Ephemeral container. |

Pass the check only when the shell is clearly on the user's own machine: their home directory has their real folders, and the OS matches what they are describing.

When in doubt, ask one question: "Are you running this in Claude Code on your own computer, or somewhere else?" Trust the answer.

## 3. What to say when it fails

Stop. Do not run the rest of the skill, do not report any specs you detected, and do not install anything.

Say this, adapted:

> This skill needs to read your actual hardware and install software on your machine, so it has to run in **Claude Code** on the computer you want to set up. It looks like this session is running in a sandbox, so anything I detected here would describe that sandbox and not your machine.
>
> To use it: install Claude Code, open a terminal on your own computer, run `claude`, then run this skill again.

Then stop. Do not offer a partial result from sandbox data, because a wrong specs report is worse than no report: the user will download a model that does not fit.

The one thing you may still do without a shell is answer general questions from `references/model-tiers.md` if the user tells you their specs themselves. Say clearly that you are going on what they reported rather than anything you measured.

## 4. Why this gate exists

The whole value of these skills is that they measure instead of guessing. A sandbox breaks that in the most damaging way possible, by returning plausible numbers that belong to the wrong computer. Fail loudly rather than reporting them.
