---
# ════════════════════════════════════════════════════════════════════════════
#  TEMPLATE for a /thumbnails/<slug> page. Copy this file, rename the copy to
#  <slug>.md (for example "roblox.md"), fill in every field, then run
#      node scripts/validate-thumbnails.mjs
#  from the blog-nextjs/ folder. Files starting with "_" are never published.
#
#  Writing rules for this block (it is YAML):
#   - Lines starting with # are comments; they are ignored. Delete them if you like.
#   - Indent with SPACES only (2 per level), never tabs.
#   - Short text: put it in double quotes: title: "Roblox Thumbnail Ideas"
#     If the text itself contains a double quote, use single quotes around it.
#   - Long text: write ">" after the colon and put the text on the next lines,
#     indented by 2 more spaces. No quotes needed, line breaks become spaces.
#   - Colour codes MUST be quoted: hex: "#FFC21A" (a bare # starts a comment).
#   - Lists: one item per line, starting with "- ".
#   - "{count}" anywhere in a text is replaced by the number of gallery images.
#   - Text fields accept **bold**, *italic* and [links](/tools/youtube-thumbnail-preview).
#
#  Brand and legal rules (checked by people, partly by the validator):
#   - Names are descriptive only: "Roblox-style thumbnail", "MrBeast-style".
#     Never say "official", never suggest a partnership or endorsement.
#   - Every image is Base.Tube's own AI generation. Never real people's faces
#     (including famous creators), logos, game art, screenshots or copies of
#     existing thumbnails.
#   - In generation prompts, describe the look ("blocky 3D characters, bright
#     plastic colours") instead of naming the game or the creator.
#   - No invented numbers, and never claim to predict or score click-through rate.
# ════════════════════════════════════════════════════════════════════════════

# ── Identity ──────────────────────────────────────────────────────────────
# URL part: lowercase letters, numbers and hyphens. MUST equal the file name.
slug: example-slug
# "draft" = visible at its URL for review, but noindex and not in the sitemap.
# "published" = indexed, but ONLY if every check passes (see README.md).
status: draft
# game | style | genre   (decides the group on the /thumbnails hub)
category: game
# Short display name used in headings and buttons: "Roblox", "MrBeast-style", "Podcast".
name: Example
# Date of the last real update, YYYY-MM-DD. Shown on the page and in the sitemap.
updated: 2026-09-29
# Optional: date the page was first published, YYYY-MM-DD.
# published: 2026-10-15

# ── Search result ─────────────────────────────────────────────────────────
# 60 characters max, must contain primaryKeyword. Do NOT add "| Base.Tube".
title: "Example Thumbnail Ideas: {count} Examples and 5 Layouts"
# 70 to 155 characters. What the searcher gets, in one sentence.
description: "{count} original Example-style thumbnail examples, the colours, text and layouts behind them, and how to make your own."

# ── Headline ──────────────────────────────────────────────────────────────
# Must contain primaryKeyword (the check accepts plurals and hyphens).
h1: "Example thumbnail ideas"
# Optional second line, shown in orange italics.
h1Accent: "that read at phone size."
# One line (140 characters max) for the cards on the hub and on related pages.
summary: "One sentence on what defines the look."

# ── Keywords ──────────────────────────────────────────────────────────────
# From plan/content_plan.csv (primary_keyword and secondary_keywords columns).
primaryKeyword: example thumbnail
# Each one should appear somewhere on the page (the validator warns if not).
secondaryKeywords:
  - example thumbnail maker
  - example thumbnail background

# ── Intro (above the fold) ────────────────────────────────────────────────
# 30 to 70 words. Answer the search directly.
intro: >
  A good Example thumbnail shows ... Below: {count} original examples, the
  style rules behind them, and layouts you can reuse for your next video.

# ── Style recipe (the visual rules, in words) ─────────────────────────────
styleRecipe:
  # 2 to 8 colours, 3 to 6 reads best. name + hex (quoted!) + what it is used for.
  palette:
    - name: Accent gold
      hex: "#FFC21A"
      use: The one word or object that must grab the eye
    - name: Deep blue
      hex: "#123A6B"
      use: Calm backgrounds
  # Where the subject and the text sit in the frame.
  composition: >
    One subject, large, on the left or right third; text on the other side.
  # Words, font style, outline, colour.
  text: >
    One to three words in capitals, heavy font, thick dark outline.
  # Typical faces, emotions, poses. (For style pages: synthetic people only.)
  expressions: >
    One exaggerated emotion, eyes pointing at the text or the object.
  # Recurring objects and graphic details (list).
  props:
    - A red arrow or circle on the key detail
  # What sits behind the subject.
  background: >
    Simple and slightly blurred so the subject stands out.

