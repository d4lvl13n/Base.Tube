---
# Meme-style thumbnail page. Field-by-field help: _TEMPLATE.md.
#
# DRAFT: every gallery entry is marked "placeholder: true" while its image is
# being generated. Image files: NN-<layout>.webp, from 01-red-circle.webp to
# 20-mystery-caption.webp, saved in public/thumbnails/meme/ as 1280x720 WebP
# under 400 KB. Each entry's "prompt" is the exact text used to generate it.
#
# Rule for this page: original examples only. Never reproduce, describe or name
# a real meme image or a real person, in the text or in a prompt.

slug: meme
status: draft
category: style
name: Meme
updated: 2026-10-22

title: "YouTube Thumbnail Memes: {count} Examples, 5 Formats"
description: "{count} original meme-style YouTube thumbnails: red circle, absurd zoom, deep-fried, gone wrong and mystery caption, and how to use the look on purpose."
h1: "YouTube thumbnail memes"
h1Accent: "and how to use the look on purpose."
summary: "Red circles, absurd zooms, deep-fried colour and fake disasters: the five meme formats, and how to make them your own."

primaryKeyword: youtube thumbnail meme
secondaryKeywords:
  - thumbnail meme
  - yt thumbnail memes
  - clickbait thumbnail meme
  - chess thumbnail meme
  - basketball thumbnail meme

intro: >
  A YouTube thumbnail meme is a thumbnail so loud it turned into a joke: the
  overreacting face, the red circle around almost nothing, the zoom that goes
  too far, "gone wrong" in capitals. Creators now use that look on purpose, for
  comedy. Below: {count} original examples, the five formats behind them, and
  how to make one that is funny and still honest.

styleRecipe:
  palette:
    - name: Circle red
      hex: "#FF1F1F"
      use: Circles, arrows and the one word that carries the panic
    - name: Highlighter yellow
      hex: "#FFE600"
      use: Big caption text and the thing being zoomed on
    - name: Deep-fried orange
      hex: "#FF6A00"
      use: Pushed skin tones and skies in deep-fried edits
    - name: Siren blue
      hex: "#1F5BFF"
      use: A police-light glow at the edges of "gone wrong" setups
    - name: Caption white
      hex: "#FFFFFF"
      use: Plain captions in the mystery format
    - name: Outline black
      hex: "#000000"
      use: Thick outlines on every word
  composition: >
    One face or one object, large, on the left or right third; the red circle,
    the zoom target or the caption on the other side. A meme thumbnail has one
    focal point, so the joke reads in one look. Leave the bottom-right corner
    empty: YouTube shows the video length there.
  text: >
    One to three words in capitals. A heavy sans-serif with a thick black
    outline for most formats; a plain white caption for the mystery format.
    Punctuation is part of the joke: "?!" and "??" are allowed here.
  expressions: >
    Bigger than real life: jaw dropped, hands on cheeks, one eyebrow raised, a
    blank stare into the lens. The mystery format does the opposite: a calm,
    unaware face.
  props:
    - A thick red circle and a hand-drawn red arrow
    - A round magnifier inset blowing up a tiny detail
    - Lens flares or a red glow on the eyes
    - Smoke, foam or a siren glow for staged disasters
    - Question marks and "?!" next to the caption
  background: >
    Ordinary places shot a little badly on purpose: a kitchen, a parking lot, a
    supermarket aisle. The ordinary setting is what makes the overreaction
    funny.

