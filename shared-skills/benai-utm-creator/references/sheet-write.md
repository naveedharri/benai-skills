# Writing the rows into the UTM creator Google Sheet

The CSV is always produced with zero access. Writing into the "UTM creator" Google Sheet needs one of the paths below. Pick the first that is available; if none is, tell the user which access to grant and stop.

## Path A: Google Sheets connector / API (preferred, most reliable)
If a Google Sheets tool is connected (check with ToolSearch for a sheets tool), append the six rows directly:
- Append to the "YT bitly" tab in the exact column order (`Long URL, Backhalf, Tags, Title, UTM Source, UTM Medium, UTM Campaign, UTM Term, UTM Content`).
- If the sheet instead relies on entering just the title into the "Youtube" tab and letting its formulas cascade, write only the title cell and let the sheet compute. Confirm with the user which model their sheet uses before writing.
This path is not connected by default. If the user wants it, ask them to add a Google Sheets connector (or share the sheet with an account that has one).

## Path B: drive the open sheet in Chrome (works now, UI automation)
Use the Claude in Chrome tools (`mcp__claude-in-chrome__*`). Load them with ToolSearch first, then:
1. `tabs_context_mcp` to find the already-open "UTM creator" tab, or `navigate` to the sheet URL the user gives.
2. Paste the CSV rows into the "YT bitly" tab (select the first empty cell of the target block, then type/paste), or enter the title into the "Youtube" tab if that is how their sheet is built.
3. Read back the affected cells to confirm the write landed.
Ask the user for the sheet URL if it is not already open. Keep to the one tab; do not click destructive controls.

## Path C: computer use (drives the app exactly as demonstrated)
If computer use is enabled in Settings, the skill can operate the sheet UI directly like the recording did. Slower and less reliable than A; only use if the user prefers it.

## Recommend
Recommend Path A (grant Sheets access). It is the fastest and most reliable, and the skill's CSV maps 1:1 to the tab columns. Path B works today without new setup but is UI automation. Always confirm with the user before the first write to a real sheet.
