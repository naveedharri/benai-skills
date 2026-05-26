---
type: dashboard
scope: team
status: active
cssclasses:
  - command-center
tags: [dashboard, command-center, team]
---

```dataviewjs
const { dashboard } = customJS;
await dashboard.render(dv, { scope: "team" });
```