layouts:
  - name: Red circle
    description: >
      An overreacting face on one side and a thick red circle around something
      tiny on the other. The joke is the gap between the size of the reaction
      and the size of the thing circled.
    prompt: >
      16:9 YouTube thumbnail, meme style: synthetic woman with hands on cheeks
      and jaw dropped on the left third, thick red circle and arrow around one
      crumb on a kitchen counter on the right, yellow text "WAIT WHAT", bottom-right
      corner empty, original characters, no logos, no real people
  - name: Absurd zoom
    description: >
      One detail zoomed far past good taste: a face, an eye, an object, cropped
      so tight it turns grainy. It already says "look at this", so one word of
      text is enough.
    prompt: >
      16:9 YouTube thumbnail, meme style: grainy extreme close-up of a ginger
      cat staring into the lens filling the left two thirds, yellow text
      "SUSPICIOUS" on the right, bottom-right corner empty, original characters,
      no logos, no real people
  - name: Deep-fried
    description: >
      The image pushed until it breaks: saturation at the limit, heavy
      compression noise, glowing eyes, a slight bulge in the middle. It tells
      the viewer this channel does not take itself seriously.
    prompt: >
      16:9 YouTube thumbnail, deep-fried meme style: oversaturated photo of a
      synthetic young man in a hoodie with glowing red eyes on the left third,
      heavy noise, orange and red, text "BRUH" on the right, bottom-right corner
      empty, original characters, no logos, no real people
  - name: Gone wrong
    description: >
      A parody of the old prank-video thumbnail: an everyday activity, a little
      smoke or foam, a siren-coloured glow, a red arrow and a dramatic label.
      Use it when the video really does contain a small disaster.
    prompt: >
      16:9 YouTube thumbnail, meme style: panicked synthetic man on the left
      third, hallway flooded with bath foam on the right, red arrow, red and
      blue siren glow, red text "GONE WRONG", bottom-right corner empty,
      original characters, no logos, no real people
  - name: Mystery caption
    description: >
      A calm, unaware person and a short caption hinting at something they have
      not noticed, or a lone figure with a question. Low drama in the picture,
      all the tension in the words.
    prompt: >
      16:9 YouTube thumbnail, meme style: smiling synthetic man at a garden
      barbecue on the left third, dark storm cloud behind him, plain white
      caption "HE DOESN'T KNOW" on the right, bottom-right corner empty,
      original characters, no logos, no real people

