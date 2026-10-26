'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SAFE_PCT, SPEC, type ImageFacts } from './specs';

export interface Upload extends ImageFacts {
  /** Object URL for previews. Lives only in this browser tab. */
  url: string;
  isSample: boolean;
}

function readDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (!img.naturalWidth || !img.naturalHeight) reject(new Error('empty'));
      else resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => reject(new Error('decode'));
    img.src = url;
  });
}

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|bmp|tiff?|heic|heif|svg|ico)$/i;

/** Draws a 2560 x 1440 sample banner in the browser, so the page needs no extra image file. */
function drawSample(): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const W = SPEC.recommendedW;
    const H = SPEC.recommendedH;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('canvas'));
      return;
    }
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#1b0f3a');
    bg.addColorStop(0.55, '#3a1450');
    bg.addColorStop(1, '#ff801f');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Soft shapes across the whole frame: only TV shows all of them.
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = '#ffffff';
    for (const [x, y, r] of [
      [260, 220, 180],
      [2240, 260, 220],
      [380, 1220, 240],
      [2180, 1180, 200],
      [1280, 150, 90],
      [1280, 1300, 110],
    ]) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Channel name and tagline sit inside the safe area.
    const safeH = (H * SAFE_PCT.h) / 100;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `800 ${Math.round(safeH * 0.36)}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.fillText('YOUR CHANNEL', W / 2, H / 2 - safeH * 0.12);
    ctx.font = `500 ${Math.round(safeH * 0.14)}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText('New videos every Friday', W / 2, H / 2 + safeH * 0.27);

    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('blob'))), 'image/jpeg', 0.86);
  });
}

/**
 * Reads an image the user picked, dropped or pasted. Everything happens in the
 * browser: the file is only turned into an object URL, never sent anywhere.
 */
export function useBannerUpload() {
  const [upload, setUpload] = useState<Upload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const currentUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    };
  }, []);

  const loadFile = useCallback(async (file: File, isSample = false) => {
    setError(null);
    if (!file.type.startsWith('image/') && !IMAGE_EXT.test(file.name)) {
      setError('That file is not an image. Drop a JPG or PNG.');
      return;
    }
    setBusy(true);
    const url = URL.createObjectURL(file);
    try {
      const { width, height } = await readDimensions(url);
      if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
      currentUrl.current = url;
      setUpload({
        url,
        name: file.name || 'pasted-image',
        width,
        height,
        bytes: file.size,
        mime: file.type,
        isSample,
      });
    } catch {
      URL.revokeObjectURL(url);
      setError('Your browser could not open that file as an image. HEIC files, for example, need converting to JPG or PNG first.');
    } finally {
      setBusy(false);
    }
  }, []);

  const loadSample = useCallback(async () => {
    try {
      const blob = await drawSample();
      await loadFile(new File([blob], 'sample-banner.jpg', { type: 'image/jpeg' }), true);
    } catch {
      setError('Could not draw the sample banner. Try your own file instead.');
    }
  }, [loadFile]);

  const clear = useCallback(() => {
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    currentUrl.current = null;
    setUpload(null);
    setError(null);
  }, []);

  return { upload, error, busy, loadFile, loadSample, clear };
}
