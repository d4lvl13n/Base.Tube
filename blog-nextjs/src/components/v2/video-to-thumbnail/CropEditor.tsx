'use client';

import { useRef } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import s from './video-to-thumbnail.module.css';
import { clamp, cropRect } from './frameTools';
import type { Crop } from './frameTools';

interface Props {
  src: string;
  /** Size of the original frame in pixels. */
  fw: number;
  fh: number;
  /** Width / height of the crop shape (16/9 or 9/16). */
  ratio: number;
  crop: Crop;
  onChange: (crop: Crop) => void;
  /** Tallest the picture may be on screen, in px. */
  maxHeight?: number;
  label: string;
}

/**
 * The picture with a movable crop frame on top. Drag the frame, click anywhere to
 * move it there, or focus it and use the arrow keys.
 */
export default function CropEditor({ src, fw, fh, ratio, crop, onChange, maxHeight = 440, label }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  const rect = cropRect(fw, fh, ratio, crop);
  const movable = rect.w < fw - 0.5 || rect.h < fh - 0.5;

  const toSource = (e: PointerEvent<HTMLDivElement>) => {
    const b = stageRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - b.left) / b.width) * fw,
      y: ((e.clientY - b.top) / b.height) * fh,
    };
  };

  const moveTo = (nx: number, ny: number) => {
    const x = clamp(nx, 0, fw - rect.w);
    const y = clamp(ny, 0, fh - rect.h);
    onChange({ ...crop, cx: (x + rect.w / 2) / fw, cy: (y + rect.h / 2) / fh });
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!movable || e.button !== 0) return;
    const p = toSource(e);
    const inside = p.x >= rect.x && p.x <= rect.x + rect.w && p.y >= rect.y && p.y <= rect.y + rect.h;
    if (inside) {
      drag.current = { dx: p.x - rect.x, dy: p.y - rect.y };
    } else {
      // Jump: centre the frame under the pointer, then keep dragging from there.
      drag.current = { dx: rect.w / 2, dy: rect.h / 2 };
      moveTo(p.x - rect.w / 2, p.y - rect.h / 2);
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const p = toSource(e);
    moveTo(p.x - drag.current.dx, p.y - drag.current.dy);
  };

  const endDrag = () => {
    drag.current = null;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = (e.shiftKey ? 0.05 : 0.01) * 1;
    let dx = 0;
    let dy = 0;
    if (e.key === 'ArrowLeft') dx = -step;
    else if (e.key === 'ArrowRight') dx = step;
    else if (e.key === 'ArrowUp') dy = -step;
    else if (e.key === 'ArrowDown') dy = step;
    else return;
    e.preventDefault();
    moveTo(rect.x + dx * fw, rect.y + dy * fh);
  };

  const pct = {
    left: `${(rect.x / fw) * 100}%`,
    top: `${(rect.y / fh) * 100}%`,
    width: `${(rect.w / fw) * 100}%`,
    height: `${(rect.h / fh) * 100}%`,
  };

  const frameRatio = fw / fh;

  return (
    <div
      ref={stageRef}
      className={`${s.cropStage} ${movable ? s.cropMovable : ''}`}
      style={{ width: `min(100%, ${Math.round(maxHeight * frameRatio)}px)`, aspectRatio: `${fw} / ${fh}` }}
      tabIndex={0}
      role="group"
      aria-label={label}
      data-own-keys
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.cropImg} src={src} alt="" draggable={false} />
      <div className={s.cropBox} style={pct} aria-hidden />
    </div>
  );
}
