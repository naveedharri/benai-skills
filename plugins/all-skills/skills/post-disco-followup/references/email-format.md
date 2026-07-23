# Email Format

The exact format for the email draft. The markdown recap and the email draft share a structure: the markdown uses `**bold**`, the email draft uses `<b>bold</b>` because the mail client renders HTML.

If `assets.email_template` is `have_it`, match the user's own recap structure and tone instead of this default. This default is the BenAI-recommended recap, the fallback when the rep has no template of their own.

## Envelope

- From: the account you are authenticated as. NOT necessarily `identity.signature_email` (see below).
- To: prospect email (from the transcript participants)
- Subject: the configured `email.subject_format`, company filled in

### From reality (confirmed in testing)

The email backend creates the draft in whatever account is authenticated. It cannot send as `identity.signature_email` if that is a different mailbox. So the draft is in the authenticated user's own drafts, `signature_email` and `sender_name` are for the signature block only, and you must state the real From in the confirmation.

## Body (BenAI recommended structure)

```
Hi <first name>,

<personalized one-liner: one warm, specific line tied to them or the call, never generic>

Wanted to quickly recap what we went through and lay out the next steps.

Key points of discussion:

- <Key point 1>
- <Key point 2>
- <Key point 3>

Next steps:

- <FIRST NEXT STEP, process-aware, see below>
- <second next step, with absolute date if one was agreed>
- <optional third next step>

Hope that captures everything we went through.

Did I miss anything? Either way, really looking forward to the prospect of working together.

Best,
<configured sender_name>
```

Exactly three key points of discussion, led by their primary goal or challenge. Two to three next steps. If the rep set a custom `email.sign_off`, use it in place of the "Did I miss anything" line.

## The first next step (process-aware)

What the first next step is depends on whether a proposal is part of THIS touch (the engine decides from the `process` block) and on the proposal backend.

**A proposal IS part of this touch:**
- **Google Docs backend:** you have a real shareable Doc URL. Use it as a hyperlink with display text exactly `View the proposal here`:
  `- <a href="<google doc url>">View the proposal here</a> for review. Pricing and scope inside.`
- **PandaDoc backend:** a draft has NO prospect-facing link. Do NOT fabricate one. Put a clearly marked placeholder:
  `- View the proposal here: [ PROPOSAL LINK, paste this in after you send/share the PandaDoc proposal ]`
  The confirmation then tells the user to send/share the doc, copy the link, paste it over the placeholder, and send.

**No proposal in this touch** (`proposal_timing` is `after_call` on an early call, `none`, or `on_trigger` while held): the first next step is the configured `process.default_next_step`, with NO proposal line and NO link. For example:
- `book_followup`: `- Let's lock in the next call. I'll send a couple of times that work, grab whatever suits you.`
- `start_trial`: `- I'll get your trial access set up so you can try it on your own data this week.`
- `nurture`: a light, no-pressure touch with a relevant resource or a "happy to dig in whenever you're ready".

## Field rules

- `<personalized one-liner>`: one specific observation from the call, not generic. This is the warm opener; do not skip it.
- `<when>` references stay natural ("earlier today", "yesterday"), absolute date if the call was more than two days ago.
- Key point titles can be bolded with a colon then the body, or plain bullets; keep them tight, 1 to 2 sentences each.
- Google Docs link: hyperlink with display text exactly `View the proposal here`, never a raw url, and only when a proposal is in this touch.
- The closing is the "Hope... / Did I miss anything?" pair; the "Did I miss anything?" line invites a reply, which is the point. Keep it.
- No em dashes anywhere. Colons after bold headers, commas, or restructure.
- Warm, direct, professional. Low-pressure when still in discovery.
