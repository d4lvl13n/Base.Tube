# Thumbnail style pages (`/thumbnails/...`)

One file in this folder = one page on the site.

- `fortnite.md` becomes `https://base.tube/thumbnails/fortnite`.
- `_hub.md` holds the text of the hub page `https://base.tube/thumbnails`.
- `_TEMPLATE.md` is the blank form to copy. It explains every field.
- Files starting with `_` never become pages.

The images of a page live in `public/thumbnails/<page-name>/`.

## Why this format

Each file is a Markdown file with a block of settings at the top (called
"frontmatter", written in YAML).

- **For a person:** it is plain text. You can edit it in any text editor or
  directly on GitHub. The settings block reads like a form: `title: "..."`,
  `status: draft`. The long guide below it is normal writing with `## Headings`.
- **For an automated pipeline:** the settings block is structured data that
  any tool can write, and the validation script returns a machine-readable
  report (`--json`). Nothing needs a database or a developer.
- **One file per page:** adding a page never means touching the code.

## How to add a page (5 steps)

1. **Copy the form.** Duplicate `_TEMPLATE.md` and name the copy after the page,
   in lowercase with hyphens: `roblox.md`, `gorilla-tag.md`. Set `slug:` to the
   same name. Keep `status: draft`.
2. **Write the page.** Fill in every field (the comments in the template say
   what each one is for) and write the guide under the second `---` line.
   Use the keywords from the SEO plan (`plan/content_plan.csv`).
3. **Add the images.** Generate at least 12 original thumbnails in the
   Base.Tube Studio (24 to 40 is the target), export them as 1280×720 WebP,
   put them in `public/thumbnails/<page-name>/`, and add one `gallery` entry
   per image (file name, alt text, caption, the prompt you used).
4. **Check it.** From the `blog-nextjs` folder, run:

   ```
   node scripts/validate-thumbnails.mjs
   ```

   Fix everything listed under the page. Items marked "to fix" are what still
   stops the page from going live.
5. **Publish.** When the page says "ready to publish", change `status: draft`
   to `status: published`, run the check again (it also updates the sitemap
   list), and commit the page, its images and
   `src/components/v2/thumbnail-pages/lib/live-pages.json` together. The page
   goes live with the next deploy.

## When is a page "live"?

A page is shown to Google (indexed and listed in the sitemap and on the hub)
only when **all** of these are true:

- `status: published`;
- at least **12 gallery images** (setting: `MIN_GALLERY_IMAGES`), every file
  present in `public/thumbnails/<page-name>/` and in 16:9;
- no image marked `placeholder: true`;
- at least **4 FAQ questions**, a guide of at least **400 words**, a title of
  at most 60 characters and a description of at most 155, both containing the
  primary keyword (the H1 too);
- every page listed under `related` exists;
- no leftover `TODO`, `TBD`, `[verify]`, `lorem ipsum` or a line made only of `...`.

Any other page is still built so it can be reviewed at its address, but it
carries `noindex` and stays out of the sitemap and the hub. A half-finished page
can never be indexed by accident.

The hub (`/thumbnails`) itself is kept out of Google until **3 pages** are live
(setting: `HUB_MIN_LIVE_PAGES`).

When you run the site locally (`npx next dev`), a yellow banner on a page that
is not live says so and how many items are left to fix.

## Images: rules

- **Our own generations only.** Every image is made with Base.Tube. Never real
  people's faces (famous creators included), logos, game art, screenshots, or
  copies of existing thumbnails.
- **Descriptive names only.** Say "Fortnite-style thumbnail", never "official".
  Game and creator pages set `trademark:` so the page shows the "not
  affiliated" line.
- **Describe the look in prompts, do not name the game or the creator.** The
  validator warns when a prompt contains the trademark name, because naming it
  makes a generator more likely to copy protected characters.
- **Format:** 1280×720 pixels, WebP, under 400 KB, lowercase file names with
  hyphens (`roblox-victory-01.webp`). The first image is also the preview shown
  when the page is shared on social media.
- **Alt text:** one sentence describing what is in the image, starting with the
  style ("Roblox-style victory thumbnail: ...").

## The check command

Run from the `blog-nextjs` folder:

| Command | What it does |
| --- | --- |
| `node scripts/validate-thumbnails.mjs` | Checks every page and updates the sitemap list. |
| `node scripts/validate-thumbnails.mjs roblox` | Shows only the `roblox` page. |
| `node scripts/validate-thumbnails.mjs --check` | Checks without writing anything (for automated checks). |
| `node scripts/validate-thumbnails.mjs --json` | Same check, as JSON, for a content pipeline. |

What the output means:

- **error**: the file is broken (for example a formatting mistake in the
  settings block). The page is not built at all. The message gives the line.
- **to fix** (on a draft) / **blocks** (on a published page): the page works
  but cannot be indexed until this is fixed.
- **warning**: a suggestion. It never blocks anything.

The command fails (exit code 1) when a file is broken or when a published page
has something that blocks it. Drafts never make it fail.

**Why commit `live-pages.json`?** The sitemap is refreshed on the server every
minute, where these Markdown files are not available. It reads the list of live
pages from `src/components/v2/thumbnail-pages/lib/live-pages.json`, which the
check command writes. If that list is out of date, the production build stops
with a message telling you to run the check command. That is intended: it
guarantees the sitemap always matches the pages.

## Settings

The numbers above live in `src/components/v2/thumbnail-pages/lib/config.mjs`
(minimum images, minimum FAQ questions, minimum guide length, title and
description limits, Studio links, the free tools linked from every page).
Changing one there changes it for every page, the sitemap and the check command.

## Formatting tips (the settings block)

- Indent with spaces, never tabs.
- Put short text in double quotes: `title: "Roblox Thumbnail Ideas"`.
- Put long text after `>` on the next lines, indented by two more spaces.
- Colour codes need quotes: `hex: "#FFC21A"`.
- `{count}` in any text becomes the number of gallery images, so a title like
  "{count} examples" stays true when you add images.
- If the check reports a formatting error, it gives the line number and usually
  the fix (most often: wrap the text in double quotes).
