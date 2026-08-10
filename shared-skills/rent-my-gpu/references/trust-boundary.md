# Trust Boundary

What to tell a security reviewer, and what the providers' own documents actually say. RunPod verified against its legal pages on 5 August 2026; OVH AI Endpoints verified against its documentation on 6 August 2026.

This file exists because "it runs on our own server" is not a claim anyone accepts on its own. The reviewer wants named parties, named regions, and a contract. Give them this.

Sections 1 through 6 are Route B, the RunPod pod. Section 7 is Route A, the OVH endpoint.

## Contents
1. The three tests
2. What RunPod's documents actually say
3. The three gaps to disclose
4. The data flow table (Route B)
5. The coverage line (Route B)
6. Generating the paragraph (Route B)
7. Route A: the OVH endpoint

## 1. The three tests

Establish which one the customer is applying before recommending anything. They are different requirements, and each route passes a different two of the three. This table is the fork in SKILL.md, stated for a reviewer.

| Test | The question | Route B, RunPod pod | Route A, OVH endpoint |
|---|---|---|---|
| **A. Data residency** | "Is our data processed and stored in region X?" | **Passes, with caveats.** Six EU regions, public DPA, SOC 2 Type 2, Article 27 representative | **Passes.** Gravelines, France |
| **B. Jurisdictional immunity** | "Can a non-EU authority compel disclosure?" | **Fails.** Runpod Inc. is US-incorporated. No architecture changes this | **Passes.** OVH Groupe SAS is French |
| **C. Tenancy** | "Does a shared multi-tenant service process our plaintext?" | **Passes.** Single-tenant GPU; every exposed service requires authentication | **Fails.** Shared service by design |

Most buyers mean A, and both routes serve them; the fork is then usage shape, not compliance. Only regulated or sovereignty-conscious buyers mean B, which is Route A's argument. Buyers who mean C need Route B.

**A requirement that names both B and C at once, or names SecNumCloud, BSI C5 or Cloud Temple-grade sovereignty with single tenancy, is satisfied by neither route.** Say so and point at Hetzner, Verda, Scaleway or Outscale for EU-owned single-tenant machines. Do not try to engineer around a corporate-ownership requirement.

## 2. What RunPod's documents actually say

Use these facts, not summaries of them.

**Processor identity**
- The processor is **Runpod Inc.** The DPA does not name an EU entity as processor.
- There **is** an Article 27 **EU GDPR Representative: Prighter Group**.
- A Data Protection Officer is reachable at `privacy@runpod.io`.

**Transfers**
- Restricted transfers run on the **Standard Contractual Clauses and the UK Addendum**. **Module Two applies, with Ireland as governing law and jurisdiction.**
- RunPod's own privacy policy states plainly that "the US legal regime is not considered by relevant European bodies to provide an adequate level of protection." That is their language, not a critic's. Quote it rather than hiding it; a reviewer who finds it later will trust you less.

**Certifications**
- **SOC 2 Type 2: completed, held by RunPod.** SOC 3, HIPAA and GDPR resources are available.
- **ISO 27001 and PCI DSS are not claimed by RunPod directly** in its compliance page. Those belong to infrastructure partners.
- RunPod states: "Compliance coverage can vary by workload, region, provider, and deployment model," and asks customers to confirm during security review.
- Documents live at **trust.runpod.io** and may require approval before download.

**Subprocessors**
- Third-party hosting providers are named in **Attachment 2** of the DPA.
- The subprocessor detail is **confidential and requires an NDA** before disclosure.
- Customers get notification of new subprocessors and **10 business days to object**.

**Retention and deletion**
- Customer workload data is **explicitly out of scope** of the public privacy policy; it is governed by the DPA.
- On request, RunPod "shall irretrievably delete or return all Personal Data," unless law requires retention.
- No published retention periods for workload data.

## 3. The three gaps to disclose

Never present RunPod as a clean residency story without these. A reviewer will find all three.

**Gap 1, and the serious one: the DPA does not guarantee residency.**

The DPA says RunPod "uses third-party data hosting providers to host the Services on servers located throughout the world, including in the United States," that customers may specify regions, and that RunPod will "use **reasonable efforts** to allocate a server in a **geographically proximate** location."

