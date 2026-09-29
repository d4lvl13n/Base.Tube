'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, CSSProperties, DragEvent } from 'react';
import Link from 'next/link';
import CropEditor from './CropEditor';
import s from './video-to-thumbnail.module.css';
import {
  ASPECTS,
  FLAG_LABEL,
  canvasToBlob,
  clamp,
  cropAndScale,
  cropRect,
  downloadBlob,
  ensureFrameReady,
  estimateFps,
  fileBaseName,
  formatBytes,
  formatFps,
  formatTime,
  makePreviewUrl,
  renderNativeCanvas,
  scoreFrames,
  seekVideo,
  timeForFilename,
} from './frameTools';
import type { AspectMode, Crop, FrameFlag } from './frameTools';

type Status = 'idle' | 'loading' | 'ready' | 'error';
type FpsState = 'checking' | 'detected' | 'assumed';
type Format = 'jpg' | 'png';

interface VideoInfo {
  name: string;
  size: number;
  width: number;
  height: number;
  duration: number;
  fps: number;
  fpsState: FpsState;
}

interface Frame {
  id: string;
  time: number;
  previewUrl: string;
  source: 'capture' | 'auto';
  rank?: number;
  sharpRel?: number;
  flags: FrameFlag[];
  crop: Crop;
}

interface Notice {
  title: string;
  body: string;
}

interface ExportMessage {
  tone: 'ok' | 'warn' | 'error';
  text: string;
}

const ACCEPT = 'video/mp4,video/quicktime,video/webm,video/x-m4v,.mp4,.mov,.webm,.m4v';
const VIDEO_EXT = /\.(mp4|m4v|mov|webm|mkv|avi|ogv|ogg|3gp|mpg|mpeg|ts|mts|m2ts|wmv|flv)$/i;
const DEFAULT_CROP: Crop = { s: 1, cx: 0.5, cy: 0.5 };
const AUTO_COUNT = 12;
const YOUTUBE_LIMIT_BYTES = 2 * 1024 * 1024;

const CODEC_NOTICE: Notice = {
  title: 'Your browser cannot play this video',
  body: 'The file probably uses a format this browser cannot decode. That usually means ProRes, AVI, MKV, or HEVC (H.265) video. Convert it to an H.264 MP4 with a free app such as HandBrake, or try Safari, which plays the HEVC video that iPhones and many cameras record.',
};

function describeMediaError(video: HTMLVideoElement | null): Notice {
  if (video?.error?.code === 2) {
    return {
      title: 'The file could not be read',
      body: 'The browser stopped reading it partway through. Pick the file again. If it sits on a network drive or in a cloud folder, copy it to your computer first.',
    };
  }
  return CODEC_NOTICE;
}

/* ─── Small inline icons ─────────────────────────────────── */
const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

const PlayIcon = () => (
  <svg {...iconProps} fill="currentColor" stroke="none">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
  </svg>
);
const PauseIcon = () => (
  <svg {...iconProps} fill="currentColor" stroke="none">
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);
const StepBackIcon = () => (
  <svg {...iconProps}>
    <path d="M6 5v14" />
    <path d="M18 6l-8 6 8 6V6Z" />
  </svg>
);
const StepForwardIcon = () => (
  <svg {...iconProps}>
    <path d="M18 5v14" />
    <path d="M6 6l8 6-8 6V6Z" />
  </svg>
);
const SoundOnIcon = () => (
  <svg {...iconProps}>
    <path d="M4 10v4h4l5 4V6L8 10H4Z" />
    <path d="M16.5 8.5a5 5 0 0 1 0 7" />
  </svg>
);
const SoundOffIcon = () => (
  <svg {...iconProps}>
    <path d="M4 10v4h4l5 4V6L8 10H4Z" />
    <path d="M17 9l4 6M21 9l-4 6" />
  </svg>
);
const CaptureIcon = () => (
  <svg {...iconProps}>
    <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const SparkIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
  </svg>
);
const FilmIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
  </svg>
);

const FACTS = ['Nothing is uploaded', 'MP4, MOV and WebM', 'Frame by frame', 'Free, no signup'];

