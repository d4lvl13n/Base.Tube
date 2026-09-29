'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ImageFacts } from './specs';

export interface Upload extends ImageFacts {
  /** Object URL for previews. Lives only in this browser tab. */
  url: string;
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

/**
 * Reads an image the user picked, dropped or pasted. Everything happens in the
 * browser: the file is only turned into an object URL, never sent anywhere.
 */
export function useThumbnailUpload(sampleUrl: string) {
  const [upload, setUpload] = useState<Upload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const currentUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    };
  }, []);

  const loadFile = useCallback(async (file: File) => {
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
      setUpload({ url, name: file.name || 'pasted-image', width, height, bytes: file.size, mime: file.type });
    } catch {
      URL.revokeObjectURL(url);
      setError('Your browser could not open that file as an image. HEIC files, for example, need converting to JPG or PNG first.');
    } finally {
      setBusy(false);
    }
  }, []);

  const loadSample = useCallback(async () => {
    try {
      const res = await fetch(sampleUrl);
      const blob = await res.blob();
      await loadFile(new File([blob], 'sample-thumbnail.jpg', { type: blob.type || 'image/jpeg' }));
    } catch {
      setError('Could not load the sample image. Try your own file instead.');
    }
  }, [sampleUrl, loadFile]);

  const clear = useCallback(() => {
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    currentUrl.current = null;
    setUpload(null);
    setError(null);
  }, []);

  return { upload, error, busy, loadFile, loadSample, clear };
}