# ── Layout recipes (3 to 6; game pages: 5) ────────────────────────────────
# Each becomes a numbered recipe with a "Generate" button, and a chip in the hero.
# "prompt" is sent to the Base.Tube Studio. Describe the look; do NOT name the game.
layouts:
  - name: Victory
    description: >
      What the layout looks like and when to use it, in 2 or 3 sentences.
    prompt: "Victory thumbnail, cheerful stylised 3D character with arms up, golden light burst, bright sky, big yellow outlined text"
  - name: Fail
    description: >
      ...
    prompt: "..."
  - name: Challenge
    description: >
      ...
    prompt: "..."

# ── Gallery ───────────────────────────────────────────────────────────────
# At least 12 images (the page stays noindex below that); 24 to 40 is the target.
# Files go in public/thumbnails/<slug>/ : 1280x720 (16:9) WebP under 400 KB,
# lowercase names with hyphens. The FIRST image is also the social-media preview.
gallery:
  - file: example-victory-01.webp
    # What is in the image, in one sentence (15 to 150 characters). Start with the style.
    alt: "Example-style victory thumbnail: a cartoon hero jumping in a gold light burst, text FIRST WIN"
    # Short caption shown under the image (110 characters max).
    caption: "Victory: arms up in a gold light burst"
    # The exact prompt used to generate it (shown in the lightbox, copyable).
    prompt: "Victory thumbnail, cheerful stylised 3D cartoon hero jumping with arms up, golden light burst, bright blue sky, big yellow text FIRST WIN, no logos"
    # Optional: extra style notes shown in the lightbox.
    notes: "Two-word result; the gold does the work."
    # Optional: the layout recipe it illustrates (must match a layout name).
    layout: Victory
    # Only for placeholder images. Any "placeholder: true" blocks publishing.
    # placeholder: true

# ── Do / don't (3 to 5 each) ──────────────────────────────────────────────
dos:
  - Show one subject, big enough to recognise at phone size.
  - Keep the text to three words or fewer.
  - Leave the bottom-right corner clear for the video length.
donts:
  - Don't copy another creator's thumbnail or use official art.
  - Don't repeat the video title word for word.
  - Don't use thin fonts or small text.

# ── FAQ (4 to 10 questions; plan: 6) ──────────────────────────────────────
# Real questions from the keyword data. Answers: 30 to 100 words. Becomes FAQ schema.
faq:
  - q: What makes a good Example thumbnail?
    a: >
      ...
  - q: What font do Example thumbnails use?
    a: >
      ... [verify] any font name before publishing.
  - q: Can I use Example logos or screenshots in my thumbnail?
    a: >
      ... This page is not legal advice.
  - q: Is there a free Example thumbnail maker?
    a: >
      ...

# ── Related pages (3 to 6 slugs) ──────────────────────────────────────────
# Slugs of other pages (no "/thumbnails/"). Links only show once those pages are live.
related:
  - gaming
  - roblox
  - minecraft

# ── Call to action ────────────────────────────────────────────────────────
# Buttons link to https://beta.base.tube/ai-thumbnails/generate?style=<style>
cta:
  # Value of ?style= (defaults to the slug).
  style: example-slug
  # Optional button text (default: "Generate a <name>-style thumbnail").
  # label: "Generate a Roblox-style thumbnail"

# ── Trademark (game and creator pages) ────────────────────────────────────
# Shows the "not affiliated" line at the bottom of the page. Remove for generic
# topics (podcast, vlog...). Owner is optional; check it before publishing.
trademark:
  name: Example
  owner: "Example Studio, Inc."

# ── Optional ──────────────────────────────────────────────────────────────
# A 60-90 s video from the Base.Tube YouTube channel (loads only when played).
# video:
#   youtubeId: dQw4w9WgXcQ        # the 11 characters after "v=" in the URL
#   title: "How to make an Example thumbnail in 60 seconds"
#   description: "One sentence about the video."
#   uploadDate: 2026-10-01
#   duration: PT1M20S             # 1 minute 20 seconds
#
# For hub-like pages (e.g. /thumbnails/gaming): list every live page of a category.
# listing: game
#
# Replace a default section heading (keys: gallery, recipe, layouts, guide, dos, faq, related, listing).
# headings:
#   dos: "Roblox thumbnail do's and don'ts"
---

## First section heading (use "## " for sections, "### " for sub-sections)

The written guide goes here, in Markdown: at least 400 words for this part, and
about 900 to 1,800 words for the whole page. Explain what works for this kind of
video: layout, colours, text, faces, backgrounds, size. Link to the free tools
with normal Markdown links, for example the
[YouTube thumbnail preview](/tools/youtube-thumbnail-preview) or the
[YouTube thumbnail size guide](/youtube-thumbnail-size).

## Second section

- Bullet lists start with "- ".
- **Bold** and *italic* work.

Not supported here: images (use the gallery), HTML, tables, code blocks, and
"# " headings (the page title comes from h1).
