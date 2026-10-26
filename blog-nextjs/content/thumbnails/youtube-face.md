---
# YouTube thumbnail face page. Field-by-field help: _TEMPLATE.md.
# DRAFT images: every gallery entry is "placeholder: true" until the image is
# generated. Files: public/thumbnails/youtube-face/NN-<layout>.webp.
# Rule: synthetic people only, never a creator's face.

slug: youtube-face
status: published
category: style
name: YouTube face
updated: 2026-10-26
published: 2026-10-26

title: "YouTube Thumbnail Face: {count} Examples and Why It Works"
description: "What the YouTube thumbnail face is, why the open-mouth look took over, and {count} original examples of faces that fit the video instead."
h1: "YouTube thumbnail face"
h1Accent: "the open mouth, and what to do instead."
summary: "The open-mouth shocked face that became a meme, and six expressions that tell the viewer what the video is really about."

primaryKeyword: youtube thumbnail face
secondaryKeywords:
  - youtube thumbnail faces
  - thumbnail face
  - youtube face meme
  - shocked face thumbnail

intro: >
  The YouTube thumbnail face is the wide-open mouth, raised eyebrows and
  hands-on-cheeks look that filled the platform and became a meme of its
  own. It exists because faces with strong emotions catch the eye in a
  crowded feed. Below: {count} original examples, from the classic shock to
  quieter faces that match the video better.

styleRecipe:
  palette:
    - name: Skin warm
      hex: "#F2B38C"
      use: Evenly lit, slightly warm skin that pops on cool backgrounds
    - name: Pop cyan
      hex: "#14C8F0"
      use: Clean, cool backgrounds behind the face
    - name: Pop yellow
      hex: "#FFD21F"
      use: Back-glow and short captions
    - name: Edge white
      hex: "#FFFFFF"
      use: Thin outline around the cut-out
    - name: Contrast navy
      hex: "#0D1B3D"
      use: Text outline and dark backgrounds
  composition: >
    The face takes a third to a half of the frame, on the left or right. The
    subject of the video sits on the other side. Eyes are sharp and clearly
    visible.
  text: >
    Optional, one to three words on the side away from the face. Often none:
    the face is the message.
  expressions: >
    One emotion, pushed a little past natural: shock, joy, fear, disgust,
    confusion, determination. The expression should match what the video
    makes the viewer feel.
  props:
    - Hands on cheeks, on the head, or covering the mouth
    - A pointing finger toward the subject
    - Glasses pulled down, eyebrows raised
  background: >
    Simple and colourful, or the subject of the video slightly blurred.
    Nothing that competes with the eyes.

layouts:
  - name: Classic shock
    description: >
      The open mouth, wide eyes and hands on the cheeks. Use it when the
      video really contains a shocking moment.
    prompt: "16:9 YouTube thumbnail, original person with mouth wide open and hands on cheeks, wide eyes, bright cyan background, the surprising subject on the other side, original characters, no real people"
  - name: Quiet face
    description: >
      A calm, curious or serious face. Use it for explainers, essays and
      documentaries; it signals trust instead of hype.
    prompt: "16:9 YouTube thumbnail, close-up of an original person with a calm curious expression looking at an object, soft natural light, minimal text, original characters, no real people"
  - name: Matching emotion
    description: >
      The face shows the exact emotion the video delivers: disgust for a
      taste test, fear for horror, pride for a finished build.
    prompt: "16:9 YouTube thumbnail, original person with a disgusted grimace next to a strange food, clean yellow background, original characters, no real people"
  - name: Eyes to the subject
    description: >
      The face turned toward the subject so the viewer's eye follows. Use it
      whenever the subject matters more than the person.
    prompt: "16:9 YouTube thumbnail, original person on the left looking and pointing at a glowing object on the right, eyes clearly toward it, original characters, no real people"

