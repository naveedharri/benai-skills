Category: brain-update routine (monthly sales intelligence report)
Depends on: sales-rep-analyzer skill, win-loss-analysis skill (embedded with the rep's Sales OS plugin)

---
name: {{CONFIG:routine_name_prefix}}-monthly-report
description: Monthly Sales Intelligence Report for {{CONFIG:rep_first_name}}: win-loss, ICP, scorecard, forecast{{CONFIG:report_deploy_suffix}}
---

You are the monthly sales report routine for {{CONFIG:rep_first_name}}'s Sales OS at {{CONFIG:sales_os_path}}. FIRST read that folder's CLAUDE.md AND Intelligence/analysis-methodology.md (mandatory: it defines how to verify deals across every touchpoint, score from full transcripts, and the closing-funnel metrics). This is a brain-update routine: log to Daily/logs/, use [[wikilinks]], never em dashes, {{CONFIG:voice_name}} voice. Follow the sales-rep-analyzer and win-loss-analysis skills at {{CONFIG:embedded_skills_path}}.

Report for the PREVIOUS month. Rep = {{CONFIG:rep_full_name}}. Title "Sales Intelligence Report - {{CONFIG:rep_first_name}}".

Steps:
1. CLOSING FUNNEL FIRST, at the very top (these are the most important metrics): compute from the Deals/ statuses and the [[{{CONFIG:crm_name}}]] CRM. Meetings booked, met (booked minus no-shows), qualified (met minus unqualified and off-ICP), won. Report close rate to qualified meetings (won/qualified), close rate to all booked meetings (won/booked), and the decided close rate (won / won+lost). Show the funnel and the month-over-month trend once history exists.
2. Rep scorecard from THAT MONTH's call scores in Calls/ ({{CONFIG:calls_per_month_estimate}}). Overall weighted with the close light (Discovery .25, Demo .25, Objection .20, Rapport .20, Close .10). Exclude calls run by other reps.
3. When analyzing ANY deal, cross-reference all touchpoints, never one source: the [[{{CONFIG:crm_name}}]] CRM{{CONFIG:proposal_tool_clause}}, and email ({{CONFIG:email_tool}}). {{CONFIG:extra_touchpoint_note}}
4. Win-loss pattern analysis (won vs lost, with verbatim quotes), ICP insights (winning profile, red flags, door-qualifying questions, common pain points), pipeline review ({{CONFIG:pipeline_verification_source}}), and a monthly plus quarterly forecast.
5. Write Intelligence/sales-report-YYYY-MM.md as the canonical deliverable. Put the closing funnel at the top.
6. OPTIONAL HTML + HOSTING (only if {{CONFIG:rep_first_name}} has a reporting and hosting tool wired in Context/config.md; otherwise SKIP this step and the markdown report is the deliverable): rebuild Intelligence/sales-dashboard.html using the {{CONFIG:design_system_name}} design tokens in {{CONFIG:design_tokens_path}}. Put the closing funnel at the top. Make it clickable with expandable per-call drill-downs (<details>). Do NOT put text inside any donut center (it overlaps); use a legend. Then deploy: copy the HTML as index.html into a fresh temp dir (NEVER stage the vault root, to protect private data) and run {{CONFIG:deploy_command}}. Confirm HTTP 200.
7. Log everything to Daily/logs/. End with the closing-funnel headline{{CONFIG:report_url_log_suffix}}.

---

## Config keys for this template

Fill every `{{CONFIG:...}}` above from the rep's onboarding answers and Context/config.md. Sensible defaults make the markdown report work even when the rep has no hosting.

| Key | Meaning | Default if unset |
| --- | --- | --- |
| `routine_name_prefix` | Slug prefix for the local task name | `sales-os` |
| `rep_first_name` | Rep's first name | required |
| `rep_full_name` | Rep's full name | required |
| `sales_os_path` | Absolute path to the rep's Sales OS folder | required |
| `voice_name` | The brand/voice this rep writes in | the rep's own name |
| `embedded_skills_path` | Absolute path to the rep's sales-plugin skills folder | required |
| `crm_name` | CRM system of record (whatever the rep uses) | required |
| `calls_per_month_estimate` | Plain-English count of scored calls per month given the cadence | `about 8 per month` |
| `proposal_tool_clause` | If the rep uses a proposal tool, set to `, the [[ToolName]] proposal status (the truth for declined/voided/viewed/paid/never-sent)`; else empty | empty |
| `email_tool` | Email access method | `gws` |
| `extra_touchpoint_note` | Any channel the rep uses but has not connected yet (e.g. WhatsApp), or empty | empty |
| `pipeline_verification_source` | What the pipeline is verified against | the CRM, or `proposal-tool-verified` if a proposal tool exists |
| `design_system_name` | The rep's design system, or a chosen one | `the rep's design system` |
| `design_tokens_path` | Path to the visual-identity/design-tokens file | required only if HTML step is on |
| `deploy_command` | The rep's hosting deploy command (for example a Vercel/Netlify/static-host CLI invocation that publishes `<tempdir>` and prints a URL) | required only if HTML step is on |
| `report_deploy_suffix` | `, deployed to <host>` if hosting is on; else empty | empty |
| `report_url_log_suffix` | `, then the live URL` if hosting is on; else empty | empty |

> [!important] Deliverable first, deploy optional
> The markdown report in Intelligence/ is always the deliverable. The HTML rebuild and the deploy in step 6 only run when the rep registered a reporting and hosting tool. With no hosting tool, leave step 6 off, drop `report_deploy_suffix` and `report_url_log_suffix`, and the routine still does its full job.

> [!note] Embedded skill dependencies
> This routine drives two skills that ship inside the rep's sales-plugin: `sales-rep-analyzer` (scorecard, per-prospect journey, evidence-backed grades) and `win-loss-analysis` (won-vs-lost patterns, ICP persona, red flags). They are not standalone CLIs; the routine reads and follows them from `{{CONFIG:embedded_skills_path}}`. Both already support any CRM and any transcription tool, so no CRM-specific edits are needed inside them.
