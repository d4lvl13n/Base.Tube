import { analyzeTitle, normalizeTitle, type Analysis, type SurfaceCut } from './analysis';
import { layoutTitle, type LayoutResult } from './layout';
import { SURFACES, type Surface } from './surfaces';
import type { Measure } from './useMeasurer';

export interface SurfaceLayout {
  surface: Surface;
  layout: LayoutResult;
}

export type MeasurerFor = (surface: Surface) => Measure;

export function layoutAll(title: string, measurerFor: MeasurerFor): SurfaceLayout[] {
  const clean = normalizeTitle(title);
  return SURFACES.map((surface) => ({
    surface,
    layout: layoutTitle(clean, {
      width: surface.textWidth,
      maxLines: surface.maxLines,
      measure: measurerFor(surface),
    }),
  }));
}

export function toCuts(layouts: SurfaceLayout[]): SurfaceCut[] {
  return layouts.map(({ surface, layout }) => ({
    id: surface.id,
    label: surface.label,
    truncated: layout.truncated,
    visibleChars: layout.visibleChars,
    totalChars: layout.totalChars,
    hiddenText: layout.hiddenText,
  }));
}

export interface FullResult {
  layouts: SurfaceLayout[] | null;
  analysis: Analysis;
}

export function checkTitle(
  title: string,
  opts: { keyword?: string; thumbnailText?: string },
  measurerFor: MeasurerFor | null
): FullResult {
  const layouts = measurerFor ? layoutAll(title, measurerFor) : null;
  const analysis = analyzeTitle(title, { ...opts, cuts: layouts ? toCuts(layouts) : [] });
  return { layouts, analysis };
}