gallery:
  - file: 01-classic-shock.webp
    alt: "YouTube face thumbnail: a young man with mouth wide open and hands on his cheeks next to a cracked egg with a gold yolk, cyan background, text GOLD?"
    caption: "Classic shock: hands on cheeks, gold yolk"
    prompt: >
      16:9 YouTube thumbnail for a cooking experiment video: I found a gold egg. An original young man with mouth wide open, hands on cheeks, eyebrows high on the left; on the right, a cracked egg with a shining gold yolk. Bright cyan background. Text "GOLD?". Keep the bottom-right corner clear, be creative with the composition
    layout: Classic shock
  - file: 02-quiet-face.webp
    alt: "YouTube face thumbnail: a calm woman in glasses tracing an old map with her finger by lantern light, text THE LOST TOWN"
    caption: "Quiet face: calm curiosity for an essay video"
    prompt: >
      16:9 YouTube thumbnail for a history documentary video: the town that vanished from maps. Close-up of an original woman in glasses calmly studying an old paper map by warm lamp light, one finger on a spot. Soft, trustworthy. Text "THE LOST TOWN". Keep the bottom-right corner clear, be creative with the composition
    layout: Quiet face
  - file: 03-matching-emotion.webp
    alt: "YouTube face thumbnail: a woman sticking out her tongue in disgust at a jar of pickled fish on a yellow background, text DAY 1"
    caption: "Matching emotion: disgust for a taste test"
    prompt: >
      16:9 YouTube thumbnail for a food challenge video: eating only pickled food for a week. An original woman with short hair grimacing in pure disgust, tongue out, next to an open jar of pickled fish. Clean yellow background. Text "DAY 1". Keep the bottom-right corner clear, be creative with the composition
    layout: Matching emotion
  - file: 04-eyes-to-the-subject.webp
    alt: "YouTube face thumbnail: a boy pointing up at a huge glowing jellyfish in an aquarium tunnel, face lit blue"
    caption: "Eyes to the subject: the jellyfish is the star"
    prompt: >
      16:9 YouTube thumbnail for an aquarium vlog: the biggest jellyfish I have ever seen. An original boy on the left in an aquarium tunnel, face lit blue, pointing and looking up at a huge glowing jellyfish on the right. No text. Keep the bottom-right corner clear, be creative with the composition
    layout: Eyes to the subject
  - file: 05-matching-emotion.webp
    alt: "YouTube face thumbnail: a sweaty, determined woman climber gripping a rock wall, teeth clenched, text LAST 10 METRES"
    caption: "Matching emotion: determination, not shock"
    prompt: >
      16:9 YouTube thumbnail for a climbing video: my hardest climb. Close-up of an original climber gripping a rock wall, teeth clenched, sweat on the forehead, intense determined eyes, sunlit orange rock. Text "LAST 10 METRES". Keep the bottom-right corner clear, be creative with the composition
    layout: Matching emotion
  - file: 06-classic-shock.webp
    alt: "YouTube face thumbnail: a parody of the shocked face, a tabby cat with its mouth wide open next to a tiny crumb, text WHAT"
    caption: "Classic shock, as a joke: the cat makes the face"
    prompt: >
      16:9 YouTube thumbnail for a comedy pet video. Parody of the classic shocked face: a tabby cat photographed mid-yawn so it looks open-mouthed in shock, next to a single tiny crumb, bright cyan background, bold yellow outline. Text "WHAT". Keep the bottom-right corner clear, be creative with the composition
    layout: Classic shock

dos:
  - Match the face to the feeling the video really delivers.
  - Light the face evenly so the eyes are sharp at phone size.
  - Turn the eyes or a finger toward the subject of the video.
  - Use your own face, or one consistent synthetic character.
  - Leave the bottom-right corner clear for the video length.
donts:
  - Don't default to the shocked face on every video; it stops meaning anything.
  - Don't use a creator's or celebrity's face.
  - Don't let the face cover the subject the video is about.

