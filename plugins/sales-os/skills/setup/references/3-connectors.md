# Pillar 3: Connectors

Connect the tools the OS needs to act. Ask about the rep's stack, understand their goals, and recommend connecting every relevant tool. Reason from two angles: what is universally needed, and what each capability in pillar 4 will require.

## Must-haves (everyone)

These are the floor. The OS cannot run its core motion without them.

| Category | Why | Examples |
| --- | --- | --- |
| CRM | the system of record the OS augments | Attio, HubSpot, Pipedrive, Salesforce |
| GWS | calendar and mail and docs, the connective tissue | Google Workspace (the `gws` CLI or a connector) |
| Email | to draft and send | Gmail connector, or `gws` |
| Proposal platform | to create proposals (if they send them) | PandaDoc, Google Docs |
| Meeting notetaker | the transcript that feeds call capture and follow-up | Fireflies, Fathom, Granola, Otter |

## Gauge, then recommend the high-leverage gaps

Ask what they already use and what is already connected to Claude. The highest-leverage move is usually connecting a tool they already rely on but have not wired up. If they run every call through a notetaker but Claude is not connected to it, that is the first recommendation, because call capture and follow-up depend on it. Be specific: name the gap, name the leverage, give the connect steps.

## Reason from the capability angle

A capability only installs in pillar 4 when its tools are live. So connect for what they will actually run:

- Core routines need the CRM, the notetaker, and email.
- Post-discovery follow-up needs the notetaker, email, and (if they send proposals) the proposal platform.
- The one-pager needs whatever hosts it (optional) and their design assets.
- Lead-gen and outreach need a data or scraping source and an enrichment provider, and a sending tool.

Do not connect tools for capabilities the rep is not taking. Tie this pillar to the pillar-4 gauge: connect what their chosen capabilities require, no more.

## Done when

The must-haves are connected (or the rep has explicitly deferred one and understands the cost), and the tools for their chosen capabilities are live. Then move to pillar 4.
