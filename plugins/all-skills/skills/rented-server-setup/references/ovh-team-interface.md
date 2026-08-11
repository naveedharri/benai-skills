# Route A, team shape: Open WebUI on an OVH VPS

The team variant of Route A. One shared URL, same Open WebUI experience as the pod, but the model stays per-token on AI Endpoints. Everything is OVH Groupe SAS, one company, one jurisdiction, so the one-processor story survives.

```
team ──HTTPS──► Open WebUI on OVH VPS        ~€5/mo, CPU only, always on
                      │ per-token API, TLS
                      ▼
                OVH AI Endpoints, Gravelines  $0 idle, cents per 1M tokens
```

**Verification status: written 6 August 2026, not yet verified against a real OVH account.** The endpoint side is verified; the VPS provisioning and install below are not. Verify each command before running it, then fix this file in the same session and say you did. The Open WebUI wiring itself follows `install-openwebui`, which is verified.

## Contents
1. When to build this
2. The VPS
3. Install and wire
4. The key gotcha
5. What changes against solo Route A

## 1. When to build this

The "who will use it" answer is a team and the fork chose Route A. Solo users skip this file; they point their own app at the endpoint (`ovh-endpoints.md` section 5).

Still not this build: single tenancy, or a model outside the OVH catalog. Those stay Route B.

## 2. The VPS

The user creates it in the OVHcloud Manager, same consent pattern as the API key: OVH's ordering API is cart-based and not worth automating.

- Smallest VPS tier is enough. Open WebUI without local models is a light FastAPI app; the GPU work happens on AI Endpoints.
- Pick an **EU location** and record it; it goes in the data flow table as where chat history lives.
- Ubuntu LTS. The user gives you SSH access; everything after that is yours.

The VPS bills monthly whether used or not. Small, but say it at the gate: Route A's "zero idle" line no longer holds in this shape, it becomes "about €5 a month idle".

## 3. Install and wire

On the VPS, over SSH. Docker route, matching `install-openwebui`:

```bash
docker run -d --name open-webui --restart always \
  -p 127.0.0.1:8080:8080 \
  -v open-webui:/app/backend/data \
  -e OPENAI_API_BASE_URL='https://oai.endpoints.kepler.ai.cloud.ovh.net/v1' \
  -e OPENAI_API_KEY="$OVH_AI_ENDPOINTS_KEY" \
  -e OLLAMA_BASE_URL='' \
  -e ENABLE_SIGNUP=false \
  -e WEBUI_SECRET_KEY="$(openssl rand -hex 32)" \
  -e SCARF_NO_ANALYTICS=true -e DO_NOT_TRACK=true -e ANONYMIZED_TELEMETRY=false \
  ghcr.io/open-webui/open-webui:main
```

HTTPS in front, Caddy is the short path:

```bash
# /etc/caddy/Caddyfile — Caddy fetches and renews the certificate itself
<DOMAIN_OR_VPS_HOSTNAME> {
    reverse_proxy 127.0.0.1:8080
}
```

- Open WebUI binds to loopback; **Caddy on 443 is the only exposed door.** Same one-door principle as the pod.
- OVH VPSes ship a hostname like `vpsXXXX.ovh.net` that works for the certificate if the user has no domain.
- First visit creates the admin account. The user does that themselves before the URL is shared, exactly as on the pod. Signup stays off; the admin creates the team's accounts.
- Prove it end to end: sign in through the HTTPS URL, send one real prompt, show the reply. Same standard as everywhere: a login page loading is not success.

## 4. The key gotcha

**Open WebUI cannot use the anonymous tier.** It always sends `Authorization: Bearer <key>`, and OVH returns 403 to a made-up key (verified 6 August 2026). So this shape needs a real API key from the start; the keyless trial only exists for raw curl. An empty model dropdown here is a 403 problem before it is anything else; see `troubleshooting.md` sections 1 and 9.

## 5. What changes against solo Route A

| | Solo | Team on VPS |
|---|---|---|
| Idle cost | zero | ~€5/mo, the VPS |
| Chat history | user's own apps | **the VPS disk, named OVH location** |
| Teardown | revoke the key | delete the VPS too; history dies with it |
| Data flow table | 5 rows | add: history at rest on the VPS, TLS terminates at Caddy on the VPS |
| Report | endpoint layout | add the URL card, admin steps and a real teardown card |

Chat history moving server-side is the reviewer-relevant change: row 4 of the Route A data flow table stops saying "nowhere" and names the VPS location. Update it; do not hand over the solo paragraph for a team build.
