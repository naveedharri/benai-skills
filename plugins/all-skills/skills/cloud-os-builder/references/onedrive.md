# OneDrive — Cloud OS

## Topic
- Microsoft's cloud storage; built into Windows, bundled with Microsoft 365.
- Desktop app syncs a local folder, like Drive.
- "Files On-Demand" keeps files as cloud-only placeholders until opened.
- Strong on desktop; mobile is its real weakness for Obsidian.

## Advantages
- Free tier with a Microsoft account; generous with Microsoft 365.
- Deep Windows integration, works out of the box.
- Real local copy on desktop; has an MCP connector (via Microsoft 365).

## Disadvantages
- Mobile is the dealbreaker — Obsidian mobile can't open a vault inside OneDrive.
- Files On-Demand can break vaults → force "Always keep on this device".
- Sync delay; conflict copies; the `.obsidian` config folder can sync slowly.

## How to set up
1. Install the OneDrive desktop app, sign in.
2. Create the OS folder inside the OneDrive folder.
3. Right-click the folder → "Always keep on this device".
4. Drop in the shared structure (`templates/`).
5. Repeat on other desktops. Mobile needs a different solution.

📺 Video: How To Sync Obsidian With OneDrive [2026 Guide] — https://www.youtube.com/watch?v=GR3ixYeMK6k
