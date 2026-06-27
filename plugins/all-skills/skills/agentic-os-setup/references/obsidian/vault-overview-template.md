---
type: dashboard
scope: overview
status: active
cssclasses:
  - command-center
tags: [dashboard, command-center, overview]
---

```dataviewjs
const { dashboard } = customJS;
await dashboard.render(dv, { scope: "overview" });
```
