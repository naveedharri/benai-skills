# Teardown

A first class entry point, not a footnote. `/rent-my-gpu teardown` runs this.

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
| RunPod Pod | Always, from creation until destroyed | The whole hourly rate. Up to ~$344 a day at the frontier tier |
| RunPod Serverless endpoint | Per second of generation, plus any active workers | Near zero at 0 active workers. Real money if min workers was raised above 0 |
| RunPod network volume | **Always, even with nothing running** | Small but permanent. The one people miss |
| Railway service | Continuously, on usage | About $5 a month plus what it consumes |
| Railway volume | Continuously | Small |

Two things users get wrong, so state both:

- **Stopping a Pod is not destroying it.** A stopped Pod can still bill for its storage, and its volume definitely does. Destroy, do not stop, unless the user specifically wants to keep it for later and understands it is still costing something.
- **A Serverless endpoint at 0 active workers costs effectively nothing**, so it is reasonable to leave in place if the user wants to come back. Say that rather than deleting reflexively. Check min workers first: if step 5 raised it above 0 to kill cold starts, it is billing like a Pod.

## 2. The order

Confirm before the first delete. List what will be destroyed and what data dies with it, then wait for a yes.

```
Teardown will destroy:

  RunPod Pod        <POD_ID>       $14.36/hr, stops immediately
  RunPod volume     <VOLUME_ID>    200GB, the cached model weights die with it
  Railway service   <SERVICE_ID>   Open WebUI
  Railway volume    <VOLUME_ID>    all chat history, accounts and uploaded documents

The chat history and any uploaded documents cannot be recovered.

Proceed?
```

Then, in this order:

1. **RunPod Pod or Serverless endpoint.** The hourly rate stops here. Do this first even if a later step might fail.
2. **RunPod network volume.** Only after the compute is gone, or the delete is refused as in-use.
3. **Railway service.**
4. **Railway volume.**
5. **Railway project**, only if this skill created it and it holds nothing else.

Discover the exact delete commands from the provider skills or `--help`. Do not hardcode them from memory here; that is how teardown silently fails.

## 3. Verify, do not assume

A delete call returning success is not proof. List the resources afterwards and confirm each ID is absent.

```bash
# after each delete, confirm absence rather than trusting the response
runpodctl get pod          # the pod ID must not appear
runpodctl get volume       # the volume ID must not appear
railway status             # the service must not appear
```

If an ID is still present, say so plainly and retry once. If it persists, tell the user exactly where to click in the provider console and what to look for. An unverified teardown that reports success is worse than no teardown, because the user stops watching the invoice.

End by stating the account is clear, and name what remains if anything does. If a Serverless endpoint was deliberately left at 0 workers, say it is still there, still free, and how to remove it later.

## 4. What dies with each resource

Say this before deleting, not after.

- **RunPod volume**: the cached model weights. Re-downloading is 46 to 149 GB depending on the model, and on a Pod that download time is billed.
- **Railway volume**: everything at `/app/backend/data`. Chat history, user accounts, settings, uploaded RAG documents, vector embeddings, cached Whisper and embedding models. There is no copy anywhere else.
- **RunPod Pod**: nothing beyond the volume, if a volume was attached. If it was not, anything written inside the container is already gone on any restart.

If the user has chat history worth keeping, Open WebUI can export conversations from its own settings before teardown. Offer that once, then proceed.

## 5. Partial teardown

Two combinations worth offering rather than all-or-nothing:

- **Stop the GPU, keep the interface.** Destroy the Pod or endpoint, leave Railway running. Open WebUI stays up with all history intact and simply has no model to talk to. Costs about $5 a month. Right for someone who will come back next week. Re-pointing it later is one variable change, unless it was a Pod, in which case the proxy URL will have changed.
- **Keep the GPU, drop the interface.** Rare, and only makes sense if they are switching to using the endpoint from code rather than a browser. The endpoint keeps working on its own.

Default to the first when the user says "pause this" rather than "delete this". Ask which they meant if it is ambiguous. "Turn it off" usually means stop the billing, not destroy the history.
