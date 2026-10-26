---
# /thumbnails/tiktok. Field-by-field help: _TEMPLATE.md.
# Draft: every gallery image is a placeholder ("placeholder: true") until the
# real images are generated from the prompts below.
# Gallery images are 16:9 (site rule): each one shows vertical 9:16 TikTok
# covers standing on a plain backdrop.
# Platform facts checked on 2026-10-26 against TikTok Creator Academy,
# "Video covers and thumbnails" (tiktok.com/creator-academy/article/video-covers-thumbnails):
# cover editing tool, "upload local cover", 9x16 and 1080x1920, keep text in
# frame, centre the subject, one text template per series.
# Synthetic people only.

slug: tiktok
status: published
category: genre
name: "TikTok"
updated: 2026-10-26
published: 2026-10-26

title: "TikTok Thumbnail Ideas: {count} Cover Examples and Sizes"
description: "{count} original TikTok thumbnail examples: cover layouts for your profile grid, the 1080 × 1920 size, and how to pick or upload a cover."
h1: "TikTok thumbnail ideas"
h1Accent: "for covers that make your profile grid work."
summary: "A centred subject, a short title in one template, the same look every post: five TikTok cover layouts that turn a profile into a menu."

primaryKeyword: tiktok thumbnail
secondaryKeywords:
  - tiktok thumbnail size
  - tiktok cover
  - tiktok video cover

intro: >
  A TikTok thumbnail is the cover of your video: the still people see on your
  profile grid and in search before they tap. A good one centres the subject,
  adds a short title that says what the video is, and uses the same text style
  every time. Below: {count} original examples, five layouts and the size
  TikTok recommends.

styleRecipe:
  palette:
    - name: Ink black
      hex: "#111111"
      use: Text bands and dark backgrounds
    - name: Clean white
      hex: "#FFFFFF"
      use: Cover titles, always with a shadow or band behind
    - name: Electric cyan
      hex: "#25F4EE"
      use: One accent colour for a series or a number
    - name: Hot pink
      hex: "#FE2C55"
      use: A second accent for highlights and arrows
    - name: Soft cream
      hex: "#F5EFE6"
      use: Calm backgrounds for lifestyle and tutorial covers
  composition: >
    A 9:16 frame with the subject centred and the title above or below it,
    never on top of the face. Keep every word well inside the frame. Place
    the subject and the title in the same spot on every cover, so the profile
    grid looks tidy.
  text: >
    A short title of two to six words that names the topic, such as "DAY 12"
    or "5 MIN PASTA". One font, one size and one colour band for the whole
    series. Bigger than you think: the grid tiles are small.
  expressions: >
    If you are in your videos, put yourself in the centre of the cover with a
    clear expression that fits the topic: curious, proud, surprised. Synthetic
    people only in these examples.
  props:
    - A solid text band behind the title
    - A part or day number for series
    - One arrow or circle on the detail that matters
    - A small icon that repeats on every cover of a series
  background: >
    A clean frame from the video, or a flat colour that stays the same across a
    series. Busy backgrounds make the title hard to read on the grid.

layouts:
  - name: Centred Creator
    description: >
      You in the middle of the cover, chest up, with the title in a band above
      your head. The default for talking videos, advice and storytimes.
    prompt: >
      Vertical 9:16 TikTok video cover, invented young man centred from the chest up with a curious raised eyebrow, soft cream background, white title "RENT HACK" on a black band above his head, original characters, no logos, no real people
  - name: Series Tile
    description: >
      The same template every post, with only the number and the image
      changing: "PART 3", "DAY 12". On your profile, the series reads as a row
      of matching tiles.
    prompt: >
      Vertical 9:16 TikTok video cover, flat electric cyan background, a small potted tomato plant centred, huge black text "DAY 12" above it, small band "GARDEN DIARY" below, original characters, no logos, no real people
  - name: Tutorial Title
    description: >
      The finished result in the centre and a title that names it. Viewers
      browsing your grid can find the recipe or the tip they want without
      opening every video.
    prompt: >
      Vertical 9:16 TikTok video cover, top-down bowl of creamy tomato pasta centred on a wooden table, white title "5 MIN PASTA" on a black band at the top third, original characters, no logos, no real people
  - name: Text Card
    description: >
      A plain colour and a short line, for opinion, list and story videos where
      the words are the hook. Works best when it matches the first line said
      in the video.
    prompt: >
      Vertical 9:16 TikTok video cover, flat hot pink background, bold white text "3 THINGS I STOPPED BUYING" centred in large capitals, small cyan arrow, original characters, no logos, no real people
  - name: Split Compare
    description: >
      Two stacked halves for before and after, cheap against expensive, or two
      options. Each half gets one word so the comparison reads at tile size.
    prompt: >
      Vertical 9:16 TikTok video cover, split top and bottom, plain white sneaker on top labelled "$20", glossy designer sneaker below labelled "$200", thin black line between, original characters, no logos, no real people

