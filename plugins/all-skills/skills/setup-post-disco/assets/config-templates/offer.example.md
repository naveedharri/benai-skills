# Offer config (example)

The variable layer. The `setup-post-disco` wizard fills this from an interview, or from material you already have (an existing proposal template, email template, or a documented sales process). Copy this file to `offer.md` in this same `config/` folder. The engine reads `config/offer.md`, never this example.

Everything the engine personalizes per client comes from the call. Everything in THIS file is constant across all your clients: your offer, your identity, your delivery channels, where the proposal sits in your process, and your rules. None of it is industry-specific; fill it for whatever you sell (a service, a retainer, software, a project, a productized offer).

```yaml
identity:
  operator_name: "Jane Doe"            # appears as the signer on the proposal and the email sign-off
  company_name: "Acme Co"              # the seller
  signature_email: "jane@acme.com"     # shown in your email signature. Does NOT change the draft's From address (see email.backend)
  governing_law: "Delaware, USA"        # jurisdiction for the Terms and Conditions, if your proposal has them

# WHAT you sell. Industry-agnostic. Used for wording, not for any hardcoded structure.
positioning:
  program_name: "Your Offer Name"      # what you call it. Becomes the proposal title
  one_liner: "One sentence on what you sell and how you frame it."
  framing: "done_for_you"              # done_for_you | enablement | subscription | project | other. Shapes wording, not structure
  success_criteria: "The headline outcome the client walks away with."
  duration: "e.g. 14 days, 3 months, ongoing"

# Ordered scope blocks. Any count, not fixed at three. Call them what you call them.
phases_label: "phases"                 # phases | milestones | deliverables | inclusions | workstreams
phases:
  - title: "First block"
    intro: "One line on what this block covers:"
  - title: "Second block"
    intro: "..."

# Pricing. Pick the model that matches how you actually charge.
pricing:
  model: "one_time"                    # one_time | recurring | tiered | deposit_milestone | quote
  currency: "USD"
  one_time:
    amount: 5000
    line_item: "Engagement fee"
  recurring:
    amount: 2000
    period: "month"                    # month | quarter | year
    term: "3 months"                   # commitment length, or "month to month"
  tiers: []                            # [{name, price, period, includes}] for good/better/best
  deposit_milestone:
    deposit: 0                         # upfront amount
    milestones: []                     # [{name, amount, trigger}]
  tier_note: "for orgs of 5 to 20 people"   # when the engine should flag an out-of-tier client

support_terms: |
  - what is included after the engagement (appears verbatim on the proposal, if your proposal has this section)

# === Your existing material. The skill PREFERS your own templates over its generic defaults. ===
# The wizard gauges what you already have and plugs it in. Set status to have_it and give a location.
assets:
  proposal_template:
    status: "none"                     # none | have_it
    kind: ""                           # pandadoc | google_doc | docx | pdf | markdown
    location: ""                       # PandaDoc template id, Google Doc id/url, or a file path
    notes: ""                          # anything the engine should know about its structure
  email_template:
    status: "none"                     # none | have_it. none = use the generic recap below
    location: ""                       # file path to your own recap email template, if any
  sales_process:
    status: "none"                     # none | have_it | use_vault (use_vault reads Context/sales-process.md)
    location: ""                       # file path to a documented process, if any

# === WHERE in your sales process the proposal sits. The key adaptivity. ===
process:
  proposal_timing: "immediate"         # immediate | after_call | on_trigger | none
  proposal_after_call: 2               # only if after_call: which call number triggers the proposal
  first_call_output: "recap_proposal"  # recap_proposal | recap_book_next | recap_only
  default_next_step: "send_proposal"   # send_proposal | book_followup | start_trial | nurture | custom
  proposal_readiness: "ready"          # ready | needs_scoping (custom quotes: draft the proposal but hold it for your review)

# WHERE proposals are created. Only used on touches where a proposal is actually produced.
proposal:
  backend: "pandadoc"                  # pandadoc | google_docs | reuse_existing | none
  pandadoc:
    transport: "connector"             # connector = native PandaDoc MCP (Desktop or Code) | api = direct REST (Code only)
    template_id: ""                    # your template id; see config/pandadoc.md for the token map
    api_key_env: "PANDADOC_API_KEY"    # only used when transport is api
  google_docs:
    template_doc_id: ""                # optional: a Google Doc to copy as the proposal base. Blank = build fresh from markdown
    dest_folder_id: ""                 # optional: Drive folder to file proposals in
    share: "anyone_with_link_view"

# HOW the recap email is drafted.
email:
  backend: "gmail_connector"           # gmail_connector | gws | none
  subject_format: "{company}: next steps"   # {company} filled per client. Keep it generic and human
  sign_off: "Looking forward to it, {first_name}."
  sender_name: "Jane"
  # NOTE: the draft is always created in the account you are authenticated as. signature_email is identity only.

# HOW the skill gets a transcript and whether it runs on demand or automatically.
autonomy:
  mode: "manual"                       # manual (you run it after a call) | autonomous (a routine runs it for you)
  transcript_source: "paste"           # paste | fireflies | fathom | granola | otter | other
  poll_or_webhook: "poll"              # routine-only: poll the notetaker on a schedule, or receive a webhook
  repo: ""                             # routine-only: repo to commit drafts to and open a PR

# How the engine recognizes a qualifying call (mainly for autonomous mode). Manual: leave enabled false.
qualification:
  enabled: false
  host_email: "jane@acme.com"
  title_pattern: ""
  event_name_contains: "Discovery"

confirmation:
  mode: "chat"                         # chat | slack
  slack_user_email: ""

output_dir: "./clients"
```
