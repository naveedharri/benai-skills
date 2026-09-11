# Step 5: Verify every link

Six links, each checked for the destination it actually reaches. Do not accept "the Bitly page
listed it" as proof.

## Load browser tools (if needed)

```
ToolSearch "select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__find,mcp__claude-in-chrome__form_input,mcp__claude-in-chrome__file_upload,mcp__claude-in-chrome__computer"
```

## Five of six: check from the shell

```bash
for s in accelerator agency cowork aioperator kityout; do
  printf "%-12s " "$s"
  curl -s -o /dev/null -w "%{http_code}  %{url_effective}\n" -L --max-time 12 \
    "https://c.benai.co/<code>-$s"
done
```

Pass criteria, both required:

| Backhalf | Must resolve to |
|---|---|
| `-accelerator` | `benai.co/accelerator` |
| `-agency` | `benai.co/custom-solutions` |
| `-os` | `calendly.com/ben-ai-aryan/business-os-setup` |
| `-aioperator` | `calendly.com/ben-ai-aryan/1-on-1-program` |
| `-kityout` | `benai.co/accelerator-offer` |

> [!important] The Cowork row was `-cowork` until 2026-08-26
> New videos use `-os`. Anything imported before that date carries `-cowork` and stays that
> way, because renaming a live backhalf breaks it wherever it has already been published. When
> verifying an older video, expect `-cowork` and do not treat it as a fault.

And the resolved URL must still carry `utm_campaign=<this video's slug>`. A 200 on the wrong
campaign means the backhalf was reused from an older video: stop and report it.

## The free link: browser only

`benai.kit.com` returns **403 to this container**, browser user-agent included, so a shell check
cannot verify it. That 403 is Kit blocking the datacenter IP, not a broken page. Do not report it
as a failure and do not retry it from the shell.

Verify it two ways instead:

1. `mcp__Kit__get_landing_page` on the new page: `public_url` ends in `<code>-free` and
   `last_published_at` is set.
2. `navigate` to `https://c.benai.co/<code>-free` in Chrome and `read_page`. Confirm the headline
   and button match what was set, and that the URL landed on `benai.kit.com/<code>-free`.

If Chrome is unavailable, say the free link is unverified rather than assuming it works. It is the
one link in the set that a wrong slug breaks invisibly.

## Report

A table of all six: short link, resolved destination, campaign matches, pass or fail. Name any
failure explicitly. A description shipped with one dead link is worse than a delayed publish.
