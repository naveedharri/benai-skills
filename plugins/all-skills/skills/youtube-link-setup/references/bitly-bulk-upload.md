# Importing the links into Bitly from the browser

This is the path for anyone without a `BITLY_TOKEN` in their environment, which is most
people. It is entirely point-and-click. Nobody types a command.

Demonstrated by Oskar Johnston to Juan on 2026-08-25 and confirmed working: five links
imported by hand, all five read back live with their UTM parameters intact.

Account: `ben@benai.co`. Group `Bp46bK7ywPJ`. Short domain `c.benai.co`.

## Before uploading anything

Check the backhalves are free. Open one in a browser tab:

    https://c.benai.co/<code>-accelerator

A 404 means the code is free and the import is clean. Anything that resolves means links for
this code already exist. Stop and report rather than creating duplicates.

## The click path

1. Go to `https://app.bitly.com` and confirm the account is `ben@benai.co`.
2. Click **Create new**.
3. Choose **Shorten a link**.
4. Choose **Bulk upload**.
5. Drag the CSV from `~/Downloads/` into the drop zone.
6. Click **Submit**.

The file takes a short while to process. Bitly shows the rows as they land.

## Then verify, and do not skip this

The CSV being right is not proof the links are right. Bitly does not always store what you
gave it.

Open each short link in a browser tab and confirm where it lands:

| Short link | Should land on |
|---|---|
| `c.benai.co/<code>-accelerator` | `benai.co/accelerator` |
| `c.benai.co/<code>-agency` | `benai.co/custom-solutions` |
| `c.benai.co/<code>-os` | Calendly `business-os-setup` |
| `c.benai.co/<code>-aioperator` | Calendly `1-on-1-program` |
| `c.benai.co/<code>-free` | `benai.kit.com/<code>-free`, only if there is a lead magnet |
| `c.benai.co/<code>-kityout` | `benai.co/accelerator-offer` |

**Bitly reorders the query string alphabetically.** Every UTM parameter survives and tracking
is unaffected, so do not report this as a fault. Check that all four parameters are present,
not that the string matches character for character.

> [!important] The Cowork row changed on 2026-08-26
> New videos use `-os`. Videos imported before that date use `-cowork`, and those links stay
> as they are: renaming a live backhalf breaks it wherever it has already been published. So
> when verifying an older video, expect `-cowork` and do not "fix" it.

## The one thing that is easy to get wrong

Only four of the six links go in the description: accelerator, free, aioperator, agency.
Cowork and Kit-YouTube exist for other placements. Importing all six is correct. Putting all
six in the description is not.
