# Step 2: Extract and Deduplicate Engagers

Extract all unique engagers (commenters + reactors) into a flat, deduplicated list. This is critical, one row per person, not one row per engagement.

Note: The field names below are examples. Always use the actual field names discovered from sampling the dataset in Step 1.

```python
import csv, json

# Load dataset
with open('dataset.json', 'r') as f:
    data = json.load(f)

# Separate by type
posts = [d for d in data if d.get('type') == 'post']
reactions = [d for d in data if d.get('type') == 'reaction']
comments = [d for d in data if d.get('type') == 'comment']

# Build post content lookup for mapping engagements back to posts
# (field names may vary, check actual output from Step 1 sampling)
post_lookup = {}
for p in posts:
    post_id = p.get('postId') or p.get('id') or ''
    post_lookup[post_id] = (p.get('text') or p.get('postText') or '')[:100]

# Deduplicate: one entry per unique LinkedIn URL
seen_urls = set()
engagers = []

for r in reactions:
    url = (r.get('profileUrl') or r.get('linkedinUrl') or '').strip()
    if not url or url in seen_urls:
        continue
    seen_urls.add(url)
    engagers.append({
        'Name': (r.get('fullName') or r.get('name') or '').strip(),
        'Position': (r.get('headline') or r.get('position') or '').strip(),
        'LinkedIn URL': url,
        'Engagement Type': r.get('reactionType') or 'Like',
        'Comment Content': '',
        'Post Text Content': post_lookup.get(r.get('postId', ''), ''),
    })

for c in comments:
    url = (c.get('profileUrl') or c.get('linkedinUrl') or '').strip()
    if not url or url in seen_urls:
        continue
    seen_urls.add(url)
    engagers.append({
        'Name': (c.get('fullName') or c.get('name') or '').strip(),
        'Position': (c.get('headline') or c.get('position') or '').strip(),
        'LinkedIn URL': url,
        'Engagement Type': 'Comment',
        'Comment Content': (c.get('commentText') or c.get('text') or '')[:200],
        'Post Text Content': post_lookup.get(c.get('postId', ''), ''),
    })
```

Report to the user:

```
Extracted [X] unique engagers ([C] commenters + [R] reactors) from [T] total engagements across [N] posts.
```