gallery:
  - file: 01-centred-creator.webp
    alt: "TikTok thumbnail: a vertical cover with a curly-haired young man centred, eyebrow raised, holding up a key, white title RENT HACK on a black band"
    caption: "Centred creator: the face in the middle, the title above"
    prompt: >
      16:9 image, one vertical 9:16 TikTok video cover standing upright in the centre of a flat sage green backdrop. On the cover: an invented young man with curly hair centred from the chest up, one eyebrow raised, holding a key, soft cream wall behind. White title "RENT HACK" on a black band above his head. Original characters, no logos, no real people
    layout: Centred Creator
  - file: 02-series-tile.webp
    alt: "TikTok cover examples: three matching cyan covers reading DAY 10, DAY 11 and DAY 12, a potted tomato plant and GARDEN DIARY tag on each"
    caption: "Series tile: one template, only the day changes"
    prompt: >
      16:9 image, three vertical 9:16 TikTok video covers side by side on a flat white backdrop. Same template on each: flat electric cyan background, a potted tomato plant centred, a little taller on each cover, huge black text "DAY 10", "DAY 11", "DAY 12" above, small band "GARDEN DIARY" below. Original characters, no logos, no real people
    layout: Series Tile
  - file: 03-tutorial-title.webp
    alt: "TikTok video cover: top-down bowl of creamy tomato penne with basil on a wooden table, white title 5 MIN PASTA on a black band"
    caption: "Tutorial title: the finished dish, named in four words"
    prompt: >
      16:9 image, one vertical 9:16 TikTok video cover standing upright in the centre of a flat terracotta backdrop. On the cover: top-down view of a bowl of creamy tomato pasta with basil on a light wooden table, a fork resting on the rim. White title "5 MIN PASTA" on a black band in the top third. Original characters, no logos, no real people
    layout: Tutorial Title
  - file: 04-text-card.webp
    alt: "TikTok cover: flat hot pink background with the white line 3 THINGS I STOPPED BUYING in capitals and a small cyan arrow pointing down"
    caption: "Text card: the hook line, nothing else"
    prompt: >
      16:9 image, one vertical 9:16 TikTok video cover standing upright in the centre of a flat dark grey backdrop. On the cover: a flat hot pink background, the line "3 THINGS I STOPPED BUYING" in bold white capitals centred, one small cyan arrow pointing down. Original characters, no logos, no real people
    layout: Text Card
  - file: 05-split-compare.webp
    alt: "TikTok thumbnail: a vertical cover split into a plain white canvas sneaker labelled $20 on top and a glossy chunky sneaker labelled $200 below"
    caption: "Split compare: two halves, one price on each"
    prompt: >
      16:9 image, one vertical 9:16 TikTok video cover standing upright in the centre of a flat navy backdrop. The cover is split top and bottom: a plain white canvas sneaker on light grey labelled "$20" above, a glossy chunky sneaker on black labelled "$200" below, a thin white line between. Original characters, no logos, no real people
    layout: Split Compare
  - file: 06-centred-creator.webp
    alt: "TikTok cover: an older woman centred and laughing at a pottery wheel, clay on her hands, title FIRST BOWL on a cream band below"
    caption: "Centred creator: a warmer look, title below the face"
    prompt: >
      16:9 image, one vertical 9:16 TikTok video cover standing upright in the centre of a flat mustard backdrop. On the cover: an invented woman in her sixties with grey hair, centred, laughing, clay on her hands, a lopsided bowl on the wheel in front of her, warm pottery studio light. Black title "FIRST BOWL" on a cream band below her. Original characters, no logos, no real people
    layout: Centred Creator

dos:
  - Design the cover at 1080 × 1920 pixels, in 9:16.
  - Centre the subject and keep every word well inside the frame.
  - Use one text template, font and colour for every cover in a series.
  - Name the topic in the title, so people browsing your profile find it.
donts:
  - Don't put the title over your face or the main object.
  - Don't change fonts and colours from one post to the next.
  - Don't let the app pick a random blurry frame; choose or upload one.
  - Don't promise something on the cover that the video does not show.

