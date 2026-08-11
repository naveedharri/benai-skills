# Teardown

A first class entry point, not a footnote. `/rented-server-setup teardown` runs this.

## Route A first: there is nothing to tear down

The endpoint route owns no resource that bills at idle. Nothing was provisioned, so nothing accrues. Teardown is two sentences:

- **Stop using it and the billing stops.** Tokens already consumed appear on the OVH Public Cloud invoice; nothing else will.
- **To be certain, revoke the API key** in the OVHcloud Manager, Public Cloud → AI Endpoints → API keys. The anonymous tier has no key to revoke and nothing to bill.

**Team shape only:** the VPS bills monthly until the user deletes it in the OVHcloud Manager, and **the chat history dies with it**. Same rules as the pod: say what dies before deleting, offer Open WebUI's own conversation export first, and confirm the VPS is gone in the Manager rather than trusting the delete.

Say that, confirm what the user wanted removed is gone, and stop. Everything below is Route B.

## Route B: the pod

Order matters: stop the expensive thing first, then the cheap thing, then the storage. Verify each one is gone rather than trusting the delete call to have worked.

## Contents
1. What bills, and what it costs to forget
2. The order
3. Verify, do not assume
4. What dies with each resource
5. Partial teardown

## 1. What bills, and what it costs to forget

| Resource | Bills when | Forgotten cost |
|---|---|---|
| RunPod Pod | Always, from creation until destroyed | The whole hourly rate. Up to ~$421 a day at the frontier tier |
| RunPod network volume | **Always, even with nothing running** | Small but permanent. The one people miss |

Two things users get wrong, so state both:

- **Stopping a Pod is not destroying it.** A stopped Pod can still bill for its storage, and its volume definitely does. Destroy, do not stop, unless the user specifically wants to keep it for later and understands it is still costing something.
- **The volume is the cheap thing worth keeping.** Destroying the pod stops the hourly rate; keeping the volume preserves every conversation and the cached model weights for a small monthly cost. Offer that before deleting both.

## 2. The order

Confirm before the first delete. List what will be destroyed and what data dies with it, then wait for a yes.

```
Teardown will destroy:

  RunPod Pod        <POD_ID>       $2.89/hr, stops immediately
  RunPod volume     <VOLUME_ID>    100GB. Chat history, accounts, uploaded
                                   documents and cached model weights all die with it

The chat history and any uploaded documents cannot be recovered.

Proceed?
```

Then, in this order:

1. **The Pod.** The hourly rate stops here. Do this first even if a later step might fail.
2. **The network volume.** Only after the pod is gone, or the delete is refused as in-use. Ask first: this is where all the chat history lives.

Verify with `--help` before running, since the CLI moves. These forms were verified on runpodctl 2.8.1 on 10 August 2026:

```bash
runpodctl pod delete <POD_ID>                  # aliases: rm, remove
runpodctl network-volume delete <VOLUME_ID>    # alias: nv
```

The REST equivalents were also verified working the same day, and return **HTTP 204** with an empty body on success:

```bash
curl -X DELETE https://rest.runpod.io/v1/pods/<POD_ID> \
  -H "Authorization: Bearer $RUNPOD_API_KEY"
curl -X DELETE https://rest.runpod.io/v1/networkvolumes/<VOLUME_ID> \
  -H "Authorization: Bearer $RUNPOD_API_KEY"
```

**204 with an empty body is success, not a failure to report.** Do not treat the empty response as an error and retry blindly. Confirm with the list check in section 3 instead.

**`currentSpendPerHr` on the account lags behind a delete.** On 10 August 2026 it still reported the old rate immediately after a pod was destroyed and verified absent from `pod list`. The resource list is authoritative; the spend figure catches up. Never tell the user a delete failed on the strength of the spend number alone.

## 3. Verify, do not assume

A delete call returning success is not proof. List the resources afterwards and confirm each ID is absent.

```bash
# after each delete, confirm absence rather than trusting the response
runpodctl pod list             # the pod ID must not appear
runpodctl network-volume list  # the volume ID must not appear
```

If an ID is still present, say so plainly and retry once. If it persists, tell the user exactly where to click in the provider console and what to look for. An unverified teardown that reports success is worse than no teardown, because the user stops watching the invoice.

End by stating the account is clear, and name what remains if anything does. If the volume was deliberately kept, say it is still there, roughly what it costs, and how to remove it later.

## 4. What dies with each resource

Say this before deleting, not after.

- **The network volume**: everything at `/app/backend/data` plus the model cache. Chat history, user accounts, settings, uploaded RAG documents, vector embeddings, and the weights. There is no copy anywhere else, and re-downloading the model is billed pod time.
- **The Pod**: nothing beyond the volume, if one was attached. If it was not, everything written inside the container was already lost on the first restart. Both URLs die with it, chat and API, so any machine running the report's Claude Code block loses its connection; a rebuild issues a new pod ID and a new key, meaning a new report.

If the user has chat history worth keeping, Open WebUI can export conversations from its own settings before teardown. Offer that once, then proceed.

## 5. Partial teardown

Two combinations worth offering rather than all-or-nothing:

- **Destroy the pod, keep the volume.** The hourly rate stops. Every conversation, account and the cached weights survive, for the volume's small monthly cost. Rebuilding later is one `pod create` and the model does not re-download. **This is what "pause this" means.**
- **Destroy both.** Everything is gone, including the chat history. Only when they are finished for good.

Default to the first when the user says "pause", "stop" or "turn it off". Ask which they meant if it is ambiguous. Since the interface now lives on the pod, destroying it takes the UI down too: say that, because with the volume kept it comes back exactly as it was.
