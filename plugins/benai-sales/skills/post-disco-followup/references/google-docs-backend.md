# Google Docs backend

How to create the proposal as a Google Doc. Used when `proposal.backend` is `google_docs`. This path produces a real, prospect-shareable link immediately, which sidesteps the PandaDoc draft-link limitation.

## Tooling

This backend uses the Google Workspace CLI (`gws`). If `gws` is not installed, the setup wizard runs the bundled `google-workspace-cli-installer-guide` skill first. Do not attempt this backend without `gws` working. The `gws docs`, `gws drive`, and `gws docs_write` commands handle creation, content, and sharing.

(If a user has a Google Docs MCP connector instead of the CLI, the equivalent connector tools work too. The CLI is the default because it also works for scheduled/autonomous runs.)

## Two ways to build the Doc

1. **Fresh Doc from the proposal markdown (default).** Create a new Google Doc and write the filled `<slug>/proposal-<slug>.md` content into it. Markdown headings and bullets map to Doc structure. Simple and always works.
2. **Copy a template Doc (if `google_docs.template_doc_id` is set).** Copy that Doc, then replace its placeholders with the client-specific values. Use this when the user has a branded, formatted Google Doc proposal template they want every proposal to match. Placeholder convention in their template: `{{Client Name}}`, `{{Company Name}}`, `{{Pricing}}`, etc. Replace each with the filled value.

## Steps

1. Create or copy the Doc:
   - Fresh: `gws docs create` (or equivalent) with the proposal title `<Legal Company Name> - <program_name> Proposal`, then write the proposal content.
   - Copy: duplicate `google_docs.template_doc_id`, then find-and-replace its placeholders.
2. If `google_docs.dest_folder_id` is set, move the Doc into that Drive folder.
3. Set sharing per `google_docs.share` (default `anyone_with_link_view`) so the prospect can open it without a Google account barrier. Confirm the link is view-accessible.
4. Capture the Doc URL. This is the prospect-facing proposal link.

## Link handling

The Google Doc URL is valid immediately and goes straight into the email draft as the "View the proposal here" hyperlink (see `references/email-format.md`). No placeholder needed, unlike the PandaDoc backend.

## Notes

- The Doc is owned by the authenticated Google account (the same account `gws` is logged in as). Sharing makes it readable, ownership stays with the user.
- Nothing is emailed automatically. Creating and sharing the Doc is not the same as sending it. The user sends the recap email (with the Doc link inside) themselves.
- No em dashes in the proposal content.
- If sharing cannot be set to link-accessible (org policy blocks external sharing), tell the user in the confirmation so they can adjust sharing manually before sending.
