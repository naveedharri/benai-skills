# Trust Boundary

What to tell a security reviewer, and what RunPod's own documents actually say. Verified against RunPod's legal pages on 5 August 2026.

This file exists because "it runs on our own server" is not a claim anyone accepts on its own. The reviewer wants named parties, named regions, and a contract. Give them this.

## Contents
1. The two tests
2. What RunPod's documents actually say
3. The three gaps to disclose
4. The data flow table
5. Generating the paragraph

## 1. The two tests

Establish which one the customer is applying before recommending anything. They are different requirements and RunPod passes one of them.

| Test | The question | RunPod |
|---|---|---|
| **A. Data residency** | "Is our data processed and stored in region X?" | **Passes, with caveats.** Six EU regions, public DPA, SOC 2 Type 2, Article 27 representative |
| **B. Jurisdictional immunity** | "Can a non-EU authority compel disclosure?" | **Fails.** Runpod Inc. is US-incorporated. No architecture changes this |

Most buyers mean A. Only regulated or sovereignty-conscious buyers mean B.

**If the customer's requirement names the CLOUD Act, SecNumCloud, BSI C5, or EU ownership, RunPod is the wrong provider.** Say so and point at OVHcloud, Scaleway, Outscale or Cloud Temple. Do not try to engineer around a corporate-ownership requirement.

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

## 4. The data flow table

Fill this in with the real region and put it in the report. Ten rows, because a reviewer who gets three feels managed rather than informed.

| # | What | Where it lives | Notes |
|---|---|---|---|
| 1 | Prompt in transit | Browser to RunPod HTTPS proxy | TLS. Proxy path is RunPod infrastructure |
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

## 5. The coverage line, for the user

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
> Your inference server is bound to loopback, so it is not reachable from any network. Chat history, uploaded documents and model weights all sit on a volume in the region you chose.

Two rules:

- **State only what you verified.** Every bullet above is from RunPod's own DPA, compliance page or privacy policy. If a future check contradicts one, remove the bullet rather than softening it.
- **Do not attach the gaps to this list.** Section 3 exists, the reviewer paragraph carries it, and the report has a place for it. Repeating caveats at every step trains the user to skip them, which is how the important one gets missed.

## 6. Generating the paragraph

The report should carry a paragraph the customer can paste into their own documentation. Build it from facts, with no adjectives:

> Inference runs on a single-tenant NVIDIA GPU server in Runpod Secure Cloud, region `<REGION>`. The inference server binds to loopback only and is not reachable from any network. The only externally reachable service is the chat interface, protected by its own authentication. Chat history, uploaded documents and model weights are stored on a network volume in the same region. The processor is Runpod Inc., United States, which holds SOC 2 Type 2 and provides a Data Processing Agreement using Standard Contractual Clauses, Module Two, governed by Irish law, with Prighter Group as Article 27 EU representative. Subprocessors are disclosed under NDA. Runpod's DPA commits to reasonable efforts to allocate servers in a geographically proximate location rather than guaranteeing residency; `<WRITTEN COMMITMENT OBTAINED: yes/no>`. Control-plane metadata residency is `<CONFIRMED: .../unconfirmed>`.

Two rules for that paragraph:

- **Never fill a placeholder with an assumption.** "Unconfirmed" is a legitimate value and a reviewer respects it. An invented one destroys the document's credibility the moment it is checked.
- **Keep the last two sentences.** They are the weakest parts of the story, and a paragraph that omits its own weaknesses is the kind a reviewer stops trusting.
