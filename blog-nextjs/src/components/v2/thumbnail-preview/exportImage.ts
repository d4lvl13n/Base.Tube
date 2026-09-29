// Turns a piece of the page into a PNG without any library.
// Idea: copy the element with every computed style written inline, wrap it in an
// SVG <foreignObject>, draw that SVG on a canvas, and save the canvas.
// Every image is first converted to a data URL, because an SVG that is used as an
// image is not allowed to load anything from the network.

const SKIP_PROP = /^(transition|animation|view-transition|scroll-|overscroll|will-change|cursor|pointer-events|user-select|caret|--)/;

const GREY_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMMXf7/PwAFPQKwWgS9xQAAAABJRU5ErkJggg==';

function imageToDataUrl(img: HTMLImageElement): string | null {
  const src = img.currentSrc || img.src;
  if (src.startsWith('data:')) return src;
  if (!img.complete || img.naturalWidth === 0) return null;
  try {
    const ratio = Math.min(1, 1280 / img.naturalWidth);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.naturalWidth * ratio));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * ratio));
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const small = img.naturalWidth <= 400;
    if (!small) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    // toDataURL throws if the canvas is tainted by a cross-origin image.
    return small ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.92);
  } catch {
    return null;
  }
}

interface CloneResult {
  node: Node;
  skipped: number;
}

function cloneWithStyles(source: Node): CloneResult {
  if (source.nodeType === Node.TEXT_NODE) {
    return { node: source.cloneNode(false), skipped: 0 };
  }
  if (source.nodeType !== Node.ELEMENT_NODE) {
    return { node: document.createComment(''), skipped: 0 };
  }

  const el = source as Element;

  // Inline SVG icons carry their own attributes and inherit colour from the parent.
  if (el instanceof SVGElement) {
    return { node: el.cloneNode(true), skipped: 0 };
  }

  const copy = el.cloneNode(false) as HTMLElement;
  const computed = getComputedStyle(el);
  let css = '';
  for (let i = 0; i < computed.length; i += 1) {
    const prop = computed[i];
    if (SKIP_PROP.test(prop)) continue;
    css += `${prop}:${computed.getPropertyValue(prop)};`;
  }
  // Chrome reports a clamped title as `display: flow-root`, which would drop the
  // "…" if copied as is. Put the legacy box display back so the clamp still works.
  const clamp = computed.getPropertyValue('-webkit-line-clamp');
  if (clamp && clamp !== 'none') {
    css += 'display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;';
  }
  copy.setAttribute('style', css);
  copy.removeAttribute('class');
  copy.removeAttribute('data-theme');
  copy.removeAttribute('data-kind');

  let skipped = 0;
  if (el instanceof HTMLImageElement) {
    const dataUrl = imageToDataUrl(el);
    copy.setAttribute('src', dataUrl ?? GREY_PIXEL);
    copy.removeAttribute('srcset');
    copy.removeAttribute('crossorigin');
    copy.removeAttribute('referrerpolicy');
    copy.removeAttribute('loading');
    if (!dataUrl) skipped += 1;
  }

  el.childNodes.forEach((child) => {
    const result = cloneWithStyles(child);
    copy.appendChild(result.node);
    skipped += result.skipped;
  });
  return { node: copy, skipped };
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('The preview could not be turned into an image.'));
    img.src = url;
  });
}

export async function renderToPng(
  node: HTMLElement,
  scale: number,
): Promise<{ blob: Blob; skipped: number }> {
  const width = node.offsetWidth;
  const height = node.offsetHeight;

  const { node: clone, skipped } = cloneWithStyles(node);
  const xhtml = new XMLSerializer().serializeToString(clone);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<foreignObject x="0" y="0" width="${width}" height="${height}">${xhtml}</foreignObject></svg>`;
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  const image = await loadImage(url);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser could not create a canvas.');
  ctx.scale(scale, scale);
  ctx.drawImage(image, 0, 0, width, height);
  // Some browsers paint embedded images only on a second pass.
  await new Promise((resolve) => setTimeout(resolve, 60));
  ctx.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('The image could not be saved.');
  return { blob, skipped };
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