faq:
  - q: What is the YouTube thumbnail face?
    a: >
      It is the exaggerated expression, usually an open mouth, wide eyes and
      raised eyebrows, that became standard on YouTube thumbnails and then a
      running joke. People call it "YouTube face". It came from creators
      noticing that strong emotions on a large, clear face catch the eye in a
      feed full of small images.
  - q: Why do YouTubers make that face in thumbnails?
    a: >
      Because people notice faces first, and a strong emotion raises a
      question: what caused it? A big readable expression also survives
      being shrunk to phone size. The problem is overuse: when every
      thumbnail shows the same shock, the face stops telling the viewer
      anything about the video.
  - q: Do I need a face in my thumbnail?
    a: >
      No. Many successful thumbnails show only an object, a place or a
      result. A face helps when the video is about a person's experience or
      reaction. If you include one, make sure its emotion matches the video.
  - q: What is a good alternative to the shocked face?
    a: >
      The emotion the video actually delivers. Curiosity for an explainer,
      disgust for a taste test, determination for a challenge, calm for a
      documentary. Each one is a promise about the video, and an accurate
      promise keeps viewers watching.
  - q: How big should the face be in a thumbnail?
    a: >
      Roughly a third to a half of the frame, with the eyes clearly visible.
      Smaller faces lose their expression on phones. Check it with the
      [YouTube thumbnail preview](/tools/youtube-thumbnail-preview) at the
      smallest size.

related:
  - reaction
  - zamn
  - mrbeast
  - clickbait
  - meme

cta:
  style: youtube-face
  label: "Generate a thumbnail with a strong face"
---

## What "YouTube face" means

Scroll any YouTube home page and you will find it: a face with the mouth
wide open, eyebrows high, hands on the cheeks or the head. That expression
became so common that people gave it a name, YouTube face, and the YouTube
face meme was born. It is the most recognisable thumbnail face on the platform.

It did not appear by accident. Creators noticed that faces catch the eye
first in a grid of small images, and that a strong emotion makes people ask
what caused it. A big, clear expression also stays readable when the
thumbnail shrinks to phone size. So the face got bigger and the emotion got
stronger, until it became a cliché.

## Why it still works, and when it doesn't

The shocked face thumbnail still works when the video really contains a shocking
moment. It fails when it is used on everything. Viewers learn that the face
means nothing, and on a calm tutorial or a documentary it attracts people
who expected chaos, then leave.

The better rule is simple: **the face is a promise about the feeling of the
video.** Shock for a shocking reveal. Disgust for a taste test. Calm
curiosity for an essay. Determination for a challenge. YouTube thumbnail
faces that match the video bring the viewers who will enjoy it.

## How to shoot a strong thumbnail face

- **Light:** soft, even light from the front. Shadows in the eye sockets
  kill the expression at small size.
- **Lens:** shoot from slightly above or at eye level, close enough that the
  face fills the frame.
- **Emotion:** think of something that really causes it, then push it a
  little further than natural.
- **Many takes:** keep the shot where the eyes and the mouth agree.
- **Direction:** turn the eyes or a pointing finger toward the subject, so
  the viewer looks where you look.
- **Cut-out:** a thin white edge and a soft shadow separate the face from
  the background.

For a full set of reusable faces, see our page on
[reaction thumbnails](/thumbnails/reaction).

## Placement and size

Put the face on the left or right third, taking up a third to half of the
frame. Put the subject on the other side, and any text, one to three words,
away from the face. Keep the bottom-right corner clear, because YouTube shows
the video length there. Plain, colourful backgrounds such as cyan or yellow
make skin tones pop; the
[YouTube thumbnail backgrounds](/youtube-thumbnail-backgrounds) guide has
more ideas.

## Use the meme on purpose

The shocked face is now also a joke. A cat "making" the face, or a parody of
the open mouth next to a crumb, tells the viewer the video does not take
itself seriously. For more of that, see
[YouTube thumbnail memes](/thumbnails/meme) and the speech-bubble
[zamn thumbnail](/thumbnails/zamn).

## Test before you upload

Check the face at feed size in the
[YouTube thumbnail preview](/tools/youtube-thumbnail-preview) and compare a
loud face with a quieter one in the
[thumbnail tester](/tools/youtube-thumbnail-tester). Export at 1280 × 720
(see the [YouTube thumbnail size guide](/youtube-thumbnail-size)).
