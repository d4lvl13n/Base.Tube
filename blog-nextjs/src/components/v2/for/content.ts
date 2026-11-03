/**
 * The private "your channel, rebranded" pages: one JSON file per channel in content/for/<channel>.json,
 * with its images in public/for/<channel>/. The file name is the URL: /for/<channel>.
 *
 * A file with a mistake stops the production build with a message that names the field (a broken page
 * must not reach a creator's inbox); in development the page is skipped and the problem is logged.
 *
 * Server-only. Never import this from a client component.
 */

import fs from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'for');
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface ForVideo {
  title: string;
  /** The channel's current thumbnail. */
  before: string;
  /** The same video in the new style. */
  after: string;
}

export interface ForChannel {
  channel: string;
  channelName: string;
  handle: string;
  channelUrl: string;
  subscribersLabel: string;
  avatar: string;
  styleIdea: string;
  videos: ForVideo[];
}

function fail(file: string, field: string, message: string): never {
  throw new Error(`content/for/${file}: ${field} ${message}`);
}

function text(raw: Record<string, unknown>, key: string, file: string, where = key): string {
  const value = raw[key];
  if (typeof value !== 'string' || !value.trim()) fail(file, where, 'must be a non-empty string');
  return value.trim();
}

/** An image of this channel: a path under /for/<channel>/ to a file that exists in public/. */
function image(raw: Record<string, unknown>, key: string, channel: string, file: string, where = key): string {
  const src = text(raw, key, file, where);
  if (!src.startsWith(`/for/${channel}/`)) fail(file, where, `must start with /for/${channel}/`);
  if (!fs.existsSync(path.join(process.cwd(), 'public', src))) fail(file, where, `points to a missing file: public${src}`);
  return src;
}

function normalize(raw: Record<string, unknown>, file: string): ForChannel {
  const channel = file.replace(/\.json$/, '');
  if (!SLUG_RE.test(channel)) fail(file, 'file name', 'must be lowercase words joined by hyphens');
  if (raw.channel !== channel) fail(file, 'channel', `must be "${channel}", like the file name`);
  const channelUrl = text(raw, 'channelUrl', file);
  if (!channelUrl.startsWith('https://')) fail(file, 'channelUrl', 'must start with https://');
  if (!Array.isArray(raw.videos) || raw.videos.length === 0) fail(file, 'videos', 'must list the videos');
  return {
    channel,
    channelName: text(raw, 'channelName', file),
    handle: text(raw, 'handle', file),
    channelUrl,
    subscribersLabel: text(raw, 'subscribersLabel', file),
    avatar: image(raw, 'avatar', channel, file),
    styleIdea: text(raw, 'styleIdea', file),
    videos: (raw.videos as Record<string, unknown>[]).map((video, i) => ({
      title: text(video, 'title', file, `videos[${i + 1}].title`),
      before: image(video, 'before', channel, file, `videos[${i + 1}].before`),
      after: image(video, 'after', channel, file, `videos[${i + 1}].after`),
    })),
  };
}

let cache: ForChannel[] | null = null;

export function getForChannels(): ForChannel[] {
  if (cache && process.env.NODE_ENV === 'production') return cache;
  let files: string[] = [];
  try {
    files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json') && !f.startsWith('_')).sort();
  } catch {
    files = [];
  }
  const channels: ForChannel[] = [];
  for (const file of files) {
    try {
      channels.push(normalize(JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8')), file));
    } catch (error) {
      if (process.env.NODE_ENV === 'production') throw error;
      console.error(`[for] skipped ${file}:`, error instanceof Error ? error.message : error);
    }
  }
  cache = channels;
  return channels;
}

export function getForChannel(channel: string): ForChannel | undefined {
  return getForChannels().find((c) => c.channel === channel);
}
