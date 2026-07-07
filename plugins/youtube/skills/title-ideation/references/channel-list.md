# Locked Comp Set (read at Phase 3 only)

Channel IDs are hardcoded so resolution never fails. Always include Ben's channel. Pass each subagent its own row.

| Channel | Handle | Channel ID | Notes |
|---|---|---|---|
| **Ben's own channel** | `@BenAI92` | `UC3KK7ENB_ierAXvrxVNnbZQ` | Highest-weight prior. His audience is the target. Always include. |
| Jeff Su | `@JeffSu` | `UCwAnu01qlnVg1Ai2AbtTMaA` | Productivity + AI tools, broad audience |
| Nick Saraev | `@nicksaraev` | `UCbo-KbSjJDG6JWQ_MTZ_rNA` | AI agency. "Build & Sell" framing is off-limits for our ICP titles |
| Nate Herk | `@nateherk` | `UC2ojq-nuP8ceeHqiroeKhBA` | n8n + AI automation, high cadence |
| Chase AI | `@Chase-H-AI` | `UCoy6cTJ7Tg0dqS-DI-_REsA` | Claude + n8n, direct competitor |
| Liam Ottley | `@LiamOttley` | `UCui4jxDaMb53Gdh-AZUTPAg` | AI agency. "Make money / build & sell" off-limits for our ICP |
| Itssssss_Jack | `@Itssssss_Jack` | resolve once and cache | Dev-niche, lower signal for our non-coder audience |
| Matt Pocock | `@mattpocockuk` | resolve once and cache | Dev tools, lower signal for our audience |

To resolve an unknown ID once: `searchVideos` with `type: "channel"`, take the `channelId`, write it into this table.

Swapping a channel: edit this table. The dev-niche channels are first to replace for the non-coder audience.