gallery:
  - file: 01-red-circle.webp
    alt: "Meme-style red circle thumbnail: a shocked woman, hands on cheeks, beside a counter with one crumb circled in red, text WAIT WHAT"
    caption: "Red circle: a huge reaction to one crumb"
    prompt: >
      16:9 YouTube thumbnail, meme style, red circle format, classic framing.
      An original synthetic woman in her twenties, photo-realistic, hands on
      her cheeks, jaw dropped, large on the left third; on the right, a
      kitchen counter with one tiny crumb inside a thick red circle and arrow.
      Warm beige, slightly overexposed kitchen light. On-image text: "WAIT
      WHAT" in yellow capitals with a black outline, top right. Bottom-right
      corner kept clear. Original characters, no logos, no real people
    notes: "The smaller the circled thing, the bigger the joke."
    layout: Red circle
  - file: 02-red-circle.webp
    alt: "Meme-style red circle thumbnail: extreme close-up of the end of a long receipt, one price line circled in red, text HOW MUCH"
    caption: "Red circle: one line on a very long receipt"
    prompt: >
      16:9 YouTube thumbnail, meme style, red circle format, extreme close-up.
      The end of a long crumpled supermarket receipt fills the frame, one line
      inside a thick red circle, an elderly thumb at the edge. Cold
      fluorescent white light, shallow focus. On-image text: "HOW MUCH" small,
      yellow capitals in a short black band at the bottom left. Bottom-right
      corner kept clear. Original characters, no logos, no real people
    layout: Red circle
  - file: 03-red-circle.webp
    alt: "Meme-style red circle thumbnail: a single pawn dead centre on a dim chessboard inside a red circle, huge word BLUNDER above"
    caption: "Red circle on a chessboard: the pawn that changed everything"
    prompt: >
      16:9 YouTube thumbnail, meme style, red circle format, centred
      composition. One wooden pawn dead centre on a dim chessboard, inside a
      thick red circle, the other pieces blurred. Muted dark green and warm
      wood, a single low lamp. On-image text: "BLUNDER" huge, white capitals
      with a black outline, centred above the pawn. Bottom-right corner kept
      clear. Original characters, no logos, no real people
    notes: "Chess channels use this format for blunders."
    layout: Red circle
  - file: 04-red-circle.webp
    alt: "Meme-style red circle thumbnail: a wide shot of a grey lake at dusk, a tiny boy pointing at a far ripple circled in red, no text"
    caption: "Red circle: a ripple on a lake, circled, no words needed"
    prompt: >
      16:9 YouTube thumbnail, meme style, red circle format, wide establishing
      shot. A calm grey lake at dusk; a tiny original synthetic boy on the
      shore at the left edge points across the water at one small ripple
      inside a thick red circle. Cool overcast grey-green, phone-photo blur.
      No text. Bottom-right corner kept clear. Original characters, no logos,
      no real people
    layout: Red circle
  - file: 05-absurd-zoom.webp
    alt: "Meme-style absurd zoom thumbnail: a grainy ginger cat's face filling the whole frame, staring into the lens, small text SUSPICIOUS on top"
    caption: "Absurd zoom: a cat, far too close"
    prompt: >
      16:9 YouTube thumbnail, meme style, absurd zoom format, extreme
      close-up. An original ginger cat's face fills almost the whole frame,
      grainy and slightly pixelated, huge pupils staring into the lens. Warm
      orange fur, dim living-room light. On-image text: "SUSPICIOUS" small,
      yellow capitals with a black outline along the top edge. Bottom-right
      corner kept clear. Original characters, no logos, no real people
    layout: Absurd zoom
  - file: 06-absurd-zoom.webp
    alt: "Meme-style absurd zoom thumbnail: a top-down view of a messy desk, a tiny toy dinosaur in a huge magnifier inset, sticker LOOK CLOSER"
    caption: "Absurd zoom: the magnifier inset, seen from above"
    prompt: >
      16:9 YouTube thumbnail, meme style, absurd zoom format, top-down view. A
      cluttered desk with cables and mugs seen from directly above; a tiny
      green toy dinosaur near the centre, blown up inside a huge round
      magnifier inset with a white border, grainy. Neutral daylight. On-image
      text: "LOOK CLOSER" in black capitals on a tilted yellow sticker, top
      left. Bottom-right corner kept clear. Original characters, no logos, no
      real people
    layout: Absurd zoom
  - file: 07-absurd-zoom.webp
    alt: "Meme-style absurd zoom thumbnail: a basketball player frozen mid-dunk on the right, face zoomed and pixelated, blank stare, text NO WAY"
    caption: "Absurd zoom on a basketball highlight: the blank stare mid-dunk"
    prompt: >
      16:9 YouTube thumbnail, meme style, absurd zoom format, classic framing.
      An original synthetic basketball player in a plain unmarked jersey,
      frozen mid-dunk, large on the right third, face zoomed and pixelated,
      staring blankly at the camera. Warm arena orange, motion blur. On-image
      text: "NO WAY" in white capitals with a black outline, on the left.
      Bottom-right corner kept clear. Original characters, no logos, no real
      people
    layout: Absurd zoom
  - file: 08-absurd-zoom.webp
    alt: "Meme-style absurd zoom thumbnail: split screen, a man at a party on the left, a grainy zoom on his raised eyebrow on the right, text HUH?"
    caption: "Absurd zoom: the full scene, then one eyebrow"
    prompt: >
      16:9 YouTube thumbnail, meme style, absurd zoom format, vertical split
      screen. Left half: an original synthetic man at a quiet house party,
      normal photo. Right half: a grainy extreme zoom on his one raised
      eyebrow. Thin white dividing line. Cool pale blue tones. On-image text:
      "HUH?" huge, white capitals with a black outline, on the line at the
      top. Bottom-right corner kept clear. Original characters, no logos, no
      real people
    layout: Absurd zoom
  - file: 09-deep-fried.webp
    alt: "Meme-style deep-fried thumbnail: a frog dead centre on a lily pad in blown-out cyan and magenta, huge word MONDAY above"
    caption: "Deep-fried: a frog, a weekday, no context"
    prompt: >
      16:9 YouTube thumbnail, deep-fried meme style, centred composition. An
      ordinary green frog dead centre on a lily pad, flat stare at the camera.
      Blown-out cyan and magenta, harsh lens flare, pixel noise, overexposed
      pond. On-image text: "MONDAY" huge, yellow capitals with a black
      outline, centred above the frog. Bottom-right corner kept clear.
      Original characters, no logos, no real people
    layout: Deep-fried
  - file: 10-deep-fried.webp
    alt: "Meme-style deep-fried thumbnail: a smug golden retriever in round sunglasses on the left, star flares, gold sticker text CERTIFIED"
    caption: "Deep-fried: a very confident dog"
    prompt: >
      16:9 YouTube thumbnail, deep-fried meme style, classic framing. An
      original golden retriever in tiny round sunglasses, head tilted, smug,
      large on the left third. Oversaturated gold and red, heavy grain,
      star-shaped lens flares, backyard blown out to white. On-image text:
      "CERTIFIED" in black capitals inside a gold starburst sticker on the
      right. Bottom-right corner kept clear. Original characters, no logos, no
      real people
    layout: Deep-fried
  - file: 11-deep-fried.webp
    alt: "Meme-style deep-fried thumbnail: low-angle shot of a young man in a hoodie with glowing red eyes, crushed red colour, no text"
    caption: "Deep-fried: glowing eyes from below, no words"
    prompt: >
      16:9 YouTube thumbnail, deep-fried meme style, low-angle hero shot. An
      original synthetic young man in a grey hoodie looks down at the camera,
      blank stare, glowing red lens flares on both eyes, face bulged. Crushed
      blacks, oversaturated red-orange, heavy compression noise, dark bedroom
      ceiling behind. No text. Bottom-right corner kept clear. Original
      characters, no logos, no real people
    layout: Deep-fried
  - file: 12-deep-fried.webp
    alt: "Meme-style deep-fried thumbnail: extreme close-up of a bloodshot eye over a giant coffee mug in radioactive green, text ME AT 3AM"
    caption: "Deep-fried: the 3 a.m. desk, far too close"
    prompt: >
      16:9 YouTube thumbnail, deep-fried meme style, extreme close-up. One
      wide bloodshot eye of an original synthetic office worker peers over the
      rim of a giant bulging coffee mug, filling the frame. Radioactive
      yellow-green, sharpening halos, grain, dark monitor glow. On-image text:
      "ME AT 3AM" as a small white label in the top-right corner. Bottom-right
      corner kept clear. Original characters, no logos, no real people
    layout: Deep-fried
  - file: 13-gone-wrong.webp
    alt: "Meme-style gone wrong thumbnail: a top-down view of a hallway buried in bath foam, a tiny man on a chair, banner text GONE WRONG"
    caption: "Gone wrong: a bath, far too much foam, seen from above"
    prompt: >
      16:9 YouTube thumbnail, meme style, gone wrong format, top-down view. A
      small apartment hallway buried in white bath foam, seen from the
      ceiling; a tiny original synthetic man stands on a chair in the middle,
      hands up. Bright white with red and blue glow at the edges. On-image
      text: "GONE WRONG" in white capitals on a red banner across the top.
      Bottom-right corner kept clear. Original characters, no logos, no real
      people
    layout: Gone wrong
  - file: 14-gone-wrong.webp
    alt: "Meme-style gone wrong thumbnail: diagonal before-after split, a perfect pink cake and the same cake collapsed in smoke, text NOT CLICKBAIT"
    caption: "Gone wrong: the cake, before and after, with an ironic label"
    prompt: >
      16:9 YouTube thumbnail, meme style, gone wrong format, diagonal
      before-and-after split. Left of the line: a perfect three-layer pink
      cake on a plate, bright clean light. Right of the line: the same cake
      collapsed in a smoky kitchen, grey haze. On-image text: "NOT CLICKBAIT"
      in black capitals on a yellow arrow-shaped label, top centre.
      Bottom-right corner kept clear. Original characters, no logos, no real
      people
    notes: "The ironic label is the clickbait thumbnail meme in two words."
    layout: Gone wrong
  - file: 15-gone-wrong.webp
    alt: "Meme-style gone wrong thumbnail: extreme close-up of a palm holding leftover screws inside a red circle, small text EXTRA SCREWS"
    caption: "Gone wrong: the leftover screws, up close"
    prompt: >
      16:9 YouTube thumbnail, meme style, gone wrong format, extreme close-up.
      An original synthetic dad's open palm fills most of the frame, holding
      leftover screws inside a thick red circle; a leaning half-built
      bookshelf blurred behind. Pale, muted wood and white. On-image text:
      "EXTRA SCREWS" small, white capitals with a black outline at the top
      left. Bottom-right corner kept clear. Original characters, no logos, no
      real people
    layout: Gone wrong
  - file: 16-gone-wrong.webp
    alt: "Meme-style gone wrong thumbnail: two friends in a supermarket aisle, one in an inflatable dinosaur costume, speech bubble KICKED OUT?"
    caption: "Gone wrong: the costume in the supermarket"
    prompt: >
      16:9 YouTube thumbnail, meme style, gone wrong format, classic framing.
      Two original synthetic friends in their twenties, one in an inflatable
      green dinosaur costume, the other laughing, large on the right third of
      a plain aisle of unbranded products. Fluorescent white light. On-image
      text: "KICKED OUT?" in red capitals inside a white speech bubble on the
      left. Bottom-right corner kept clear. Original characters, no logos, no
      real people
    layout: Gone wrong
  - file: 17-mystery-caption.webp
    alt: "Meme-style mystery caption thumbnail: a smiling man at a garden barbecue with a storm cloud behind him, text HE DOESN'T KNOW"
    caption: "Mystery caption: calm face, storm behind"
    prompt: >
      16:9 YouTube thumbnail, meme style, mystery caption format, classic
      framing. An original synthetic man in his thirties, photo-realistic,
      smiling calmly at a garden barbecue, large on the left third. Sunny
      greens in front, a huge dark storm cloud behind. On-image text: "HE
      DOESN'T KNOW" in a plain white caption font with a thin black outline,
      on the right. Bottom-right corner kept clear. Original characters, no
      logos, no real people
    layout: Mystery caption
  - file: 18-mystery-caption.webp
    alt: "Meme-style mystery caption thumbnail: a wide snowy field with a tiny old man in a long coat staring at the camera, caption WHO IS HE"
    caption: "Mystery caption: one question, one tiny stranger"
    prompt: >
      16:9 YouTube thumbnail, meme style, mystery caption format, wide
      establishing shot. An empty snowy field under a flat white sky; an
      original synthetic old man in a long dark coat stands tiny in the middle
      distance, staring at the camera. Cold washed-out grey, low-resolution
      grain. On-image text: "WHO IS HE" small, plain white caption font, top
      centre. Bottom-right corner kept clear. Original characters, no logos,
      no real people
    layout: Mystery caption
  - file: 19-mystery-caption.webp
    alt: "Meme-style mystery caption thumbnail: extreme close-up of a girl's faint calm smile behind a chess knight, caption SHE PLANNED THIS"
    caption: "Mystery caption at the chessboard: the calm smile, up close"
    prompt: >
      16:9 YouTube thumbnail, meme style, mystery caption format, extreme
      close-up. The lower face of an original synthetic teenage girl, chin on
      her hand, faint calm smile, a chess knight in sharp focus in front of
      her. Soft afternoon green, warm wood, shallow focus. On-image text: "SHE
      PLANNED THIS" small, plain white caption font along the bottom-left
      edge. Bottom-right corner kept clear. Original characters, no logos, no
      real people
    layout: Mystery caption
  - file: 20-mystery-caption.webp
    alt: "Meme-style mystery caption thumbnail: a grinning boy with a basketball dead centre, a much taller shadow behind him, caption WAIT FOR IT"
    caption: "Mystery caption on the court: a shadow that doesn't match"
    prompt: >
      16:9 YouTube thumbnail, meme style, mystery caption format, centred
      composition. An original synthetic boy of about twelve stands dead
      centre holding a basketball, grinning; on the court behind him, the long
      shadow of a much taller figure. Golden-hour orange, long blue shadow,
      chain-link fence. On-image text: "WAIT FOR IT" big, plain white caption
      font, centred above him. Bottom-right corner kept clear. Original
      characters, no logos, no real people
    layout: Mystery caption

