import Link from 'next/link';
import s from './ToolsDirectory.module.css';

const TOOLS = [
  {
    href: '/youtube-thumbnail-size',
    name: 'Thumbnail size checker',
    desc: 'The current size, ratio and file limits, checked against YouTube Help. Drop your image to see what passes.',
    go: 'Check my size',
  },
  {
    href: '/tools/youtube-thumbnail-resizer',
    name: 'Thumbnail resizer',
    desc: 'Crop or fit any image to 16:9 and export a JPG or PNG that fits YouTube’s size limit.',
    go: 'Open the resizer',
  },
  {
    href: '/tools/youtube-thumbnail-preview',
    name: 'Thumbnail preview',
    desc: 'See your thumbnail and title in the home feed, search, up next and on mobile, next to other videos.',
    go: 'Preview mine',
  },
  {
    href: '/tools/youtube-thumbnail-tester',
    name: 'Thumbnail tester',
    desc: 'Compare 2–3 variants side by side: feed, squint, grayscale, tiny size and under the duration badge.',
    go: 'Compare variants',
  },
  {
    href: '/tools/youtube-title-checker',
    name: 'Title checker',
    desc: 'Check a title against the 100-character limit and see where it gets cut on desktop, mobile and search.',
    go: 'Check a title',
  },
  {
    href: '/tools/video-to-thumbnail',
    name: 'Video to thumbnail',
    desc: 'Pick the sharpest frame from your own video and export it as a thumbnail.',
    go: 'Grab a frame',
  },
];

export default function ToolsDirectory() {
  return (
    <>
      <ul className={s.list}>
        {TOOLS.map((t) => (
          <li key={t.href} className={s.item}>
            <Link href={t.href} className={s.link}>
              <span className={s.name}>{t.name}</span>
              <span className={s.desc}>{t.desc}</span>
              <span className={s.go}>{t.go} →</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className={s.note}>Free, no account. Everything runs in your browser; your files are never uploaded.</p>
    </>
  );
}