Reasonable efforts and geographically proximate is **not** a residency guarantee. The console lets you pin `EU-FR-1`; the contract promises best effort and nearby. If residency is a contractual commitment your customer is relying on, **get a written commitment from RunPod that overrides this clause** before you promise anything. This is the single most likely thing to sink a security review.

**Gap 2: the subprocessor list is NDA-gated.** Workable, but it means your customer's reviewer cannot self-serve the list, and their own DPA may require them to publish subprocessors downstream. Check that early, not at signature.

**Gap 3: control-plane and metadata residency is unaddressed.** Neither the privacy policy nor the compliance page states whether management metadata, logs or telemetry stay in the chosen region. Ask directly. Until answered, do not claim that nothing leaves the region.

## 4. The data flow table (Route B)

Fill this in with the real region and put it in the report. Ten rows, because a reviewer who gets three feels managed rather than informed.

| # | What | Where it lives | Notes |
|---|---|---|---|
| 1 | Prompt in transit | Browser or API client to RunPod HTTPS proxy | TLS. Both doors, 8080 and 8000, ride RunPod proxy infrastructure, where TLS terminates |
| 2 | Prompt in GPU VRAM | `<REGION>` | Milliseconds. The obvious one |
| 3 | KV cache | `<REGION>`, GPU VRAM | Can spill to host RAM |
| 4 | vLLM logs | `<REGION>`, pod disk | **Disable request-content logging** |
| 5 | Open WebUI database | `<REGION>`, network volume | **Every chat, permanently. The largest at-rest store** |
| 6 | Uploaded documents and embeddings | `<REGION>`, network volume | RAG corpus |
| 7 | Model weights | `<REGION>`, network volume | Downloaded from Hugging Face, a US company. Not personal data |
| 8 | Volume snapshots | `<REGION>`, confirm | Ask whether snapshots replicate cross-region |
| 9 | Control-plane metadata | **Unconfirmed** | Gap 3. Do not claim |
| 10 | Telemetry | Disabled | Turn off Open WebUI and vLLM phone-home explicitly |

Rows 5 and 6 are the ones people misplace. The GPU holds a prompt for milliseconds; the Open WebUI volume holds every conversation forever. Both must be in the same region as the GPU, which is why the single-pod build keeps them together.

Row 9 must say "unconfirmed" until RunPod answers in writing. Never write a region into a cell you have not verified.

## 5. The coverage line, for the user (Route B)

Say what **is** covered, at the two moments it helps, and nowhere else. Do not recite caveats at every step: the gaps belong in the reviewer paragraph in section 6, which is where a reviewer looks for them.

Show this when the user picks a region, and again in the gate confirmation. Every line is verified and stated as fact.

> **What you get on this setup**
>
> - **SOC 2 Type 2**, held by Runpod directly
> - **GDPR compliant** for data processed in European data center regions
> - A **Data Processing Agreement** you can sign, using Standard Contractual Clauses, Module Two, governed by Irish law
> - An **EU representative** under Article 27, Prighter Group, and a Data Protection Officer at `privacy@runpod.io`
> - **Data subject rights** honoured: access, erasure, restriction, portability
> - **72-hour breach notification**
> - **Irretrievable deletion** of your data on request
> - **Secure Cloud** runs in T3/T4 datacenters on single-tenant hosts
> - **HIPAA** available, with a BAA
>
> Your GPU is yours alone, and both of its doors are locked: the chat behind its own login, the API behind a key generated on your pod. Nothing on it answers an unauthenticated request. Chat history, uploaded documents and model weights all sit on a volume in the region you chose.

Two rules:

- **State only what you verified.** Every bullet above is from RunPod's own DPA, compliance page or privacy policy. If a future check contradicts one, remove the bullet rather than softening it.
- **Do not attach the gaps to this list.** Section 3 exists, the reviewer paragraph carries it, and the report has a place for it. Repeating caveats at every step trains the user to skip them, which is how the important one gets missed.

## 6. Generating the paragraph (Route B)

The report should carry a paragraph the customer can paste into their own documentation. Build it from facts, with no adjectives:

