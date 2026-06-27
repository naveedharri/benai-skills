---
name: infographic-old
description: "Basic infographic generator. Just tell me what you want and I'll make it."
---

# Infographic Generator

Make infographics with AI.

## How to Use

1. Tell me what you want
2. I'll generate it
3. Tell me if you want changes

## Generate

When user gives content, create a prompt like:

```
Create an infographic about [topic] with [their content]. Make it look good. 4:5 ratio.
```

Call `generate_image` with the prompt. Show the result.

If they want edits, use `edit_image` or `continue_editing`.

Done.
