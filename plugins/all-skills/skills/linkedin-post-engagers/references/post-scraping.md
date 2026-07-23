# Step 1: Scrape Posts with Engagement Data

Use the Apify actor `harvestapi/linkedin-profile-posts`. Follow the actor call pattern in `apify-operations.md` (schema first, timeout polling, sample before download, curl full dataset).

## Actor Input

After getting the input schema via `call-actor` with `step: "info"`, execute with `step: "call"` using this input shape:

```json
{
  "targetUrls": ["https://www.linkedin.com/in/handle1", "https://www.linkedin.com/in/handle2"],
  "maxPosts": 5,
  "scrapeComments": true,
  "scrapeReactions": true,
  "includeQuotePosts": true,
  "includeReposts": true
}
```

- `targetUrls`: Array of LinkedIn profile URLs
- `maxPosts`: Number of posts per profile (from user input)
- `scrapeComments`: Must be `true` to get commenters
- `scrapeReactions`: Must be `true` to get reactors

## Dataset Structure

The dataset contains mixed item types:

- **Posts** (type: "post"), the actual post content, metadata
- **Reactions** (type: "reaction"), people who liked/celebrated/etc.
- **Comments** (type: "comment"), people who commented, with comment text

You must separate these by type and map reactions/comments back to their parent post.

## Confirm Post Content

Before proceeding, verify that the expected number of posts were captured. Report to the user:

```
Scraped [N] posts from [M] profiles.
Post 1: "[first 60 chars of content]..." ([X] reactions, [Y] comments)
Post 2: ...
```

Wait for user confirmation before proceeding.