> Inference runs on a single-tenant NVIDIA GPU server in Runpod Secure Cloud, region `<REGION>`. Two services are externally reachable, both over TLS through Runpod's HTTPS proxy and both requiring authentication: the chat interface, protected by its own login with signup disabled, and the inference API, protected by a Bearer API key generated on the server; unauthenticated requests to either receive HTTP 401. Chat history, uploaded documents and model weights are stored on a network volume in the same region. The processor is Runpod Inc., United States, which holds SOC 2 Type 2 and provides a Data Processing Agreement using Standard Contractual Clauses, Module Two, governed by Irish law, with Prighter Group as Article 27 EU representative. Subprocessors are disclosed under NDA. Runpod's DPA commits to reasonable efforts to allocate servers in a geographically proximate location rather than guaranteeing residency; `<WRITTEN COMMITMENT OBTAINED: yes/no>`. Control-plane metadata residency is `<CONFIRMED: .../unconfirmed>`.

Two rules for that paragraph:

- **Never fill a placeholder with an assumption.** "Unconfirmed" is a legitimate value and a reviewer respects it. An invented one destroys the document's credibility the moment it is checked.
- **Keep the last two sentences.** They are the weakest parts of the story, and a paragraph that omits its own weaknesses is the kind a reviewer stops trusting.

## 7. Route A: the OVH endpoint

Verified against OVH's AI Endpoints documentation on 6 August 2026.

**What OVH's documents actually say**

- The service runs in **Gravelines, France**.
- On retention, their exact wording: **"Data is not stored or shared during or after model use."** Quote it as their claim, with the date read, not as your own measurement.
- The processor is **OVH Groupe SAS**, a French company. This is what passes the jurisdiction test the RunPod route fails.
- The service is governed by the OVHcloud AI Endpoints Conditions and the Public Cloud Special Conditions. Certifications are claimed at the OVHcloud company level; **do not attribute a specific certification to AI Endpoints itself without reading it on OVH's compliance pages that day**.

**The coverage line, shown once at the Route A gate**

> **What you get on this setup**
>
> - Processor is **OVH Groupe SAS, a French company**, outside US CLOUD Act jurisdiction
> - Runs in **Gravelines, France**
> - OVH states **data is not stored or shared during or after model use**
> - **Nothing bills at idle**, and there is no infrastructure to leak, patch or tear down
> - OpenAI-compatible API, keys scoped to your own Public Cloud project with validity periods you set

**The two gaps to disclose**

1. **Multi-tenant by design.** Prompts are processed by a shared service. The retention statement is OVH's own claim, contractual rather than architectural; there is no loopback binding to point at. A customer whose requirement is single tenancy is a Route B customer.
2. **Logging and telemetry residency is not itemised.** The documentation states data is not stored; it does not enumerate what request metadata exists or where it lives. Mirror the Route B honesty: "unconfirmed" in that cell until OVH answers in writing.

**The data flow table (Route A).** Five rows, same rule: never fill a cell with an assumption.

| # | What | Where it lives | Notes |
|---|---|---|---|
| 1 | Prompt in transit | User's machine to Gravelines | TLS |
| 2 | Prompt in processing | Gravelines, shared service | Multi-tenant. The honest cell |
| 3 | Prompt and reply at rest | Nowhere, per OVH | "Not stored or shared during or after model use", read 6 Aug 2026 |
| 4 | Chat history | The user's own apps, on their machines | This route has no server-side history at all |
| 5 | Request metadata | **Unconfirmed** | Ask OVH. Do not claim |

Row 4 is the quiet advantage nobody notices: with no hosted interface there is no server-side conversation store to place, size, or delete. History lives wherever the user's own app keeps it.

**Team shape:** row 4 changes and must not be handed over unedited. History at rest moves to the Open WebUI volume on the OVH VPS; name its OVH location in the cell. Add a row for TLS terminating at Caddy on that VPS. Still one company, OVH Groupe SAS, which is why the paragraph survives the change.

**The reviewer paragraph (Route A)**

> Inference runs on OVHcloud AI Endpoints, a managed multi-tenant inference API operated by OVH Groupe SAS, France, hosted in Gravelines, France. OVHcloud's documentation states that data is not stored or shared during or after model use (read `<DATE>`). Access is authenticated by API keys scoped to our own OVHcloud Public Cloud project. No conversation history is stored server-side by the service; history resides in our own client applications. The processor is a French company and the service is governed by the OVHcloud AI Endpoints Conditions and Public Cloud Special Conditions. Request metadata residency is `<CONFIRMED: .../unconfirmed>`.

Same two rules as the Route B paragraph: no assumption in a placeholder, and keep the last sentence.