dos:
  - "Make the joke readable in one look: one face, one circle or one caption."
  - Use the meme look on a video that really has a funny moment in it.
  - Keep the text to three words or fewer, with a thick outline.
  - Leave the bottom-right corner clear for the video length.
  - Borrow the format, make the image yourself.
donts:
  - Don't paste a famous meme image or someone else's photo into your thumbnail.
  - Don't use a real person's face without their permission, famous or not.
  - Don't stage a disaster the video never shows; the joke turns into a complaint.
  - Don't stack every format at once. Deep-fried, zoomed and circled together just reads as noise.

faq:
  - q: What is the YouTube thumbnail meme?
    a: >
      It is the joke version of a loud YouTube thumbnail. Years of creators
      competing for attention made certain moves instantly recognisable: the
      overreacting face, the red circle and arrow, the extreme zoom, "gone
      wrong" in capitals. People now share famous examples as jokes and make
      parody thumbnails that exaggerate the same moves. Many creators also use
      the look on purpose to signal that a video is a comedy video.
  - q: What does the red circle mean in a thumbnail meme?
    a: >
      It means "look here". Creators first used red circles and arrows to point
      the eye at one detail in a small image, faster than any words could. It
      became a meme because it was overused, often around things that
      did not matter. Used as a joke, it works best when the circled thing is
      deliberately tiny and the reaction next to it is huge.
  - q: What is a clickbait thumbnail meme?
    a: >
      A parody of thumbnails that promise more than the video delivers: fake
      disasters, "not clickbait" labels, shocked faces over nothing. As a joke
      it is fine, because viewers are in on it. As a real promise it backfires:
      people who click and find nothing tend to leave quickly. Keep the
      exaggeration in the style and make sure the moment in the thumbnail is
      really in the video.
  - q: How do I make a meme thumbnail for my own video?
    a: >
      Pick one of the five formats and the one moment in your video it fits.
      Use an original image: your own face, a friend who agreed, or a
      synthetic person. Add one to three words with a thick outline and check
      it at phone size. The Base.Tube Studio can
      generate each format from a short description of your video.
  - q: Can I use a famous meme image in my thumbnail?
    a: >
      Be careful. Famous meme images are photos or video frames that someone
      owns, and many show real people who never agreed to promote your video.
      Sharing a meme in a chat is not the same as using it to promote your
      channel. The safer route is to recreate the format with an original
      image, as every example on this page does. This page is not legal advice.
  - q: Do chess and basketball videos use thumbnail memes?
    a: >
      Yes. Chess channels use the red circle on a single piece to sell a
      blunder, and the calm-smile caption to hint at a trap. Basketball
      highlight channels use the absurd zoom on a player's face mid-play and
      mystery captions for a comeback. The formats travel well to any topic
      with a clear moment and a clear reaction.

