# Connector / MCP Decision (Step 3, when a live tool is involved)

Apply this before adding any connector or MCP to a skill. Adding one is a decision, not a default: it floods context with schemas and verbose responses (token burn), and the agent often loses the skill's process after a large tool call.

## Decide in order. Stop at the first that fits.
1. Do you need the connector at all? If the data is fairly stable (ICP, brand voice, product list, pricing, templates), put it in a reference file and use no connector. Check this first.
2. If you need live data, put the tool call behind a subagent. The subagent does the heavy interaction and returns a small, clean result; the main skill keeps its process context intact.
3. If a subagent is not possible, make the skill's scope extremely tight: one small action with the tool and nothing else.

## Rule
No connector is better than a connector behind a subagent, which is better than a connector inside a broad skill. Avoid the last.
