/**
 * Server only (reads the disk). Decides, when the page is built, which backgrounds can be shown
 * and whether the page may be indexed.
 *
 * A background is "ready" when its entry has `placeholder: false` AND its file exists in
 * public/thumbnail-backgrounds/. The page is indexable only when every background is ready, so
 * it can never reach Google with empty "coming soon" boxes.
 */
import fs from 'node:fs';
import path from 'node:path';

import { BACKGROUNDS, BACKGROUNDS_DIR, type ThumbnailBackground } from './backgrounds';

function fileExists(bg: ThumbnailBackground): boolean {
  try {
    return fs.statSync(path.join(process.cwd(), 'public', BACKGROUNDS_DIR, bg.file)).isFile();
  } catch {
    return false;
  }
}

export interface BackgroundAvailability {
  /** ids of the backgrounds that can be shown and downloaded */
  ready: ReadonlySet<string>;
  /** true only when every background is ready: the page may be indexed */
  allReady: boolean;
}

export function getBackgroundAvailability(): BackgroundAvailability {
  const ready = new Set(BACKGROUNDS.filter((bg) => !bg.placeholder && fileExists(bg)).map((bg) => bg.id));
  return { ready, allReady: BACKGROUNDS.length > 0 && ready.size === BACKGROUNDS.length };
}
