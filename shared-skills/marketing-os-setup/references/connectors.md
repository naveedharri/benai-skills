# Connectors

Pillar 1. Probe, do not ask.

## Why probing beats asking

A checklist gets you what the user believes is connected. A probe gets you what actually works. Those differ often enough that a checklist-built `stack.md` is wrong on day one, and every routine then inherits the wrong assumption.

Attempt one real cheap call against each connector and record the outcome. A list call, a profile fetch, an account read. Never a write.

Record three states: **connected**, **degraded** (authenticated but missing scope or returning errors), **missing**.

## Do not stall on this

Authentication is the single most common place an OS setup dies. Do not sit in a loop waiting for the user to go and authorize seven services.

Probe, write the result, name what degrades, and continue to Pillar 2. The Context layer is useful with zero connectors, and it is the highest-value part of the whole build. Connectors can be added in any order afterwards, and re-running this skill picks them up.

## What each connector serves

Map the logical need to whatever the user actually has. The routines reference logical names from `Context/config.md`, so a different email platform or CRM just changes one line there.

| Need | Serves | Without it |
| --- | --- | --- |
| Video analytics | The primary channel's performance, publish detection | No video metrics, no publish capture |
| Competitive video research | The competitor radar | Radar degrades to whatever the platform's own data gives |
| Social scraping | Market scan, competitor activity beyond video | Market scan degrades to web search only |
| Deep web scraping | Market scan and research where native fetching fails | Scraping limited to what the agent fetches natively |
| Email platform | List size, open and click rates | No email metrics |
| Community platform | Member counts, posts, the customer intelligence source | Customer intel runs on calls alone |
| Call transcripts | The customer intelligence source. **Full transcripts, never summaries** | Customer intel runs on community alone |
| Product analytics | Site sessions, funnel, conversion | No conversion data anywhere in the OS |
| Payments | Revenue, subscriptions, churn | No revenue in any report |
| Scheduling | Calls booked | One funnel step missing |
| Workspace, calendar and mail | The morning routine's calendar and reply detection | Morning routine loses its two main inputs |
| Deploy target | Dashboard hosting | Dashboard builds locally, does not deploy |
| Image generation | Carousels, thumbnails, infographics | No generated imagery |

Transcripts deserve emphasis. A summary has already discarded the exact wording, and exact customer wording is the entire value of that routine.

## The two that matter most

If the user will only authenticate two before losing patience:

1. **Video analytics**, or whatever their primary original channel is. Without it there is no performance data at all, and performance is what makes the pattern library work.
2. **Call transcripts or the community platform.** This is the only source of real customer language in the whole OS, and customer language is what makes hooks land.

Everything else can wait a week.

## What to write into infrastructure.md

Two tables.

**Source of truth by data type.** Data, system of record, read via, and which routine pulls it. This is the table that stops two tools reporting the same metric differently and quietly breaking trust in the dashboard.

**Connectors this OS depends on.** Connector, needed by, and what happens if missing. The third column is what lets a routine degrade gracefully instead of inventing a number.

Then the rule, stated in the file: **a routine names the connector it needs and degrades gracefully when it is absent. It reports the gap in its log rather than failing the whole run or substituting an estimate.**

## Also write the connector names into config.md

Under a `connectors:` block, mapping logical name to the actual connector. The routines read from there, so `infrastructure.md` and `config.md` must agree. When a tool changes, both get updated together.

## Reporting back

Tell the user plainly: how many are live, how many are missing, and **for each missing one, which routine it degrades and what that routine will no longer be able to say.**

Not "the web analytics tool is not connected." Instead: "the web analytics tool is not connected, so the morning sweep will report no conversion data and both the monthly and quarterly reports will have an empty conversion section."

That framing is what gets connectors authenticated, because it names the cost.
