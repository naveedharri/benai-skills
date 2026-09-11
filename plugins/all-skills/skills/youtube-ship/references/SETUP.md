# One-time setup

What a new operator needs installed before the chain will run. Written from Juan's setup on
2026-08-26, where roughly half the session went on this rather than on publishing.

Work through it once. None of it comes back.

## Accounts and access, ask Oskar for each

| What | Why | How it arrives |
|---|---|---|
| Google account on the Ben AI org, as an administrator | YouTube Studio. A non-admin login gets kicked out repeatedly | Oskar adds you |
| Claude, on the Ben AI organisation | runs the whole chain | request to join, Oskar approves in org settings |
| Bitly, `ben@benai.co` | importing the tracking links | shared login |
| Kit | the lead magnet landing pages | invitation to your Google account |
| Notion, the Youtube tutorial Pipeline | every video's state lives on its card | shared |
| Whisper Flow | dictation, see below | invitation, it is a team seat |

Star the Notion pipeline board once you have it. You will open it every single time.

## Software

**Claude desktop.** Install, sign in, confirm you are on the Ben AI organisation and not a
personal account.

**Git.** Needed before Claude Code will work. On Windows, "Git for Windows" is the one to take.

> After installing Git, quit Claude completely and reopen it. Not just the window: close every
> terminal and PowerShell window too. On 2026-08-26 Git was installed correctly and Claude kept
> reporting it missing for several minutes purely because it had not been restarted.

**Python.** The UTM script needs it. Claude will offer to install it and can do the whole thing
itself: accept the suggestion and let it run. You do not need to know what Python is, and asking
Claude to explain it is a perfectly good use of the chat.

**The plugin.** In Claude: top left, then Plugins, then add from the zip. Keep it as a zip; do
not unzip it first.

**vidIQ browser extension.** From the Chrome extension store, signed in with Ben's account. It
appears inside YouTube Studio's Tags field and is what prunes the tag list at the end.

**Whisper Flow.** Dictation, bound to `Ctrl + Windows`. Double-tap to lock it on so you can let
go of the keyboard, then tap again to finish. It pastes wherever the cursor is, so you can start
dictating, change window, click into a text box and finish there.

Nobody on this team types long prompts. Talk to Claude the way you would brief a colleague:
ramble, correct yourself mid-sentence, leave the mess in. More context beats tidier context.

**Claude in Chrome.** Needs connecting separately. The chain uses it for every YouTube read,
because YouTube blocks the sandbox. If a stage reports "Claude in Chrome isn't connected", that
is what it means.

## Optional but worth it

A microphone. Whisper Flow needs one, and a laptop without a built-in mic needs headphones or
AirPods connected before it will work.

## Check it worked

Open Claude and ask it, in your own words, whether the YouTube publishing plugin is installed
and whether it can see all six skills. It will list them and tell you what is missing. That one
question is the whole verification.
