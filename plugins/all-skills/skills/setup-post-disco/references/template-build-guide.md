# Build or bring your PandaDoc proposal template

Only relevant if you chose the **PandaDoc** proposal backend. If you chose Google Docs, skip this entirely, there is no PandaDoc template to build.

The follow-up skill fills a PandaDoc template you own. Use the reference PDF at the package root (`proposal-template-reference.pdf`) as a model: it is a finished, working proposal template. You can bring a template you already have, copy the reference structure, or design your own. All three work, because the setup wizard reads whatever template you point it at and matches the engine to it.

The reference structure (header and introduction, success criteria, the scope blocks, what is included, pricing, and terms) is the BenAI-recommended proposal structure. It was extracted from a real proposal that has converted across very different products, so the spine is proven and only the content changes per offer. If you do not already have a proposal, copy this one.

## Three paths

**Path A: match the reference (fastest from scratch).** Recreate a template in PandaDoc using the field names listed below. If your token names match these, the engine works with almost no config tweaking.

**Path B: design your own (most flexible).** Build whatever proposal you want with your own sections and token names. The wizard's introspection step (template-details API call) reads your real token names and writes them into config. You are not locked into the reference structure.

**Path C: bring your own existing template (the common case).** Most reps already send a proposal. If you have a PandaDoc template, a Google Doc, or a Word/PDF you reuse, do NOT rebuild it. Point `assets.proposal_template` in `config/offer.md` at it (status `have_it`, its `kind`, and its `location`), and:

- **You already have a PandaDoc template:** give the wizard its template id. The wizard introspects it and writes `config/pandadoc.md` from your real token names. Nothing to build.
- **You have a Google Doc proposal:** use the `google_docs` backend instead and set `google_docs.template_doc_id` to that Doc, so every proposal copies it. No PandaDoc template needed.
- **You have a Word/PDF or a structure in your head:** either rebuild it once as a PandaDoc template (Path A or B below) or use the `google_docs` backend building fresh from the engine's markdown shaped to your structure. Capture the structure in `assets.proposal_template.notes` so the engine matches it.

The rest of this guide is for Paths A and B, when you are building a PandaDoc template. Skip it if you took Path C with an existing PandaDoc template, the wizard just introspects yours.

For a PandaDoc template you build, it needs three things: one signer role, named text tokens, and one pricing table.

## How tokens work in PandaDoc

A token is a named variable in the template, written like `[Client Name]` in the editor, that the API fills at create time. In the PandaDoc editor you add tokens from the Tokens panel and give each a name. The name is what the API matches on, exactly, including case and spaces.

Keep static text (section headers, labels like "Core functions:", block intros) as plain template text, NOT inside tokens. Only the parts that change per client become tokens. If you put a label inside a token and also leave it static, it renders twice.

## Reference field set (Path A)

These are neutral, generic scope-block names so they fit any offer. Use your own names if you prefer (Path B), the wizard reads whatever you choose.

A single signer role named `Client`.

Header and meta tokens:
- `Client Name`, `Company Name`, `Date`, `Time frame`

Intro tokens:
- `Scope of work body`, `Success Criteria body`

Scope blocks (the block header and the "Core functions:" / "Outcome:" labels stay static). The reference shows three, but your offer can have any number, add or remove blocks to match:
- `Block 1 Description`, `Block 1 Details`, `Block 1 Outcome`
- `Block 2 Description`, `Block 2 Details`, `Block 2 Outcome`
- `Block 3 Description`, `Block 3 Details`, `Block 3 Outcome`

The `Details` token carries bullets only; the block title and one-line intro stay static.

What is included (subheaders stay static):
- `Dedicated Support body`, `Strategy Sessions body`, `Documentation body`, `Post-Engagement Support body`

Notes (labels stay static):
- `Tech Stack Note body`

Terms and conditions (clause titles stay static):
- `TC 1 Purpose`, `TC 2 Scope`, `TC 3 Payment`, `TC 4 IP`, `TC 5 Confidentiality`, `TC 6 Governing Law`, `TC 7 Acceptance`, `TC 8 Refund`

One pricing table named exactly `Pricing Table 1` with a single row.

## Pricing table

Add a pricing table and name it. Note the exact name, you will need it in config. The skill fills one row: a line item name, a price, and a quantity of 1. Even if data merge is off in the template, passing the pricing table at create time overrides the row. This works for a one-time fee, a recurring line, or a deposit line, the engine renders the row to match `pricing.model` in your offer config.

## After you build it

1. Note the template id (from the template url, or `GET /templates`).
2. Tell the setup wizard you are done and give it the id.
3. The wizard calls `GET /templates/{id}/details`, reads your real token names, and writes `config/pandadoc.md`.
4. The dry run creates one test draft and checks for empty brackets. Empty brackets mean a name mismatch: re-introspect and fix.

## Tips

- Do not use em dashes in the static template text. The whole system avoids them.
- Keep bullets as real content that the token fills with `- item\n- item`. PandaDoc renders token text as plain text, so the hyphens become the bullets.
- If you later rename a token in the editor, re-run introspection so config stays in sync.
