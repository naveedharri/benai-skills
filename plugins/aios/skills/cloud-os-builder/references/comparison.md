# Cloud OS — comparison

**Team** = true multiplayer (not just folder sharing). **Realtime** = instant, no
sync delay. **Local** = real files on disk. **MCP** = usable connector available.

| Option                 | Team | Sync | Realtime | Local | MCP |
|------------------------|:----:|:----:|:--------:|:-----:|:---:|
| Google Drive           |  ❌  |  ✅  |    ❌    |  ✅   | ✅  |
| iCloud                 |  ❌  |  ✅  |    ⚠️    |  ✅   | ❌  |
| OneDrive               |  ❌  |  ✅  |    ❌    |  ✅   | ✅  |
| Dropbox                |  ❌  |  ✅  |    ❌    |  ✅   | ❌  |
| Obsidian Sync/Relay ⭐ |  ✅  |  ✅  |    ✅    |  ✅   | ✅  |

Notes:
- iCloud realtime ⚠️ = "near-realtime" but delayed + no conflict handling.
- Consumer clouds are single-user, multi-*device* — concurrent edits = conflicts.
- For true team + realtime + local, recommend Obsidian Sync/Relay (Local OS tier).
- MCP: Drive ✅ and OneDrive ✅ (via Microsoft 365) have connectors; iCloud ❌ and
  Dropbox ❌ do not (point a filesystem MCP at the local folder if needed).