export default function FrameGrabber() {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const workRef = useRef<HTMLVideoElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const cancelRef = useRef(false);
  const queueRef = useRef<Promise<unknown>>(Promise.resolve());
  const idRef = useRef(0);
  const genRef = useRef(0);
  const urlRef = useRef<string | null>(null);
  const capturesRef = useRef<Frame[]>([]);
  const candidatesRef = useRef<Frame[]>([]);
  const busyCaptureRef = useRef(false);
  /** Presentation time of the frame currently on screen, reported by the browser. */
  const ptsRef = useRef<number | null>(null);
  /** The time we last moved to with a frame step. */
  const pendingRef = useRef<number | null>(null);

  const [status, setStatus] = useState<Status>('idle');
  const [notice, setNotice] = useState<Notice | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [info, setInfo] = useState<VideoInfo | null>(null);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const [captures, setCaptures] = useState<Frame[]>([]);
  const [candidates, setCandidates] = useState<Frame[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scan, setScan] = useState<{ done: number; total: number } | null>(null);
  const [message, setMessage] = useState<{ text: string; jump: boolean }>({ text: '', jump: false });
  const say = useCallback((text: string, jump = false) => setMessage({ text, jump }), []);

  const [aspect, setAspect] = useState<AspectMode>('16:9');
  const [format, setFormat] = useState<Format>('jpg');
  const [exporting, setExporting] = useState<'thumb' | 'full' | null>(null);
  const [exportMsg, setExportMsg] = useState<ExportMessage | null>(null);

  const setCapturesBoth = useCallback((next: Frame[]) => {
    capturesRef.current = next;
    setCaptures(next);
  }, []);
  const setCandidatesBoth = useCallback((next: Frame[]) => {
    candidatesRef.current = next;
    setCandidates(next);
  }, []);

  const nextId = () => `f${++idRef.current}`;

  /** Run one job at a time on the hidden helper video (scan, export, frame-rate probe). */
  const runExclusive = useCallback(<T,>(fn: () => Promise<T>): Promise<T> => {
    const next = queueRef.current.then(() => fn());
    queueRef.current = next.catch(() => undefined);
    return next;
  }, []);

  /* ─── Loading and resetting ───────────────────────────── */

  const revokeFrames = useCallback(() => {
    capturesRef.current.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    candidatesRef.current.forEach((f) => URL.revokeObjectURL(f.previewUrl));
  }, []);

  const resetAll = useCallback(() => {
    genRef.current += 1;
    cancelRef.current = true;
    revokeFrames();
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    capturesRef.current = [];
    candidatesRef.current = [];
    setCaptures([]);
    setCandidates([]);
    setSelectedId(null);
    setScan(null);
    setInfo(null);
    setVideoUrl(null);
    setPlaying(false);
    setCurrentTime(0);
    say('');
    setExportMsg(null);
    setNotice(null);
  }, [revokeFrames, say]);

  useEffect(
    () => () => {
      // Unmount: release every object URL we created.
      cancelRef.current = true;
      capturesRef.current.forEach((f) => URL.revokeObjectURL(f.previewUrl));
      candidatesRef.current.forEach((f) => URL.revokeObjectURL(f.previewUrl));
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  const loadFile = useCallback(
    (file: File | null | undefined) => {
      if (!file) return;
      if (!file.type.startsWith('video/') && !VIDEO_EXT.test(file.name)) {
        if (status === 'ready') {
          // Keep the open video and the frames already captured.
          say(`"${file.name}" is not a video, so nothing changed. Choose an MP4, MOV or WebM file.`);
          return;
        }
        resetAll();
        setNotice({
          title: 'That does not look like a video',
          body: 'Choose an MP4, MOV or WebM file. To grab a frame from an image or a PDF, use the thumbnail resizer instead.',
        });
        setStatus('error');
        return;
      }
      resetAll();
      const url = URL.createObjectURL(file);
      urlRef.current = url;
      setFileMeta({ name: file.name, size: file.size });
      setVideoUrl(url);
      setStatus('loading');
    },
    [resetAll, status, say],
  );

  const openPicker = () => inputRef.current?.click();

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    loadFile(e.target.files?.[0]);
    e.target.value = '';
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const onVideoLoaded = () => {
    const v = videoRef.current;
    if (!v || !fileMeta || status === 'ready') return;
    if (!v.videoWidth || !v.videoHeight) {
      setNotice({
        title: 'This file has no picture',
        body: 'The browser found sound but no video track it can show. Try another file, or convert this one to an H.264 MP4.',
      });
      setStatus('error');
      return;
    }
    if (!Number.isFinite(v.duration) || v.duration <= 0) {
      setNotice({
        title: 'This video does not report its length',
        body: 'Some screen recordings are saved without a length, so the browser cannot scrub them. Re-save the file as an MP4 or WebM in a video editor, then try again.',
      });
      setStatus('error');
      return;
    }
    setInfo({
      name: fileMeta.name,
      size: fileMeta.size,
      width: v.videoWidth,
      height: v.videoHeight,
      duration: v.duration,
      fps: 30,
      fpsState: 'checking',
    });
    setCurrentTime(0);
    setAspect('16:9');
    setStatus('ready');
  };

  const onVideoError = () => {
    if (!videoUrl) return;
    setNotice(describeMediaError(videoRef.current));
    setStatus('error');
    setPlaying(false);
  };

  // Track which frame is on screen (its exact presentation time) for accurate frame steps.
  useEffect(() => {
    const v = videoRef.current;
    ptsRef.current = null;
    pendingRef.current = null;
    if (status !== 'ready' || !v || !('requestVideoFrameCallback' in v)) return;
    let stopped = false;
    let handle = 0;
    const onFrame = (_now: number, meta: VideoFrameCallbackMetadata) => {
      ptsRef.current = meta.mediaTime;
      if (!stopped) handle = v.requestVideoFrameCallback(onFrame);
    };
    handle = v.requestVideoFrameCallback(onFrame);
    return () => {
      stopped = true;
      v.cancelVideoFrameCallback(handle);
    };
  }, [status, videoUrl]);

  // When a video is ready, bring the workspace into view and measure the frame rate.
  useEffect(() => {
    if (status !== 'ready' || !videoUrl) return;
    let cancelled = false;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    workspaceRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

    runExclusive(async () => {
      const w = workRef.current;
      if (!w) return;
      try {
        await ensureFrameReady(w);
        const fps = await estimateFps(w);
        w.pause();
        if (cancelled) return;
        setInfo((prev) =>
          prev ? { ...prev, fps: fps ?? 30, fpsState: fps ? 'detected' : 'assumed' } : prev,
        );
      } catch {
        if (!cancelled) setInfo((prev) => (prev ? { ...prev, fpsState: 'assumed' } : prev));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [status, videoUrl, runExclusive]);

  /* ─── Playback ────────────────────────────────────────── */

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      const v = videoRef.current;
      if (v) setCurrentTime(v.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const duration = info?.duration ?? 0;
  const fps = info?.fps ?? 30;

  const seekTo = useCallback(
    (t: number) => {
      const v = videoRef.current;
      if (!v || !info) return;
      const target = clamp(t, 0, info.duration);
      v.currentTime = target;
      setCurrentTime(target);
    },
    [info],
  );

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) {
      if (v.ended || v.currentTime >= v.duration - 0.05) v.currentTime = 0;
      void v.play().catch(() => undefined);
    } else {
      v.pause();
    }
  }, []);

  const stepFrame = useCallback(
    (dir: 1 | -1) => {
      const v = videoRef.current;
      if (!v || !info) return;
      v.pause();
      const fd = 1 / info.fps;
      const cur = v.currentTime;
      const pts = ptsRef.current;
      // A point in the middle of the frame on screen. The browser tells us the real
      // presentation time of that frame, so steps stay exact even when the frame rate
      // reading is slightly off (WebM and MKV store times in whole milliseconds).
      let base: number;
      if (pts !== null && cur - pts > -1e-3 && cur - pts < fd * 1.05) {
        base = pts + fd / 2;
      } else if (pts !== null && Math.abs(cur - (pendingRef.current ?? -1)) < 1e-6) {
        // We just moved the playhead ourselves and the new frame is not on screen yet:
        // the target we set is already the middle of the frame we aimed for.
        base = cur;
      } else {
        base = (Math.floor(cur * info.fps + 1e-6) + 0.5) / info.fps;
      }
      const target = clamp(base + dir * fd, fd / 2, Math.max(fd / 2, info.duration - fd / 2));
      pendingRef.current = target;
      v.currentTime = target;
      setCurrentTime(target);
    },
    [info],
  );

  const capture = useCallback(async () => {
    const v = videoRef.current;
    if (!v || !info || v.readyState < 2 || busyCaptureRef.current) return;
    busyCaptureRef.current = true;
    const gen = genRef.current;
    try {
      v.pause();
      const time = v.currentTime;
      const existing = capturesRef.current.find((c) => Math.abs(c.time - time) < 0.5 / info.fps);
      if (existing) {
        setSelectedId(existing.id);
        say(`You already captured this frame (${formatTime(existing.time)}).`);
        return;
      }
      const previewUrl = await makePreviewUrl(v);
      if (gen !== genRef.current) {
        URL.revokeObjectURL(previewUrl);
        return;
      }
      const frame: Frame = {
        id: nextId(),
        time,
        previewUrl,
        source: 'capture',
        flags: [],
        crop: { ...DEFAULT_CROP },
      };
      setCapturesBoth([...capturesRef.current, frame]);
      setSelectedId(frame.id);
      setExportMsg(null);
      say(`Captured the frame at ${formatTime(time)}. Crop and download it below.`, true);
    } catch {
      say('Could not capture this frame. Try stepping one frame and capturing again.');
    } finally {
      busyCaptureRef.current = false;
    }
  }, [info, setCapturesBoth, say]);

  // Keyboard shortcuts. The latest handlers live in a ref so the listener is bound once.
  const keysRef = useRef({ togglePlay, stepFrame, seekTo, capture, currentTime });
  useEffect(() => {
    keysRef.current = { togglePlay, stepFrame, seekTo, capture, currentTime };
  });

  useEffect(() => {
    if (status !== 'ready') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest('[data-own-keys]')) return;
      const tag = t?.tagName;
      if (tag === 'TEXTAREA' || tag === 'SELECT' || t?.isContentEditable) return;
      if (tag === 'INPUT' && (t as HTMLInputElement).type !== 'range') return;
      if ((tag === 'BUTTON' || tag === 'A' || tag === 'SUMMARY') && (e.key === ' ' || e.key === 'Enter')) return;
      const k = keysRef.current;
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          k.togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (e.shiftKey) {
            videoRef.current?.pause();
            k.seekTo(k.currentTime - 1);
          } else k.stepFrame(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (e.shiftKey) {
            videoRef.current?.pause();
            k.seekTo(k.currentTime + 1);
          } else k.stepFrame(1);
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          void k.capture();
          break;
        default:
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [status]);

  /* ─── Frames ──────────────────────────────────────────── */

  const allFrames = useMemo(() => [...captures, ...candidates], [captures, candidates]);
  const selected = useMemo(() => allFrames.find((f) => f.id === selectedId) ?? null, [allFrames, selectedId]);

  const selectFrame = useCallback((f: Frame) => {
    setSelectedId(f.id);
    setExportMsg(null);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = f.time;
      setCurrentTime(f.time);
    }
  }, []);

  const updateCrop = useCallback(
    (id: string, crop: Crop) => {
      const patch = (list: Frame[]) => list.map((f) => (f.id === id ? { ...f, crop } : f));
      setCapturesBoth(patch(capturesRef.current));
      setCandidatesBoth(patch(candidatesRef.current));
    },
    [setCapturesBoth, setCandidatesBoth],
  );

  const removeCapture = (f: Frame) => {
    URL.revokeObjectURL(f.previewUrl);
    setCapturesBoth(capturesRef.current.filter((c) => c.id !== f.id));
    if (selectedId === f.id) setSelectedId(null);
  };

  const keepCandidate = async (f: Frame) => {
    if (capturesRef.current.some((c) => Math.abs(c.time - f.time) < 1e-3)) return;
    const gen = genRef.current;
    try {
      const blob = await (await fetch(f.previewUrl)).blob();
      if (gen !== genRef.current) return;
      const copy: Frame = {
        ...f,
        id: nextId(),
        source: 'capture',
        rank: undefined,
        flags: [],
        previewUrl: URL.createObjectURL(blob),
      };
      setCapturesBoth([...capturesRef.current, copy]);
      say(`Kept the frame at ${formatTime(f.time)}.`);
    } catch {
      say('Could not keep that frame. Select it and export it directly instead.');
    }
  };

  /* ─── Auto-pick ───────────────────────────────────────── */

  const runAutoPick = async () => {
    const w = workRef.current;
    if (!w || !info || scan) return;
    const gen = genRef.current;
    cancelRef.current = false;
    const n = Math.max(1, Math.min(AUTO_COUNT, Math.floor((info.duration * info.fps) / 3)));
    const times = Array.from({ length: n }, (_, i) => info.duration * (0.03 + (0.94 * (i + 0.5)) / n));
    setScan({ done: 0, total: n });
    say('');
    try {
      const result = await runExclusive(() =>
        scoreFrames(w, times, {
          neighbourOffset: Math.max(0.1, 3 / info.fps),
          onProgress: (done, total) => setScan({ done, total }),
          isCancelled: () => cancelRef.current || gen !== genRef.current,
        }),
      );
      if (!result) return;
      if (gen !== genRef.current) {
        result.forEach((r) => URL.revokeObjectURL(r.previewUrl));
        return;
      }
      candidatesRef.current.forEach((f) => URL.revokeObjectURL(f.previewUrl));
      const frames: Frame[] = result.map((r, i) => ({
        id: nextId(),
        time: r.time,
        previewUrl: r.previewUrl,
        source: 'auto',
        rank: i + 1,
        sharpRel: r.sharpRel,
        flags: r.flags,
        crop: { ...DEFAULT_CROP },
      }));
      setCandidatesBoth(frames);
      if (frames[0]) selectFrame(frames[0]);
      say(`Ranked ${frames.length} sampled moments. Number 1 is selected below.`, true);
    } catch {
      say('Auto-pick stopped because the browser could not seek through this file. You can still step through it by hand.');
    } finally {
      setScan(null);
    }
  };

  const cancelAutoPick = () => {
    cancelRef.current = true;
    say('Auto-pick cancelled.');
  };

  /* ─── Export ──────────────────────────────────────────── */

  const target = ASPECTS[aspect];
  const cropArea = useMemo(
    () => (selected && info ? cropRect(info.width, info.height, target.ratio, selected.crop) : null),
    [selected, info, target.ratio],
  );
  const upscaled = cropArea ? cropArea.w < target.w - 0.5 || cropArea.h < target.h - 0.5 : false;
  const cropMovable =
    cropArea && info ? cropArea.w < info.width - 0.5 || cropArea.h < info.height - 0.5 : false;
  const isPortrait = info ? info.height > info.width : false;

  const exportFrame = async (mode: 'thumb' | 'full') => {
    const w = workRef.current;
    if (!w || !info || !selected) return;
    const gen = genRef.current;
    const frame = selected;
    setExporting(mode);
    setExportMsg(null);
    try {
      const source = await runExclusive(async () => {
        await seekVideo(w, frame.time);
        return renderNativeCanvas(w);
      });
      if (gen !== genRef.current) return;
      const out =
        mode === 'full'
          ? source
          : cropAndScale(source, cropRect(source.width, source.height, target.ratio, frame.crop), target.w, target.h);
      const jpg = format === 'jpg';
      const blob = await canvasToBlob(out, jpg ? 'image/jpeg' : 'image/png', 0.92);
      const name = `${fileBaseName(info.name)}-${timeForFilename(frame.time)}-${out.width}x${out.height}.${jpg ? 'jpg' : 'png'}`;
      downloadBlob(blob, name);
      const overLimit = mode === 'thumb' && aspect === '16:9' && blob.size > YOUTUBE_LIMIT_BYTES;
      setExportMsg({
        tone: overLimit ? 'warn' : 'ok',
        text: overLimit
          ? `Saved ${name}: ${out.width}×${out.height}, ${formatBytes(blob.size)}. That is over YouTube's 2 MB thumbnail limit. Export it as JPG to make it smaller.`
          : `Saved ${name}: ${out.width}×${out.height}, ${formatBytes(blob.size)}.`,
      });
    } catch {
      setExportMsg({
        tone: 'error',
        text: 'Could not export this frame. The browser may have run out of memory on a very large video. Try the 1280×720 export instead of the full frame.',
      });
    } finally {
      setExporting(null);
    }
  };

  const scrollToExport = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    exportRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  /* ─── Render ──────────────────────────────────────────── */

  const fpsLabel = !info
    ? ''
    : info.fpsState === 'detected'
      ? `${formatFps(info.fps)} fps`
      : info.fpsState === 'checking'
        ? 'Reading frame rate'
        : `${formatFps(info.fps)} fps (assumed)`;

  const frameNumber = Math.floor(currentTime * fps + 1e-6) + 1;
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const markers = useMemo(
    () => [
      ...candidates.map((f) => ({ id: f.id, t: f.time, kind: 'auto' as const })),
      ...captures.map((f) => ({ id: f.id, t: f.time, kind: 'capture' as const })),
    ],
    [candidates, captures],
  );

  const ext = format === 'jpg' ? 'JPG' : 'PNG';
  const isKept = (f: Frame) => captures.some((c) => Math.abs(c.time - f.time) < 1e-3);

  return (
    <div className={s.root}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className={s.fileInput}
        aria-label="Choose a video file"
        tabIndex={-1}
        onChange={onPick}
      />

      {status !== 'ready' && (
        <>
          <div
            className={`v2-tool-dropzone ${s.dropzone} ${dragOver ? s.dropzoneActive : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <div className="v2-tool-dropzone-icon">
              <FilmIcon />
            </div>
            <p className="v2-tool-dropzone-title">
              {status === 'loading' ? 'Opening your video…' : 'Drop a video here'}
            </p>
            <p className={s.dropSub}>MP4, MOV or WebM. Any length. It stays on your device.</p>
            <div className="v2-tool-dropzone-actions">
              <button
                type="button"
                className={`v2-btn v2-btn-primary ${s.focusRing}`}
                onClick={openPicker}
                disabled={status === 'loading'}
              >
                Choose a video
              </button>
            </div>
            {notice && (
              <div className={s.notice} role="alert">
                <p className={s.noticeTitle}>{notice.title}</p>
                <p className={s.noticeBody}>{notice.body}</p>
              </div>
            )}
          </div>
          <ul className={s.facts}>
            {FACTS.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </>
      )}

      {videoUrl && (
        <div className={s.workspace} hidden={status !== 'ready'} ref={workspaceRef}>
          <div className={s.metaBar}>
            <span className={s.metaName} title={info?.name}>
              {info?.name}
            </span>
            {info && (
              <>
                <span className={s.metaItem}>
                  {info.width}×{info.height}
                </span>
                <span className={s.metaItem}>{fpsLabel}</span>
                <span className={s.metaItem}>{formatTime(info.duration)} long</span>
                <span className={s.metaItem}>{formatBytes(info.size)}</span>
              </>
            )}
            <button type="button" className={`${s.linkBtn} ${s.focusRing}`} onClick={openPicker}>
              Choose another video
            </button>
          </div>

          <div className={s.stage}>
            <video
              ref={videoRef}
              className={s.video}
              src={videoUrl}
              playsInline
              preload="auto"
              muted={muted}
              onLoadedData={onVideoLoaded}
              onError={onVideoError}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onTimeUpdate={(e) => {
                if (!playing) setCurrentTime(e.currentTarget.currentTime);
              }}
              onSeeked={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onClick={togglePlay}
            />
          </div>

          <div className={s.timeline}>
            <input
              type="range"
              className={`${s.range} ${s.focusRing}`}
              min={0}
              max={duration || 1}
              step="any"
              value={currentTime}
              style={{ '--pct': `${pct}%` } as CSSProperties}
              aria-label="Video position"
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
            />
            <div className={s.markers} aria-hidden>
              {markers.map((m) => (
                <span
                  key={m.id}
                  className={m.kind === 'capture' ? s.markerCapture : s.markerAuto}
                  style={{ left: `${duration ? (m.t / duration) * 100 : 0}%` }}
                />
              ))}
            </div>
          </div>

          <div className={s.controls}>
            <div className={s.transport}>
              <button
                type="button"
                className={`${s.iconBtn} ${s.focusRing}`}
                onClick={() => stepFrame(-1)}
                aria-label="Back one frame"
                title="Back one frame (Left arrow)"
              >
                <StepBackIcon />
              </button>
              <button
                type="button"
                className={`${s.iconBtn} ${s.iconBtnLg} ${s.focusRing}`}
                onClick={togglePlay}
                aria-label={playing ? 'Pause' : 'Play'}
                title={playing ? 'Pause (Space)' : 'Play (Space)'}
              >
                {playing ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button
                type="button"
                className={`${s.iconBtn} ${s.focusRing}`}
                onClick={() => stepFrame(1)}
                aria-label="Forward one frame"
                title="Forward one frame (Right arrow)"
              >
                <StepForwardIcon />
              </button>
              <button
                type="button"
                className={`${s.iconBtn} ${s.focusRing}`}
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
                aria-pressed={!muted}
                title={muted ? 'Sound is off' : 'Sound is on'}
              >
                {muted ? <SoundOffIcon /> : <SoundOnIcon />}
              </button>
              <div className={s.timeReadout}>
                <span className={s.time}>{formatTime(currentTime)}</span>
                <span className={s.timeSub}>
                  / {formatTime(duration)} · frame {frameNumber}
                </span>
              </div>
            </div>

            <div className={s.actions}>
              <button
                type="button"
                className={`v2-btn v2-btn-primary ${s.focusRing}`}
                onClick={() => void capture()}
              >
                <CaptureIcon />
                Capture frame
              </button>
              {scan ? (
                <button type="button" className={`v2-btn v2-btn-ghost ${s.focusRing}`} onClick={cancelAutoPick}>
                  Scanning {scan.done} of {scan.total}. Cancel
                </button>
              ) : (
                <button
                  type="button"
                  className={`v2-btn v2-btn-ghost ${s.focusRing}`}
                  onClick={() => void runAutoPick()}
                >
                  <SparkIcon />
                  Auto-pick sharpest
                </button>
              )}
            </div>
          </div>

          <div className={s.hintRow}>
            <p className={s.hints}>
              <kbd>Space</kbd> play or pause <span aria-hidden>·</span> <kbd>←</kbd> <kbd>→</kbd> one frame{' '}
              <span aria-hidden>·</span> <kbd>Shift</kbd> + <kbd>←</kbd> <kbd>→</kbd> one second <span aria-hidden>·</span>{' '}
              <kbd>C</kbd> capture
            </p>
            <p className={s.status} role="status" aria-live="polite">
              {message.text}
              {message.text && message.jump && selected && (
                <>
                  {' '}
                  <button type="button" className={`${s.linkBtn} ${s.focusRing}`} onClick={scrollToExport}>
                    Go to export
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Captured frames */}
          <section className={s.section} aria-labelledby="vtt-frames">
            <div className={s.sectionHead}>
              <h3 id="vtt-frames" className={s.sectionTitle}>
                Your frames {captures.length > 0 && <span className={s.count}>{captures.length}</span>}
              </h3>
            </div>
            {captures.length === 0 ? (
              <p className={s.empty}>
                Nothing captured yet. Pause on the moment you want and press Capture frame.
              </p>
            ) : (
              <ul className={s.strip}>
                {captures.map((f) => (
                  <li key={f.id} className={s.stripItem}>
                    <button
                      type="button"
                      className={`${s.tile} ${f.id === selectedId ? s.tileActive : ''} ${s.focusRing}`}
                      onClick={() => selectFrame(f)}
                      aria-pressed={f.id === selectedId}
                      aria-label={`Frame at ${formatTime(f.time)}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.previewUrl} alt="" draggable={false} />
                      <span className={s.tileTime}>{formatTime(f.time)}</span>
                    </button>
                    <button
                      type="button"
                      className={`${s.tileRemove} ${s.focusRing}`}
                      onClick={() => removeCapture(f)}
                      aria-label={`Remove frame at ${formatTime(f.time)}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Auto-pick results */}
          {candidates.length > 0 && (
            <section className={s.section} aria-labelledby="vtt-cands">
              <div className={s.sectionHead}>
                <h3 id="vtt-cands" className={s.sectionTitle}>
                  Sharpest candidates
                </h3>
                <p className={s.sectionNote}>
                  {candidates.length} moments spread across the video, ranked by sharpness, brightness and contrast. This
                  is image quality only. It says nothing about clicks.
                </p>
              </div>
              <ol className={s.candGrid}>
                {candidates.map((f) => (
                  <li key={f.id} className={s.candItem}>
                    <button
                      type="button"
                      className={`${s.tile} ${f.id === selectedId ? s.tileActive : ''} ${s.focusRing}`}
                      onClick={() => selectFrame(f)}
                      aria-pressed={f.id === selectedId}
                      aria-label={`Number ${f.rank}, frame at ${formatTime(f.time)}, sharpness ${f.sharpRel} percent${
                        f.flags.length ? `, ${f.flags.map((x) => FLAG_LABEL[x]).join(', ')}` : ''
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.previewUrl} alt="" draggable={false} />
                      <span className={s.rank}>{f.rank}</span>
                      <span className={s.tileTime}>{formatTime(f.time)}</span>
                    </button>
                    <div className={s.candMeta}>
                      <span className={f.flags.length ? s.flagWarn : s.flagOk}>
                        {f.flags.length
                          ? f.flags.map((x) => FLAG_LABEL[x]).join(', ')
                          : `Sharpness ${f.sharpRel}%`}
                      </span>
                      <button
                        type="button"
                        className={`${s.linkBtn} ${s.focusRing}`}
                        onClick={() => void keepCandidate(f)}
                        disabled={isKept(f)}
                      >
                        {isKept(f) ? 'Kept' : 'Keep'}
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Export */}
          <section className={`${s.section} ${s.exportSection}`} aria-labelledby="vtt-export" ref={exportRef}>
            <div className={s.sectionHead}>
              <h3 id="vtt-export" className={s.sectionTitle}>
                Crop and export
              </h3>
            </div>

            {!selected || !info ? (
              <p className={s.empty}>
                Capture a frame, or pick one of the candidates, to crop it and download it.
              </p>
            ) : (
              <div className={s.exportGrid}>
                <div className={s.exportPreview}>
                  <CropEditor
                    src={selected.previewUrl}
                    fw={info.width}
                    fh={info.height}
                    ratio={target.ratio}
                    crop={selected.crop}
                    onChange={(c) => updateCrop(selected.id, c)}
                    label={`Crop frame for the ${formatTime(selected.time)} frame. Drag it, or use the arrow keys to move it.`}
                    maxHeight={isPortrait ? 480 : 420}
                  />
                  <p className={s.previewCaption}>
                    Frame at {formatTime(selected.time)}
                    {selected.rank ? `, number ${selected.rank} of ${candidates.length}` : ''}.{' '}
                    {cropMovable
                      ? 'Drag the crop frame, click to move it, or focus it and use the arrow keys.'
                      : 'The crop frame covers the whole picture. Raise Zoom to move in on a detail, then drag the frame.'}
                  </p>
                </div>

                <div className={s.exportOptions} data-own-keys>
                  {isPortrait && (
                    <p className={s.callout}>
                      This is a vertical video. Choose 16:9 for a regular YouTube thumbnail: you get a wide slice you can
                      move up and down. Choose 9:16 for a Shorts-shaped frame.
                    </p>
                  )}

                  <div className={s.field}>
                    <span className={s.fieldLabel} id="vtt-shape">
                      Shape
                    </span>
                    <div className={s.segmented} role="group" aria-labelledby="vtt-shape">
                      {(Object.keys(ASPECTS) as AspectMode[]).map((key) => (
                        <button
                          key={key}
                          type="button"
                          aria-pressed={aspect === key}
                          className={`${s.segment} ${aspect === key ? s.segmentActive : ''} ${s.focusRing}`}
                          onClick={() => {
                            setAspect(key);
                            setExportMsg(null);
                          }}
                        >
                          {key} <span className={s.segmentSub}>{ASPECTS[key].w}×{ASPECTS[key].h}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={s.field}>
                    <label className={s.fieldLabel} htmlFor="vtt-zoom">
                      Zoom <span className={s.fieldValue}>{(1 / selected.crop.s).toFixed(2).replace(/\.?0+$/, '')}×</span>
                    </label>
                    <input
                      id="vtt-zoom"
                      type="range"
                      className={`${s.range} ${s.rangeSm} ${s.focusRing}`}
                      min={1}
                      max={4}
                      step={0.05}
                      value={1 / selected.crop.s}
                      style={{ '--pct': `${((1 / selected.crop.s - 1) / 3) * 100}%` } as CSSProperties}
                      data-own-keys
                      onChange={(e) => updateCrop(selected.id, { ...selected.crop, s: 1 / parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className={s.field}>
                    <span className={s.fieldLabel} id="vtt-format">
                      Format
                    </span>
                    <div className={s.segmented} role="group" aria-labelledby="vtt-format">
                      {(['jpg', 'png'] as Format[]).map((f) => (
                        <button
                          key={f}
                          type="button"
                          aria-pressed={format === f}
                          className={`${s.segment} ${format === f ? s.segmentActive : ''} ${s.focusRing}`}
                          onClick={() => {
                            setFormat(f);
                            setExportMsg(null);
                          }}
                        >
                          {f.toUpperCase()}
                          <span className={s.segmentSub}>{f === 'jpg' ? 'smaller file' : 'lossless'}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {cropArea && (
                    <p className={s.note}>
                      Crop area: {Math.round(cropArea.w)}×{Math.round(cropArea.h)} px of the original, exported at{' '}
                      {target.w}×{target.h}.
                      {upscaled && (
                        <span className={s.noteWarn}>
                          {' '}
                          The original is smaller than the export size, so the image is enlarged and will look softer.
                        </span>
                      )}
                    </p>
                  )}

                  <div className={s.exportButtons}>
                    <button
                      type="button"
                      className={`v2-btn v2-btn-primary ${s.focusRing}`}
                      onClick={() => void exportFrame('thumb')}
                      disabled={exporting !== null}
                    >
                      {exporting === 'thumb' ? 'Preparing…' : `Download ${target.w}×${target.h} ${ext}`}
                    </button>
                    <button
                      type="button"
                      className={`v2-btn v2-btn-ghost ${s.focusRing}`}
                      onClick={() => void exportFrame('full')}
                      disabled={exporting !== null}
                    >
                      {exporting === 'full' ? 'Preparing…' : `Full frame ${info.width}×${info.height} ${ext}`}
                    </button>
                  </div>

                  <div className={s.exportMsgWrap} role="status" aria-live="polite">
                    {exportMsg && (
                      <p
                        className={
                          exportMsg.tone === 'error' ? s.msgError : exportMsg.tone === 'warn' ? s.msgWarn : s.msgOk
                        }
                      >
                        {exportMsg.text}
                      </p>
                    )}
                  </div>

                  <p className={s.note}>
                    <Link href="/tools/youtube-thumbnail-resizer" className={s.inlineLink}>
                      Open in resizer →
                    </Link>{' '}
                    Download the frame first, then drop it into the resizer to fit YouTube&apos;s size and file limits.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Hidden helper video: Auto-pick, full-resolution export and the frame-rate probe run here,
          so the video you are watching never jumps. */}
      {videoUrl && (
        <video
          ref={workRef}
          className={s.probe}
          src={videoUrl}
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          aria-hidden
        />
      )}
    </div>
  );
}
