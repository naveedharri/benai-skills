# PandaDoc config (example)

Only needed if `proposal.backend` is `pandadoc` in `config/offer.md`. If you use the Google Docs backend, ignore this file.

> [!important]
> The token names below are EXAMPLE names only. The `setup-post-disco` wizard OVERWRITES them by introspecting YOUR template, so the real config will match whatever you build or already have, with your own section and token names. Do not treat this list as a fixed schema.

The wizard generates this file by reading YOUR PandaDoc template (the template-details endpoint over the API, or the `get_template` call over the native connector), so the token names match your real template exactly. Copy to `pandadoc.md` in this folder and the engine reads that. Do not hand-copy token names from another account's template: PandaDoc silently drops any token whose name does not match, and the document renders with empty brackets.

```yaml
transport: "connector"                 # mirrors offer.proposal.pandadoc.transport: connector | api
api_key_env: "PANDADOC_API_KEY"        # only used when transport is api
template_id: "REPLACE_WITH_YOUR_TEMPLATE_ID"
role_name: "Client"                    # the signer role defined in your template
pricing_table:
  name: "Pricing Table 1"              # must match your template exactly
  row_keys: ["name", "price", "qty"]   # lowercase, do not change

# IMPORTANT: the introspection call returns ALL tokens DEFINED in the template
# (often more than are visibly placed), and may include a blank-named token ("").
# Rule: fill every named token you can map, skip any empty-named token, and do not
# worry about extras (PandaDoc ignores tokens it has no slot for). Never leave a
# mappable token blank just because you did not recognize it.
#
# The names here are EXAMPLES (neutral scope-block tokens). Yours come from your
# real template after the wizard introspects it.
tokens:
  header:
    - name: "Client Name"            # prospect full name
    - name: "Company Name"           # legal company name
    - name: "Date"                   # today, "Month DD, YYYY"
    - name: "Time frame"             # from offer.duration
  intro:
    - name: "Scope of work body"
    - name: "Success Criteria body"
  scope_blocks:
    - name: "Block 1 Description"
    - name: "Block 1 Details"            # bullets only
    - name: "Block 1 Outcome"
    - name: "Block 2 Description"
    - name: "Block 2 Details"
    - name: "Block 2 Outcome"
    - name: "Block 3 Description"
    - name: "Block 3 Details"
    - name: "Block 3 Outcome"
  whats_included:
    - name: "Dedicated Support body"
    - name: "Strategy Sessions body"
    - name: "Documentation body"
    - name: "Post-Engagement Support body"
  notes:
    - name: "Tech Stack Note body"
  terms:
    - name: "TC 1 Purpose"
    - name: "TC 2 Scope"
    - name: "TC 3 Payment"
    - name: "TC 4 IP"
    - name: "TC 5 Confidentiality"
    - name: "TC 6 Governing Law"
    - name: "TC 7 Acceptance"
    - name: "TC 8 Refund"

# Tokens that are STATIC in your template (headers, labels, block intros).
# Do NOT pass these or repeat their text inside other tokens, or it renders twice.
static_labels:
  - "Core functions:"
  - "Outcome:"
  - "block intros (the one-line text before each Details token)"
  - "What's Included subheaders"
  - "Tech Stack labels"

# Set by the wizard after it checks the key/connector. Sandbox documents are
# watermarked and carry a [DEV] prefix in the title. They are NOT real client docs.
key_environment: "unknown"             # sandbox | production | unknown
```