related:
  - funny
  - clickbait
  - mrbeast
  - chess
  - nba

cta:
  style: meme
---

## What a thumbnail meme is

A thumbnail meme starts as a real YouTube thumbnail so exaggerated it becomes a
joke on its own. Creators competing for attention pushed the same moves further
and further: bigger reactions, thicker circles, tighter zooms. Viewers learned
to recognise those moves, then to laugh at them.

When people search for a YouTube thumbnail meme (or "yt thumbnail memes"), they
usually want one of two things: a famous thumbnail they remember, or the formula behind the joke. This
page covers the second. Every example above is an original Base.Tube
generation with synthetic people. We do not reproduce real meme images or real
people's faces, and you should not either if the thumbnail promotes your own
video.

## The five formats, and why each one is funny

### The overreaction and the red circle

A face reacting as if something enormous happened, and a red circle around
something tiny. The joke lives in the mismatch. A crumb, a ripple on a lake or
a single pawn works better than anything genuinely dramatic, because the
reaction then becomes the punchline. Keep the circle thick and hand-drawn
rather than perfect.

### The absurd zoom

A crop so tight it hurts: one eye, one eyebrow, a cat's face filling the frame.
The image goes grainy and slightly pixelated, and that low quality is part of
the look. The zoom already says "look at this", so one word of text is enough,
often just a reaction like "HUH?".

