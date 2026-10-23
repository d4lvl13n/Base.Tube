// @ts-check
/** Link into the app's Studio with an idea typed in. No other imports, so client components can use it. */

import { STUDIO_APP_GENERATE_URL } from './config.mjs';

/**
 * The app's Studio "new thumbnail" page with `prompt` in the "Video title or idea" field.
 * `ref` (which page and button) is sent as `site_ref`: the app reads `ref` as a referral code.
 *
 * @param {string} prompt
 * @param {string} [ref]
 * @returns {string}
 */
export function studioPromptUrl(prompt, ref) {
  const u = new URL(STUDIO_APP_GENERATE_URL);
  u.searchParams.set('prompt', ideaText(prompt).slice(0, 500));
  if (ref) u.searchParams.set('site_ref', ref);
  return u.toString();
}

/**
 * The gallery prompts are written for an image model ("16:9 YouTube thumbnail for a Fortnite video:
 * … keep the bottom-right corner clear, be creative with the composition"). The Studio field is
 * "Video title or idea", so keep only the description in the middle.
 *
 * @param {string} prompt
 * @returns {string}
 */
export function ideaText(prompt) {
  const s = prompt
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^16:9 YouTube thumbnail for an? [^:]{1,60}:\s*/i, '')
    .replace(/[,.]?\s*keep the bottom-right corner clear\b.*$/i, '')
    .replace(/[,.]?\s*be creative with the composition\.?$/i, '')
    .trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
