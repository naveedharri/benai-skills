# Cloud OS — comparison

**Team** = true multiplayer (not just folder sharing). **Realtime** = instant, no
sync delay. **Local** = real files on disk. **MCP** = usable connector available.

| Option                 | Team | Sync | Realtime | Local | MCP |
|------------------------|:----:|:----:|:--------:|:-----:|:---:|
| Google Drive           |  ❌  |  ✅  |    ❌    |  ✅   | ✅  |
| iCloud                 |  ❌  |  ✅  |    ⚠️    |  ✅   | ❌  |
| OneDrive               |  ❌  |  ✅  |    ❌    |  ✅   | ✅  |
| Dropbox                |  ❌  |  ✅  |    ❌    |  ✅   | ❌  |
| Notion                 |  ✅  |  ✅  |    ✅    |  ❌   | ✅  |
| Obsidian Sync/Relay ⭐ |  ✅  |  ✅  |    ✅    |  ✅   | ✅  |

Notes:
- iCloud realtime ⚠️ = "near-realtime" but delayed + no conflict handling.
- Consumer clouds are single-user, multi-*device* — concurrent edits = conflicts.
- **Notion** is the only option here that is realtime + multiplayer, but it is **cloud-only**
  (no local files) — pages/databases live in Notion, reached via the connector. It takes the
  **Notion route** in this skill (pages + databases), not the folder route.
- For true team + realtime + local, recommend Obsidian Sync/Relay (Local OS tier).
- MCP: Drive ✅ and OneDrive ✅ (via Microsoft 365) have connectors; iCloud ❌ and
  Dropbox ❌ do not (point a filesystem MCP at the local folder if needed).