### Deep-fried

The image is pushed until it breaks: saturation and sharpening at the limit,
heavy compression noise, glowing eyes, a slight bulge in the middle of the
face. It says "this channel does not take itself seriously" before the viewer
reads a word. On anything serious, it looks like a mistake.

### The fake "gone wrong"

A parody of the old prank-video thumbnail: an everyday activity, a bit of
smoke or foam, a red and blue glow at the edges and a dramatic label. The
modern version is self-aware. A label like "NOT CLICKBAIT" over a collapsing
cake is the clickbait thumbnail meme in two words. It works when the video
does contain the small disaster you show.

### The mystery caption

The quiet format. A calm person who has not noticed anything, and a short
caption that suggests they should: "HE DOESN'T KNOW", "WHO IS HE", "WAIT FOR
IT". The picture stays low drama; all the tension is in the words. Use a plain
white caption font here, not the heavy outlined style of the other formats.

## Using the meme look on purpose

The meme look is a promise about tone. It tells viewers to expect jokes, chaos
or a fail. That suits comedy channels, gaming fails, reaction videos and
sports highlights. It also travels well: a chess thumbnail meme puts a red
circle on the blunder, and a basketball thumbnail meme zooms on a player's face
mid-dunk. On a calm tutorial or a serious story, the same look attracts people
who expected something else.

