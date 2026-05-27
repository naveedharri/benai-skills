---
type: dashboard
scope: profile
profile: {{PROFILE_NAME}}
status: active
cssclasses:
  - command-center
tags: [dashboard, command-center, profile]
---

```dataviewjs
const { dashboard } = customJS;
await dashboard.render(dv, { scope: "profile", name: "{{PROFILE_NAME}}" });
```
