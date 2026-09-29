// Server-side reads of the app's public API for the AI Thumbnails page. Nothing here runs in the
// browser: the visitor's browser never calls beta.base.tube for this page. Both reads are cached for
// an hour; when one fails, the page renders without what it would have given (spec section 5).
import type { SubscriptionCatalog, SubscriptionPlan } from './catalog';

const API = 'https://beta.base.tube/api/v1';
const REVALIDATE_SECONDS = 3600;

async function getJson(path: string): Promise<unknown> {
  try {
    const response = await fetch(`${API}${path}`, {
      headers: { accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { success?: boolean; data?: unknown };
    return body?.success === true ? body.data ?? null : null;
  } catch {
    return null;
  }
}

const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const isText = (value: unknown): value is string => typeof value === 'string' && value.length > 0;
const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

function isPlan(value: unknown): value is SubscriptionPlan {
  if (!isObject(value) || !isObject(value.prices)) return false;
  const { month, year } = value.prices as Record<string, unknown>;
  return (
    isText(value.id) &&
    isText(value.name) &&
    isNumber(value.rank) &&
    isNumber(value.videosPerMonth) &&
    isNumber(value.creditsPerMonth) &&
    isNumber(value.channelProfiles) &&
    Array.isArray(value.highlights) &&
    value.highlights.every(isText) &&
    isObject(month) &&
    isNumber(month.amountCents) &&
    isText(month.currency) &&
    isObject(year) &&
    isNumber(year.amountCents) &&
    isText(year.currency) &&
    isNumber(year.monthlyEquivalentCents) &&
    isNumber(year.savingsPercent)
  );
}

/** The plan catalog, or null when the API does not answer with a complete one. */
export async function getCatalog(): Promise<SubscriptionCatalog | null> {
  const data = await getJson('/subscriptions/plans');
  if (!isObject(data) || !Array.isArray(data.plans) || data.plans.length === 0 || !data.plans.every(isPlan)) return null;
  const breakdown = data.videoBreakdown;
  if (
    !isNumber(data.videoCredits) ||
    !isNumber(data.rolloverMonths) ||
    !isObject(breakdown) ||
    !['concepts', 'conceptCredits', 'edits', 'editCredits', 'audits', 'auditCredits'].every((key) => isNumber(breakdown[key]))
  )
    return null;
  const trial = isObject(data.trial) && isNumber(data.trial.days) && isNumber(data.trial.videos) ? data.trial : null;
  return { ...(data as unknown as SubscriptionCatalog), trial: trial as SubscriptionCatalog['trial'] };
}

/**
 * Free thumbnail reviews a visitor gets per day (GET /ctr/quota, `data.audit.limit`), or null.
 * Only the daily limit is used: a server call cannot know how many a visitor has left.
 */
export async function getFreeReviewsPerDay(): Promise<number | null> {
  const data = await getJson('/ctr/quota');
  const limit = isObject(data) && isObject(data.audit) ? data.audit.limit : null;
  return isNumber(limit) && Number.isInteger(limit) && limit > 0 ? limit : null;
}