Three habits keep it working:

- **One format per thumbnail.** All five at once is noise.
- **Show a real moment.** The circled detail or the staged disaster should
  appear early in the video.
- **Stay consistent.** In a series, keep the same caption font and position,
  so returning viewers spot it.

## Making it readable at phone size

Rough on purpose still has to read when small. Deep-fried noise turns to mush
on a phone, so keep the edge of the face clean and let the noise live in the
background. Draw the red circle thicker than feels right at full size. For a
heavy outlined font, see the
[YouTube thumbnail fonts guide](/youtube-thumbnail-fonts). For the ordinary
settings these formats need, the
[YouTube thumbnail backgrounds guide](/youtube-thumbnail-backgrounds) has ideas
by mood. Export at 1280 × 720 in 16:9; the
[YouTube thumbnail size guide](/youtube-thumbnail-size) has the current file
limits.

## Original, not copied

A famous meme image belongs to someone, and often shows a real person who never
agreed to promote your channel. The format belongs to nobody. Recreate it with
your own face, a friend who said yes, or a synthetic person.

## Check it before you upload

Put your thumbnail next to real videos in the
[YouTube thumbnail preview](/tools/youtube-thumbnail-preview) to see whether
the joke still lands at feed size, and compare two versions with the
[thumbnail tester](/tools/youtube-thumbnail-tester). No tool can tell you in
advance how many people will click. The real answer comes from YouTube once
the video is live, and when you connect your channel, Base.Tube shows the real
impressions and click-through rate of each video.
