# PandaDoc API reference (the endpoints this system uses)

This is the **direct API** path (`proposal.pandadoc.transport: api`). If you use the **connector** transport instead, you do not touch these endpoints or a key at all: the native PandaDoc connector exposes equivalent tools (`get_template`, `create_document`, `get_document_status`, `get_document_details`, `delete_document`) and is authenticated for you. The connector works in Claude Desktop and Claude Code; the direct API below needs a shell, so it is Claude Code only. Prefer the connector.

Base url: `https://api.pandadoc.com/public/v1`
Auth header on every call: `Authorization: API-Key <your key>`
Official docs: https://developers.pandadoc.com/reference/about

You only need four endpoints.

## 1. List templates (find your template id)

`GET /templates`

Returns your templates with their ids. Use it to confirm your key works and to find the id of the proposal template you built.

## 2. Template details (the introspection call, the important one)

`GET /templates/{id}/details`
Docs: https://developers.pandadoc.com/reference/template-details

Returns everything the setup wizard needs to make the engine match your template:
- Basic info (name, author)
- Roles (you want the signer role name)
- All fields with values
- All tokens with values
- Pricing information (pricing tables, products, quotes)
- Content placeholders and metadata

The wizard reads the exact token names and the pricing table name from here and writes them into `config/pandadoc.md`. This is what prevents empty-bracket documents: the engine uses your real names, not assumed ones.

## 3. Create a document from the template (the draft)

`POST /documents`
Docs: https://developers.pandadoc.com/docs/create-document-from-template

Body includes `template_uuid`, `recipients` (your signer role, the prospect, `signing_order: 1`), `tokens` (one entry per token, names matching the template exactly), and `pricing_tables` (name matching exactly, row `data` keys lowercase `name`/`price`/`qty`).

The document is created as a draft. After creating, poll `GET /documents/{id}` until `status` is `document.draft`.

CRITICAL: this system never calls `POST /documents/{id}/send`. Proposals are drafts you review and send yourself from the PandaDoc UI.

## 4. Document details (verify the draft rendered correctly)

`GET /documents/{id}/details`
Docs: https://developers.pandadoc.com/reference/document-details

Call this after creating a draft to confirm every token populated, no empty brackets remain, the pricing is right, and the recipient is assigned. If a token shows empty, its name in your config does not match the template. Re-check against the template-details call.

## Two gotchas confirmed in testing

**Introspection returns more tokens than are placed.** The template-details call lists every token DEFINED in the template (we saw 49) even though far fewer are visibly placed (34), and it can include one blank-named token (`""`). Fill every NAMED token you can map, skip the empty-named one, and do not worry about extras: PandaDoc ignores tokens it has no slot for. Filling only the tokens you recognize is what leaves blanks.

**A draft has no shareable link.** There is no `view_url` on a draft, and `POST /documents/{id}/session` returns 400 ("Cannot create session ID for a document in document.draft status") until the document leaves draft. So the recap email cannot contain a real proposal link at draft stage. The system puts a placeholder in the email and tells you to send/share the proposal in PandaDoc first, then paste the generated link in. Do not paste the owner app url, the prospect cannot open it.

## Editing your template later

You edit the template itself in the PandaDoc web editor (add or rename tokens, change static text, adjust the pricing table). The API reads templates, it does not redesign them. Any time you rename or add a token in the editor, re-run the setup wizard's introspection step so `config/pandadoc.md` stays in sync. A renamed token that the config still references by the old name will silently render empty.

## The silent-failure rules (worth repeating)

- Token names are case- and space-sensitive. A mismatch is dropped with no error.
- The pricing table name must match exactly or your price is ignored.
- Pricing row keys must be lowercase. Uppercase triggers a 400.
- "Payer" is not an API role. It is a billing toggle in the PandaDoc UI only.
