#!/usr/bin/env node
// @ts-check
/**
 * Collects public YouTube data for the creator pages (/creators/youtube/<slug>).
 *
 *   node scripts/creators-collect.mjs            every channel in content/creators/_channels.json
 *   node scripts/creators-collect.mjs <slug>…    only these
 *
 * For each channel it calls two Monid / TikHub endpoints (about $0.003 per channel):
 * the channel profile and its latest uploads (one page, about 30 long videos). Raw answers are
 * kept in ../docs/research/creators/raw/ (not committed). The normalised snapshot is written to
 * content/creators/<slug>.json; an existing "analysis" and "status" are kept, so re-running the
 * script refreshes the numbers without losing the written analysis.
 *
 * Counts from YouTube are rounded ("1.2M views"): we store the number and say it is approximate.
 * Needs the Monid CLI with an API key on this machine.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(APP_ROOT, 'content', 'creators');
const RAW = path.resolve(APP_ROOT, '..', 'docs', 'research', 'creators', 'raw');
fs.mkdirSync(RAW, { recursive: true });

/** @param {string} name */
const slugify = (name) =>
  name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** "1.2M views" / "67.3K subscribers" / "1,234" -> number */
function parseCount(text) {
  if (text == null) return null;
  const m = String(text).replace(/,/g, '').match(/([\d.]+)\s*([KMB]?)/i);
  if (!m) return null;
  const mult = { '': 1, K: 1e3, M: 1e6, B: 1e9 }[m[2].toUpperCase()] ?? 1;
  return Math.round(parseFloat(m[1]) * mult);
}

/** "12:34" / "1:02:03" -> seconds */
function parseDuration(text) {
  if (!text) return null;
  return String(text)
    .split(':')
    .reduce((s, x) => s * 60 + Number(x), 0);
}

function monid(endpoint, query, file) {
  const out = path.join(RAW, file);
  if (!fs.existsSync(out) || Date.now() - fs.statSync(out).mtimeMs > 12 * 3600 * 1000) {
    execFileSync('monid', ['run', '-p', 'tikhub', '-e', endpoint, '--query', JSON.stringify(query), '-w', '90', '-o', out], {
      stdio: 'ignore',
      env: { ...process.env, NO_COLOR: '1' },
    });
  }
  const json = JSON.parse(fs.readFileSync(out, 'utf8'));
  // `monid run -o` saves either the whole run (with status/output) or just the output.
  if (json.status && json.status !== 'COMPLETED') throw new Error(`${endpoint} ${file}: ${json.status}`);
  return json.output ?? json;
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  if (!s.length) return null;
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
};

const channels = JSON.parse(fs.readFileSync(path.join(DIR, '_channels.json'), 'utf8'));
const only = process.argv.slice(2);
const today = new Date().toISOString().slice(0, 10);

for (const ch of channels) {
  const slug = ch.slug ?? slugify(ch.name);
  if (only.length && !only.includes(slug)) continue;
  const q = { channel_id: ch.channel_id, language_code: 'en-US', country_code: 'US', need_format: true };
  const profile = monid('/api/v1/youtube/web_v2/get_channel_description', q, `${slug}-profile.json`);
  const list = monid('/api/v1/youtube/web_v2/get_channel_videos', q, `${slug}-videos.json`);

  const videos = (list.videos ?? [])
    .filter((v) => !v.is_live)
    .map((v) => ({
      id: v.video_id,
      title: v.title,
      // Members-only videos show their age ("4 months ago") where the views should be: no count.
      views: /view/i.test(v.view_count ?? '') ? parseCount(v.view_count) : null,
      viewsText: /view/i.test(v.view_count ?? '') ? v.view_count : null,
      membersOnly: !/view/i.test(v.view_count ?? '') && /ago/i.test(v.view_count ?? ''),
      duration: v.duration ?? null,
      durationSec: parseDuration(v.duration),
      published: v.published_time ?? null,
      thumbnail: `https://i.ytimg.com/vi/${v.video_id}/hqdefault.jpg`,
      thumbnailHd: `https://i.ytimg.com/vi/${v.video_id}/maxresdefault.jpg`,
    }));

  // Collaboration videos show "<channel> and 2 more" instead of a view count in the list:
  // fetch their real count and date one by one ($0.001 each). Members-only videos have no public count.
  for (const v of videos) {
    if (v.views !== null || v.membersOnly) continue;
    const info = monid('/api/v1/youtube/web_v2/get_video_info', { video_id: v.id, need_format: true }, `${slug}-video-${v.id}.json`);
    // view_count can be empty; view_count_text then holds the exact number ("7,588 views", sometimes localised).
    const n = Number(info.view_count) || Number(String(info.view_count_text ?? '').replace(/[^0-9]/g, ''));
    if (Number.isFinite(n) && n > 0) {
      v.views = n;
      v.viewsText = `${n.toLocaleString('en-US')} views`;
    }
    if (!v.published && info.publish_date) v.published = String(info.publish_date).slice(0, 10);
    v.collab = true;
  }

  const counted = videos.filter((v) => typeof v.views === 'number');
  const med = median(counted.map((v) => v.views));
  const outliers = med
    ? counted
        .map((v) => ({ id: v.id, multiple: Math.round((v.views / med) * 10) / 10 }))
        .sort((a, b) => b.multiple - a.multiple)
        .slice(0, 5)
    : [];

  const avatar = Array.isArray(profile.avatar) ? profile.avatar[0]?.url : (profile.avatar ?? list.channel?.avatar ?? null);
  const file = path.join(DIR, `${slug}.json`);
  const previous = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};

  const data = {
    slug,
    status: previous.status ?? 'draft',
    channelId: ch.channel_id,
    name: profile.title ?? list.channel?.name ?? ch.name,
    handle: profile.handle ?? null,
    url: `https://www.youtube.com/channel/${ch.channel_id}`,
    avatar,
    game: ch.game,
    subscribers: parseCount(profile.subscriber_count),
    subscribersText: profile.subscriber_count ?? null,
    videoCount: parseCount(profile.video_count),
    description: (profile.description ?? '').replace(/\s+/g, ' ').trim().slice(0, 400),
    collectedAt: today,
    source: 'Public YouTube data (channel page and latest uploads), collected through TikHub. Counts are rounded by YouTube.',
    stats: { sample: counted.length, medianViews: med, outliers },
    videos,
    analysis: previous.analysis ?? null,
  };
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  console.log(`ok  ${slug.padEnd(22)} ${String(data.subscribersText).padEnd(18)} ${videos.length} videos, median ${med}`);
}
