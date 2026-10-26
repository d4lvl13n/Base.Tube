# Creator pages (`/creators/youtube/<slug>`)

One JSON file = one page about a real YouTube channel: its public numbers, its standout videos and a
written reading of its thumbnail style, with what another creator can borrow. The hub is `/creators/youtube`.

## Files

- `_channels.json`: the channels to cover (`channel_id`, `name`, `game` = slug of a `/thumbnails/<game>` page, optional `slug`).
- `<slug>.json`: one page. Written by `scripts/creators-collect.mjs` (data) and by people/agents (`analysis`).
- Files starting with `_` and this README are not pages.

## Refreshing the data

```bash
node scripts/creators-collect.mjs            # all channels (about $0.003 each through Monid)
node scripts/creators-collect.mjs flow       # one channel
```

The script rewrites the data fields and keeps `status` and `analysis`.

## After any change: rebuild the index

```bash
node scripts/creators-index.mjs
```

Writes `src/components/v2/creators/creators-index.json` (slug, name, game, live, date, avatar,
subscribers of every creator). The sitemap, the footer and the "Creators to study" block of the game
galleries read that file, because the sitemap is refreshed on the server where `content/` is not
available. Run it after adding a creator, changing a `status`, writing an `analysis` or refreshing the
data, and commit the JSON with the content. The production build stops if it is out of date.

## When a page goes live

A creator page is **live** when `status` is `published` AND `analysis` is not `null`. Live means:
indexed by search engines, listed in the sitemap, and linked from published game galleries and from
other live creator pages. Every other page is still built (to preview it) but served with `noindex`.

The hub `/creators/youtube` is indexed, listed in the sitemap and linked from the footer once
3 creator pages are live. Before that it is a noindex preview of every creator.

Pages and data notes:

- Video view counts whose text does not say "views" are treated as unknown (the scraper sometimes puts
  the date there: "4 months ago" was read as 4M views). The page computes the median and the multiples
  from the readable counts only, so `stats.medianViews` / `stats.outliers` in the file are not shown as is.
- Standout videos: `analysis.standouts` in that order; without an analysis, the 3 highest multiples.

## Fields

Written by the script:

| Field | Meaning |
|---|---|
| `slug`, `channelId`, `name`, `handle`, `url`, `avatar` | identity |
| `game` | slug of the related `/thumbnails/<game>` page |
| `subscribers` / `subscribersText` | rounded count from YouTube ("118K subscribers") |
| `videoCount`, `description` | from the channel page |
| `collectedAt` | date of the snapshot (YYYY-MM-DD) |
| `source` | where the data comes from |
| `stats.sample` | number of recent long videos used |
| `stats.medianViews` | median views of that sample |
| `stats.outliers[]` | `{ id, multiple }`: videos furthest above the median (multiple = views ÷ median) |
| `videos[]` | `{ id, title, views, viewsText, duration, durationSec, published, thumbnail, thumbnailHd }` (latest uploads, newest first) |

Written by hand / agents (`analysis`, `null` until written):

```json
{
  "summary": "One or two sentences: what the channel makes and what its thumbnails look like.",
  "niche": "Short label, e.g. 'Fortnite challenges and ranked progression'",
  "styleTraits": [{ "title": "Big face, small game", "detail": "2-3 sentences, observable in the thumbnails" }],
  "standouts": [{ "id": "<video id from videos[]>", "why": "2-3 sentences: what the packaging does; a hypothesis, not a proven cause" }],
  "lessons": ["One concrete thing another creator can borrow (3 to 5 items)"],
  "experiment": "One thumbnail test a viewer of this page could run on their own channel.",
  "faq": [{ "q": "How many subscribers does Flow have?", "a": "30-80 words, using the dated numbers" }],
  "reviewedAt": "YYYY-MM-DD"
}
```

## Rules for the analysis

- Describe only what can be seen in the thumbnails, titles and numbers. Say "may", "probably" for causes:
  a high view multiple is a lead, not proof that the thumbnail caused it.
- Never claim to know click-through rate, impressions, retention or revenue: those are private.
- Respectful and factual about real people. No personal details beyond the public channel page.
- Do not copy the channel's description text; summarise in your own words.
- No disclaimers: no "not affiliated", "not legal advice", "belongs to its owner" or data-source
  boilerplate on the page.
- `status`: `published` by default (new channels too). Use `draft` (noindex, not in the sitemap) only to hold a page back on purpose.
