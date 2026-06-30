# Config (instance literals)

The single source of instance-specific values every routine and skill reads. The onboarder fills this from the rep's answers (pillar 1) and the routines reference these keys by name. Keep the key names exactly as below; the bundled routine templates depend on them.

```yaml
# Identity
rep_name: "Jane Doe"
rep_first_name: "Jane"
rep_email: "jane@acme.com"
brand_voice: "Context/voice.md"        # path to the voice doc
offer_name: "Your Offer Name"

# Paths
sales_os_root: "/path/to/the/Sales-OS"  # the rep's chosen root (pillar 0)
config_path: "Context/config.md"        # this file, relative to root
methodology_path: "Intelligence/analysis-methodology.md"
sop_path: "Context/sales-process.md"
sales_rep_analyzer_path: "the installed sales-rep-analyzer skill"

# Stack (parameterizes the routines: no tool is hardcoded)
crm_name: "Attio | HubSpot | Pipedrive | Salesforce"
crm_connector: "how the routine reaches the CRM (connector or API)"
crm_list_id: "the deal list or pipeline id the routine scopes to"
proposal_platform: "PandaDoc | Google Docs | none"   # source of truth for proposal status
notetaker_name: "Fireflies | Fathom | Granola | Otter"
notetaker_tool: "how the routine reaches the notetaker"
email_tool: "Gmail connector | gws"
calendar_tool: "Google Calendar via gws or a connector"
chat_tool: "Slack | none"               # for escalation self-DMs

# CRM stage vocabulary (the routine mirrors deal status to these)
status_enum: ["Meeting Booked", "Next Call Scheduled", "Won", "Lost", "Unqualified"]

# ICP (used for qualification and red-flag checks)
icp: "one-line ICP summary"
icp_red_flags: "the disqualifiers"

# Schedule (local scheduled tasks)
routine_prefix: "salesos"               # task name prefix, e.g. salesos-morning-routine
morning_time: "08:00"
hygiene_time: "08:45"                    # after morning
scoring_days: "Wed, Fri"
scoring_time: "09:00"
monthly_time: "1st 09:00"
quarterly_time: "1st of quarter 09:00"
dashboard_time: "09:53"                  # after morning + hygiene

# Call-scoring weights (close weighted light for multi-call sells; adjust per rep)
scoring_weights:
  discovery: 0.25
  demo: 0.25
  objection: 0.20
  rapport: 0.20
  close: 0.10

# Notifications
daily_brief_to: "jane@acme.com"          # where pipeline hygiene sends the consolidated brief
escalation_to: ""                        # chat user for self-DM escalations, blank to skip
```

Confirm every literal with the rep before registering the routines. A wrong `crm_list_id` or `notetaker_tool` is the most common reason a first unattended run fails.