faq:
  - q: What is the TikTok thumbnail size?
    a: >
      TikTok's Creator Academy recommends a 9:16 aspect ratio and 1080 × 1920
      pixels for video covers, the same shape as the video. Keep your text
      inside the frame and your subject centred, because covers are shown
      small on your profile grid. If you design in another tool, export at
      that size before you upload the cover.
  - q: How do I add a custom TikTok cover?
    a: >
      When you post, open the cover option on the posting screen. You can pick
      a frame from your video and add text with TikTok's cover editing tool,
      or choose to upload a local cover, an image you designed beforehand.
      TikTok's Creator Academy describes both options. Menu names can differ
      slightly between app versions.
  - q: Where do people see my TikTok cover?
    a: >
      Mainly on your profile grid and wherever videos are listed as tiles, such
      as search results. In the For You feed, the video plays straight away, so
      the opening second matters more there. The cover is what turns your
      profile into a menu: a new visitor scans it and picks what to watch.
  - q: What should I write on a TikTok cover?
    a: >
      A short title that names the topic or the hook, in two to six words:
      "DAY 12", "5 MIN PASTA", "RENT HACK". TikTok suggests a text that states
      the theme of the video or makes people curious. Keep the same font and
      text position on every cover so your grid looks consistent.
  - q: Is a TikTok cover the same as a YouTube Shorts cover?
    a: >
      Both are vertical 9:16 images and both are seen mostly as tiles, so the
      same design often works on both. The tools differ: on TikTok you choose
      or upload a cover when you post. On YouTube, the app lets you pick a
      frame and Studio on a computer lets you upload an image. The
      [YouTube Shorts thumbnail ideas](/thumbnails/youtube-shorts) page covers
      that side.
  - q: Is there a free TikTok thumbnail maker?
    a: >
      TikTok's own cover editing tool lets you pick a frame and add text for
      free. For a designed cover, any free editor with a 1080 × 1920 canvas
      works with the layouts on this page. The Base.Tube Studio can also
      generate covers in these styles with synthetic people from a short
      description of your video.

related:
  - youtube-shorts
  - podcast
  - funny
  - meme

cta:
  style: tiktok
---

## What a TikTok cover is for

On TikTok, most people meet your video in the For You feed, where it starts
playing at once. The cover matters at the next step: when someone opens your
profile to see what else you make, or browses videos in search. There, your
videos appear as a grid of small vertical tiles. A good TikTok thumbnail makes
that grid easy to scan: each tile says what the video is, and they all look
like they belong to the same creator.

## Size and the safe area

TikTok's Creator Academy recommends a 9:16 cover at 1080 × 1920 pixels, the
same shape as the video. Two of its rules matter most:

- **Centre the subject.** Put yourself or the main object in the middle of the
  frame, in the same spot on every cover.
- **Keep the text inside the frame.** Words near the edges get cut or become
  hard to read once the tile is small.

## Pick or upload, never leave it to chance

When you post, TikTok lets you choose the cover. You can scroll through the
video to pick a frame and add text with the cover editing tool, or upload a
local cover, an image you designed beforehand. A designed cover gives you the
most control: the right expression, the right light and a title that fits
your template. A random frame is often mid-blink or mid-word.

## Five layouts for TikTok covers

- **Centred creator:** you in the middle, the title in a band above or below.
- **Series tile:** one template, only the part or day number changes.
- **Tutorial title:** the finished result in the centre, named in a few
  words.
- **Text card:** a flat colour and the hook line.
- **Split compare:** two stacked halves with one label each.

## One template for the whole profile

Consistency is what makes a profile grid look intentional. TikTok's own advice
is to keep fonts, text size, colours and image style the same across covers.
In practice:

- choose one font and one text band colour;
- put the title in the same place every time, above or below the subject;
- give each series its own accent colour and a number.

A visitor who sees nine matching tiles with clear titles understands your
account in a few seconds, and is more likely to open a second video.

## Titles that read on a small tile

Two to six words, in capitals or a heavy font, on a solid band or with a
shadow. Name the topic plainly: "5 MIN PASTA" is better than "you need this".
Don't write over your face or the main object; place the title around it.

## Reusing covers on other platforms

The same vertical cover often works for YouTube Shorts too; the
[YouTube Shorts thumbnail ideas](/thumbnails/youtube-shorts) page explains how
to set it there. For horizontal YouTube videos you need a 16:9 version: see
the [YouTube thumbnail size guide](/youtube-thumbnail-size) and check it with
the [YouTube thumbnail preview](/tools/youtube-thumbnail-preview).
