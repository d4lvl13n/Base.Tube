#!/usr/bin/env node
// @ts-check
/**
 * Writes src/components/v2/creators/creators-index.json from content/creators/*.json.
 *
 *   node scripts/creators-index.mjs
 *
 * The sitemap, the footer and the "Creators to study" block of the game galleries read that small
 * file instead of the creator files, because the sitemap is refreshed on the server where
 * content/ is not available. Run it (and commit the JSON) after adding a creator, changing a
 * status or refreshing the data. The production build stops if the file is out of date.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { computeCreatorsIndex, CREATORS_INDEX_PATH, readCreatorFiles } from '../src/components/v2/creators/lib/creators-files.mjs';

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const index = computeCreatorsIndex(readCreatorFiles(APP_ROOT));
const out = path.join(APP_ROOT, CREATORS_INDEX_PATH);
fs.writeFileSync(out, JSON.stringify(index, null, 2) + '\n');

const live = index.creators.filter((c) => c.live);
console.log(`${index.creators.length} creators, ${live.length} live${live.length ? `: ${live.map((c) => c.slug).join(', ')}` : ''}`);
console.log(`wrote ${CREATORS_INDEX_PATH}`);
