# Steps 3 and 4: Drive YouTube Studio via Claude in Chrome

Studio has no API for drafts, so this runs in the browser. Use the Claude in Chrome MCP
tools only. Never host-level clicks, never keystroke replay.

## Load the tools

One call, everything at once:

```
ToolSearch "select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__find,mcp__claude-in-chrome__form_input,mcp__claude-in-chrome__file_upload,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__tabs_create_mcp"
```

Then `tabs_context_mcp` with `createIfEmpty: true` and work in that tab. Do not reuse tab
IDs from a previous session.

## Open the draft

Direct URL, no clicking through the content list:

```
https://studio.youtube.com/video/<VIDEO_ID>/edit
```

If you only have the title, load `https://studio.youtube.com/channel/UC3K7KN8B_ierAXvrxVNnbZQ/videos/upload`
and `find` the draft row by title.

Studio is a heavy SPA. After every navigation, `read_page` before acting. If the editor
dialog has not rendered, wait and re-read rather than clicking blind.

Never trigger a native dialog. Do not click the thumbnail "Add thumbnail" tile, the
Products button, or anything that opens an OS file picker: a modal blocks every
subsequent tool call. Upload through the hidden `input[type=file]` instead (below).

## Step 3a: Replace the description

1. `find` the description box. It is a `#textbox` contenteditable inside the
   `ytcp-video-description` element, not a `<textarea>`.
2. Clear it and set the new text in one shot. `form_input` is the first choice. If it
   refuses the contenteditable, use `javascript_tool` to set the text and dispatch an
   `input` event so Studio's autosave notices:

```js
const box = document.querySelector('ytcp-video-description #textbox');
box.focus();
document.execCommand('selectAll');
document.execCommand('insertText', false, DESCRIPTION_TEXT);
```

`insertText` via execCommand is what makes Studio register the change. Setting
`.textContent` directly leaves the field looking right and saving nothing.

3. Confirm: re-read the box, check the character counter moved off `0/5000`, and wait for
   the header chip to go from "Saving..." to "Saved as private". Do not proceed while it
   still says Saving.

## Step 3b: Tags

Tags are under "Show more" on the details page, in a chip input. `find` the tags field,
paste the 500-character string from `youtube-chapters-tags` as one comma-separated blob,
then confirm the counter. If the field is not visible, click "Show more" first.

## Step 4: The A/B test

1. Click the `A/B Testing` button under the title field.
2. In the dialog, select the **"Title and thumbnail"** tab (not "Title only", not
   "Thumbnail only"). Confirm the tab is active before typing: the required-field notice
   at the bottom should read "1st title and thumbnail are required".
3. Variants: **2**.
4. Titles: variant 1 = first Notion caption, variant 2 = second. Use `form_input` per
   field. Each field has its own 0/100 counter, so confirm both after typing.
5. Thumbnails: for each variant tile, `read_page` to get the ref of that tile's hidden
   `input[type=file]`, then:

```
file_upload
  paths: ["/mnt/user-data/outputs/thumbs/variant-1.png"]
  ref: <ref of variant 1's file input>
  tabId: <tab>
```

   One file per call. Wait for the tile to stop showing "Uploading..." and render the
   image before doing the second one.

   If `file_upload` rejects the container path, fall back to fetching the image inside the
   page and dropping it on the input:

```js
const r = await fetch(THUMB_URL);           // the presigned Notion S3 URL, still fresh
const f = new File([await r.blob()], 'variant-1.png', {type: 'image/png'});
const dt = new DataTransfer(); dt.items.add(f);
const input = document.querySelectorAll('input[type=file]')[N];
input.files = dt.files;
input.dispatchEvent(new Event('change', {bubbles: true}));
```

   If both paths fail, stop and tell the user the two thumbnails are downloaded and ready,
   and that this is the one step that needs either a connected folder or their hand.

6. Screenshot the dialog. Show the user both titles and both thumbnails in place. **Wait.**
7. On their go, click `Set test`.
8. Confirm: the details page header now shows both titles under "A/B Testing titles", and
   the test reads as set. Note that Studio marks a private draft's test "Ineligible" until
   the video goes public. That is expected, not a failure. Say so rather than retrying.

## What not to touch

Visibility, the Publish button, scheduling, monetization, Products, end screens. This
skill hands back a draft that is ready. Ben ships it.
