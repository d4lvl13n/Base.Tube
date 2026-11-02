const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const cache = new Map();
function load(filename) {
  filename = path.resolve(__dirname, '../src/components/ai-thumbnails', filename);
  if (!path.extname(filename)) filename += fs.existsSync(filename + '.tsx') ? '.tsx' : '.ts';
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} }; cache.set(filename, module);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 } });
  new Function('require', 'module', 'exports', outputText)(name => name.startsWith('.') ? load(name) : require(name), module, module.exports);
  return module.exports;
}
const copy = load('pricingCopy.ts');
const { default: PlanChoices } = load('PlanChoices.tsx');
const { landingFaq, trialTermsText } = load('catalog.ts');
const plans = [ ['creator', 'Creator', 540, 2400, 19900], ['pro', 'Pro', 1800, 4900, 39900], ['agency', 'Agency', 4500, 9900, 79900] ].map(([id,name,creditsPerMonth,month,year],rank) => ({id,name,rank,creditsPerMonth,videosPerMonth:[6,20,50][rank],channelProfiles:1,highlights:[], prices:{ month:{amountCents:month,currency:'usd'},year:{amountCents:year,currency:'usd',monthlyEquivalentCents:Math.round(year/12),savingsPercent:31}}}));
const catalog = { plans, trial:{days:7,videos:2,credits:180}, videoCredits:90, videoBreakdown:{concepts:3,conceptCredits:15,edits:2,editCredits:18,audits:1,auditCredits:2}, rolloverMonths:1,free:{channelProfiles:1}};
test('plan cards show all three maximum allowances, shared usage, and unchanged checkout intents', () => {
  const html = renderToStaticMarkup(React.createElement(PlanChoices,{catalog}));
  for (const n of [36,120,300]) assert.ok(html.includes(`Up to ${n} AI thumbnails per month`));
  assert.ok(html.includes(copy.SHARED_CREDIT_EXPLANATION));
  assert.ok(!html.includes('videos a month'));
  assert.ok(html.includes('plan=creator')); assert.ok(html.includes('interval=month'));
  assert.ok(trialTermsText(catalog.trial).includes('180 credits shared across thumbnails, AI edits and audits'));
});
test('allowances follow changed generation costs and round down', () => {
  assert.equal(copy.thumbnailAllowanceText(540,20),'Up to 27 AI thumbnails per month');
  assert.equal(copy.thumbnailAllowanceText(539,15),'Up to 35 AI thumbnails per month');
  assert.equal(copy.thumbnailAllowanceText(540,0),'540 shared credits per month');
});
test('FAQ describes the maximum and shared credits instead of a video quota', () => {
  const text = JSON.stringify(landingFaq(catalog));
  assert.ok(text.includes('How many thumbnails can I generate?'));
  assert.ok(text.includes('AI edits, thumbnail reviews and channel audits use the same balance'));
  assert.ok(!text.includes('Plans are sold in videos'));
});
