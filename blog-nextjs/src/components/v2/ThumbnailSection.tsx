'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { TrendingUp, Wand2, AlertTriangle, Check } from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   RESEND DESIGN TOKENS
───────────────────────────────────────────────────────── */
const FROST  = 'rgba(214, 235, 253, 0.19)';
const ORANGE = '#ff801f';
const BLUE   = '#3b9eff';
const GREEN  = '#11ff99';
const MUTED  = '#a1a4a5';
const DIM    = '#464a4d';

/* Circular SVG ring */
const RING_R    = 34;
const RING_CIRC = 2 * Math.PI * RING_R; // ≈ 213.6

/* ─────────────────────────────────────────────────────────
   CORNER BRACKET — reticle accent for detection boxes
───────────────────────────────────────────────────────── */
function CornerBrackets({ color, size = 10, thickness = 2 }: { color: string; size?: number; thickness?: number }) {
  const s = { position: 'absolute' as const, width: size, height: size };
  const b = { width: size, height: thickness, background: color };
  const r = { width: thickness, height: size, background: color };

  return (
    <>
      <div style={{ ...s, top: 0, left: 0 }}>
        <div style={{ ...b, position: 'absolute', top: 0, left: 0 }} />
        <div style={{ ...r, position: 'absolute', top: 0, left: 0 }} />
      </div>
      <div style={{ ...s, top: 0, right: 0 }}>
        <div style={{ ...b, position: 'absolute', top: 0, right: 0 }} />
        <div style={{ ...r, position: 'absolute', top: 0, right: 0 }} />
      </div>
      <div style={{ ...s, bottom: 0, left: 0 }}>
        <div style={{ ...b, position: 'absolute', bottom: 0, left: 0 }} />
        <div style={{ ...r, position: 'absolute', bottom: 0, left: 0 }} />
      </div>
      <div style={{ ...s, bottom: 0, right: 0 }}>
        <div style={{ ...b, position: 'absolute', bottom: 0, right: 0 }} />
        <div style={{ ...r, position: 'absolute', bottom: 0, right: 0 }} />
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   CTR OPTIMIZER VISUAL
   Phases: thumbnail → scan line → detection boxes → ring score → bars → tip
───────────────────────────────────────────────────────── */
function CTROptimizerVisual() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const [phase,    setPhase]    = useState(0);
  const [score,    setScore]    = useState(0);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!inView) return;

    const t0 = setTimeout(() => setScanning(true), 350);
    const t1 = setTimeout(() => setPhase(1), 350);   // scan starts
    const t2 = setTimeout(() => setPhase(2), 1350);  // detection boxes
    const t3 = setTimeout(() => {
      setPhase(3);
      let n = 0;
      const iv = setInterval(() => {
        n += 3;
        if (n >= 74) { setScore(74); clearInterval(iv); }
        else setScore(n);
      }, 14);
    }, 1750);
    const t4 = setTimeout(() => setPhase(4), 3100);

    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout);
  }, [inView]);

  const METRICS = [
    { label: 'Face prominence', pct: 92, color: ORANGE },
    { label: 'Text legibility', pct: 61, color: BLUE   },
    { label: 'Contrast ratio',  pct: 78, color: GREEN  },
  ];

  return (
    <div
      ref={ref}
      style={{ position: 'absolute', inset: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}
    >
      {/* Ambient glow behind panel */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 60% 40% at 60% 20%, rgba(255,128,31,0.06) 0%, transparent 70%)',
      }} />

      {/* ── THUMBNAIL ─────────────────────────────────────── */}
      <motion.div
        style={{
          position: 'relative', flexShrink: 0, zIndex: 1,
          borderRadius: 10, overflow: 'hidden', aspectRatio: '16/9',
          background: 'linear-gradient(135deg, #1a0e2a 0%, #0e1525 45%, #080808 100%)',
          border: `1px solid ${FROST}`,
          boxShadow: `rgba(176,199,217,0.1) 0 0 0 1px`,
        }}
        initial={{ opacity: 0, y: 6 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45 }}
      >
        {/* Inner radial */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 65% 50%, rgba(59,158,255,0.05) 0%, transparent 60%)' }} />

        {/* Person silhouette — left side */}
        <div style={{ position: 'absolute', left: '6%', top: '8%', width: '22%', height: '84%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3%' }}>
          <div style={{ width: '55%', aspectRatio: '1', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }} />
          <div style={{ width: '82%', height: '54%', borderRadius: '40% 40% 0 0', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }} />
        </div>

        {/* Title text bars — right side */}
        <div style={{ position: 'absolute', right: '6%', top: '15%', width: '54%', display: 'flex', flexDirection: 'column', gap: '7%' }}>
          <div style={{ height: 10, borderRadius: 3, background: 'rgba(255,255,255,0.13)' }} />
          <div style={{ height: 10, borderRadius: 3, background: 'rgba(255,255,255,0.09)', width: '80%' }} />
          <div style={{ height: 8,  borderRadius: 3, background: 'rgba(255,255,255,0.05)', width: '58%' }} />
        </div>

        {/* Duration badge */}
        <div style={{
          position: 'absolute', bottom: 6, right: 6,
          background: 'rgba(0,0,0,0.85)', padding: '2px 5px', borderRadius: 3,
          fontSize: 8, fontWeight: 700, color: '#fff', fontFamily: 'monospace', letterSpacing: '0.4px',
        }}>12:47</div>

        {/* ── SCAN LINE ── */}
        {scanning && (
          <motion.div
            style={{
              position: 'absolute', left: 0, right: 0, height: 2, zIndex: 20,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,128,31,0.7) 25%, ${ORANGE} 50%, rgba(255,128,31,0.7) 75%, transparent 100%)`,
              boxShadow: `0 0 18px 8px rgba(255,128,31,0.45), 0 0 40px 16px rgba(255,128,31,0.15)`,
            }}
            initial={{ top: '0%', opacity: 0 }}
            animate={{ top: '105%', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.82, ease: 'linear' }}
          />
        )}

        {/* ── FACE DETECTION (orange) ── */}
        {phase >= 2 && (
          <motion.div
            style={{
              position: 'absolute', left: '3.5%', top: '4%', width: '27%', height: '92%', zIndex: 10,
              border: `1.5px solid transparent`, borderRadius: 7,
              boxShadow: `0 0 0 1.5px ${ORANGE}, 0 0 20px rgba(255,128,31,0.35), inset 0 0 24px rgba(255,128,31,0.04)`,
            }}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <CornerBrackets color={ORANGE} size={11} thickness={2} />
            <motion.div
              style={{
                position: 'absolute', top: -18, left: 0,
                background: ORANGE, color: '#000',
                fontSize: 8, fontWeight: 800, padding: '2px 7px', borderRadius: 3,
                letterSpacing: '0.5px', whiteSpace: 'nowrap',
              }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              FACE — 94%
            </motion.div>
          </motion.div>
        )}

        {/* ── TEXT DETECTION (blue) ── */}
        {phase >= 2 && (
          <motion.div
            style={{
              position: 'absolute', right: '4%', top: '11%', width: '58%', height: '52%', zIndex: 10,
              boxShadow: `0 0 0 1px rgba(59,158,255,0.55), 0 0 14px rgba(59,158,255,0.2)`,
              borderRadius: 5,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.35 }}
          >
            <CornerBrackets color={BLUE} size={9} thickness={1.5} />
            <motion.div
              style={{
                position: 'absolute', bottom: -19, right: 0,
                background: 'rgba(59,158,255,0.12)', border: `1px solid rgba(59,158,255,0.28)`,
                color: BLUE, fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 3,
                whiteSpace: 'nowrap',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38 }}
            >
              TEXT TOO SMALL ↗
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* ── SCORE ROW ─────────────────────────────────────── */}
      {phase >= 3 && (
        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0, zIndex: 1 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        >
          {/* Circular ring */}
          <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
            <svg width={80} height={80} viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
              {/* Track */}
              <circle cx={40} cy={40} r={RING_R} fill="none" stroke="rgba(255,128,31,0.08)" strokeWidth={4} />
              {/* Progress */}
              <motion.circle
                cx={40} cy={40} r={RING_R}
                fill="none"
                stroke={ORANGE}
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray={RING_CIRC}
                initial={{ strokeDashoffset: RING_CIRC }}
                animate={{ strokeDashoffset: RING_CIRC * (1 - 0.74) }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ filter: `drop-shadow(0 0 5px rgba(255,128,31,0.55))` }}
              />
            </svg>
            {/* Number inside ring */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: ORANGE, lineHeight: 1, letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums', fontFamily: 'monospace' }}>
                {score}
              </span>
              <span style={{ fontSize: 9, color: DIM, fontWeight: 600, marginTop: 1 }}>/100</span>
            </div>
          </div>

          {/* Score details */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase', color: DIM, marginBottom: 5 }}>
              CTR Score
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(240,240,240,0.92)', letterSpacing: '-0.2px', marginBottom: 4 }}>
              Above Average
            </div>
            <div style={{ fontSize: 11, color: DIM }}>Beats 68% of similar thumbnails</div>
          </div>
        </motion.div>
      )}

      {/* ── METRICS ───────────────────────────────────────── */}
      {phase >= 3 && (
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: 11, zIndex: 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.18 }}
        >
          {METRICS.map((m, i) => (
            <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Color dot */}
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: m.color, flexShrink: 0, boxShadow: `0 0 6px ${m.color}` }} />
              <span style={{ fontSize: 11, color: MUTED, width: 108, flexShrink: 0 }}>{m.label}</span>
              <div style={{ flex: 1, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', borderRadius: 99, background: m.color, boxShadow: `0 0 8px ${m.color}55` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${m.pct}%` }}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                />
              </div>
              <span style={{ fontSize: 11, color: m.color, fontWeight: 700, width: 28, textAlign: 'right', fontFamily: 'monospace' }}>
                {m.pct}%
              </span>
            </div>
          ))}
        </motion.div>
      )}

      {/* ── TIP ───────────────────────────────────────────── */}
      {phase >= 4 && (
        <motion.div
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '10px 14px', borderRadius: 10, marginTop: 'auto', zIndex: 1,
            border: `1px solid rgba(255,128,31,0.16)`,
            background: 'rgba(255,128,31,0.04)',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        >
          <AlertTriangle style={{ width: 12, height: 12, color: 'rgba(255,128,31,0.8)', flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontSize: 11, color: MUTED, lineHeight: 1.65 }}>
            Increase text size by 30% — small text loses legibility on mobile and costs ~2% CTR
          </span>
        </motion.div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   AI GENERATOR VISUAL
   Phases: idle → type → generate → progress → variants → badge → result
───────────────────────────────────────────────────────── */
function GeneratorVisual() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const [typed,        setTyped]        = useState('');
  const [phase,        setPhase]        = useState(0);
  const [progress,     setProgress]     = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [showBadge,    setShowBadge]    = useState(false);
  const [showResult,   setShowResult]   = useState(false);

  const PROMPT     = 'Epic React tutorial, dark bg, glowing text...';
  const TYPE_SPEED = 36;
  const TYPE_TOTAL = PROMPT.length * TYPE_SPEED; // ~1584ms

  useEffect(() => {
    if (!inView) return;

    let i = 0;
    const typeIv = setInterval(() => {
      i++;
      setTyped(PROMPT.slice(0, i));
      if (i >= PROMPT.length) clearInterval(typeIv);
    }, TYPE_SPEED);

    const tPhase1 = setTimeout(() => setPhase(1), TYPE_TOTAL + 180);

    const tProgress = setTimeout(() => {
      let p = 0;
      const iv = setInterval(() => {
        p += 3;
        setProgress(Math.min(p, 100));
        if (p >= 100) clearInterval(iv);
      }, 16);
    }, TYPE_TOTAL + 380);

    const base = TYPE_TOTAL + 560;
    [0, 1, 2, 3].forEach((n) => setTimeout(() => setVisibleCount(n + 1), base + n * 290));

    const t4 = setTimeout(() => setShowBadge(true),  base + 1450);
    const t5 = setTimeout(() => setShowResult(true), base + 1750);

    return () => { clearInterval(typeIv); [tPhase1, tProgress, t4, t5].forEach(clearTimeout); };
  }, [inView]);

  const VARIANTS = [
    {
      id: 'v1', label: 'Dramatic',
      bg: 'linear-gradient(135deg, #1a0e2a 0%, #0d0d1a 100%)',
      border: 'rgba(120,80,255,0.5)', glow: 'rgba(120,80,255,0.12)',
      face: 'rgba(120,80,255,0.55)', accent: '#7850ff',
      bar1: 'rgba(120,80,255,0.35)', bar2: 'rgba(120,80,255,0.2)',
    },
    {
      id: 'v2', label: 'Vibrant',
      bg: 'linear-gradient(135deg, #081a10 0%, #040d08 100%)',
      border: 'rgba(17,255,153,0.45)', glow: 'rgba(17,255,153,0.09)',
      face: 'rgba(17,255,153,0.5)', accent: '#11ff99',
      bar1: 'rgba(17,255,153,0.3)', bar2: 'rgba(17,255,153,0.18)',
    },
    {
      id: 'v3', label: 'Professional',
      bg: 'linear-gradient(135deg, #081522 0%, #030a12 100%)',
      border: BLUE, glow: 'rgba(59,158,255,0.18)',
      face: 'rgba(59,158,255,0.6)', accent: BLUE,
      bar1: 'rgba(59,158,255,0.4)', bar2: 'rgba(59,158,255,0.22)',
      selected: true,
    },
    {
      id: 'v4', label: 'Energetic',
      bg: 'linear-gradient(135deg, #1a0e05 0%, #0d0802 100%)',
      border: 'rgba(255,128,31,0.5)', glow: 'rgba(255,128,31,0.1)',
      face: 'rgba(255,128,31,0.55)', accent: ORANGE,
      bar1: 'rgba(255,128,31,0.35)', bar2: 'rgba(255,128,31,0.2)',
    },
  ];

  return (
    <div
      ref={ref}
      style={{ position: 'absolute', inset: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 60% 40% at 50% 70%, rgba(59,158,255,0.05) 0%, transparent 70%)',
      }} />

      {/* ── PROMPT INPUT ─────────────────────────────────── */}
      <motion.div
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 10, flexShrink: 0, zIndex: 1,
          background: 'rgba(255,255,255,0.02)', border: `1px solid ${FROST}`,
        }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3 }}
      >
        <span style={{ flex: 1, fontSize: 12, fontFamily: 'monospace', color: typed ? MUTED : DIM, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {typed || 'Describe your thumbnail…'}
          {typed.length > 0 && typed.length < PROMPT.length && (
            <motion.span
              style={{ display: 'inline-block', width: 1.5, height: 12, background: BLUE, marginLeft: 2, verticalAlign: 'middle' }}
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            />
          )}
        </span>
        {/* Generate button */}
        <motion.div
          style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: phase >= 1 ? BLUE : 'rgba(59,158,255,0.15)',
            border: `1px solid ${phase >= 1 ? BLUE : 'rgba(59,158,255,0.25)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: phase >= 1 ? `0 0 24px rgba(59,158,255,0.45), 0 0 8px rgba(59,158,255,0.3)` : 'none',
            transition: 'box-shadow 0.4s ease, background 0.3s ease',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={typed.length >= PROMPT.length ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 340, damping: 18 }}
        >
          <Wand2 style={{ width: 12, height: 12, color: '#fff' }} />
        </motion.div>
      </motion.div>

      {/* ── PROGRESS BAR ─────────────────────────────────── */}
      {progress > 0 && (
        <motion.div
          style={{ flexShrink: 0, zIndex: 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.9px', textTransform: 'uppercase', color: DIM }}>
              Generating variants
            </span>
            <span style={{ fontSize: 10, color: BLUE, fontFamily: 'monospace', fontWeight: 700 }}>
              {visibleCount} / 4
            </span>
          </div>
          <div style={{ height: 2, borderRadius: 99, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${BLUE} 0%, rgba(59,158,255,0.65) 100%)`, boxShadow: `0 0 10px rgba(59,158,255,0.55)` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}

      {/* ── 2×2 VARIANT GRID ─────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1, minHeight: 0, zIndex: 1 }}>
        {VARIANTS.map((v, i) => {
          const isVisible = visibleCount > i;
          return (
            <div
              key={v.id}
              style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', minHeight: 0, background: '#050505' }}
            >
              {/* Skeleton */}
              {!isVisible && (
                <motion.div
                  style={{ position: 'absolute', inset: 0, borderRadius: 10, background: '#080808', border: `1px solid rgba(255,255,255,0.04)` }}
                  animate={{ opacity: [0.4, 0.85, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut', delay: i * 0.14 }}
                />
              )}

              {/* Revealed variant */}
              {isVisible && (
                <motion.div
                  style={{
                    position: 'absolute', inset: 0, borderRadius: 10, overflow: 'hidden',
                    background: v.bg,
                    border: v.selected ? `1.5px solid ${BLUE}` : `1px solid ${v.border}`,
                    boxShadow: v.selected
                      ? `0 0 28px rgba(59,158,255,0.25), inset 0 0 28px ${v.glow}`
                      : `0 0 0 1px rgba(176,199,217,0.06), inset 0 0 18px ${v.glow}`,
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                >
                  {/* Shimmer sweep on entry */}
                  <motion.div
                    style={{
                      position: 'absolute', top: 0, bottom: 0, width: '80%', pointerEvents: 'none',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
                    }}
                    initial={{ left: '-80%' }}
                    animate={{ left: '180%' }}
                    transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.05 }}
                  />

                  {/* Accent top stripe */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${v.accent}, transparent)`, opacity: 0.9 }} />

                  {/* Face circle with glow */}
                  <div style={{
                    position: 'absolute', width: 22, height: 22, top: 10, left: 10, borderRadius: '50%',
                    background: v.face, boxShadow: `0 0 12px ${v.accent}70`,
                  }} />

                  {/* Text bars */}
                  <div style={{ position: 'absolute', width: '42%', height: 5, top: 12, right: 8, borderRadius: 3, background: v.bar1 }} />
                  <div style={{ position: 'absolute', width: '28%', height: 4, top: 22, right: 8, borderRadius: 3, background: v.bar2 }} />

                  {/* Bottom gradient */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '32%', background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)' }} />

                  {/* Label + badge */}
                  <div style={{ position: 'absolute', bottom: 7, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 8, color: DIM, fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase' }}>{v.id}</span>
                    {v.selected && showBadge && (
                      <motion.div
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 3,
                          background: 'rgba(59,158,255,0.16)', border: `1px solid rgba(59,158,255,0.32)`,
                          padding: '2px 7px', borderRadius: 9999,
                          boxShadow: `0 0 10px rgba(59,158,255,0.2)`,
                        }}
                        initial={{ opacity: 0, scale: 0.65 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      >
                        <span style={{ fontSize: 8, fontWeight: 800, color: BLUE, letterSpacing: '0.2px' }}>✓ BEST CTR</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── RESULT ROW ───────────────────────────────────── */}
      {showResult && (
        <motion.div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 1 }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        >
          <span style={{ fontSize: 11, color: DIM }}>
            v3 selected — <span style={{ color: BLUE, fontWeight: 700 }}>+3.1% projected CTR</span>
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: BLUE, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(59,158,255,0.35)', textUnderlineOffset: 3 }}>
            Download ↗
          </span>
        </motion.div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FEATURE BULLET LISTS
───────────────────────────────────────────────────────── */
const ctrFeatures = [
  'Instant score out of 100 — no account required',
  'Flags every signal YouTube uses to rank thumbnails',
  'Mobile legibility check for text and contrast',
];

const genFeatures = [
  '4 unique style variants from a single prompt',
  'CTR projection shown per variant before you choose',
  'One-click download, no watermarks',
];

/* ─────────────────────────────────────────────────────────
   SECTION
───────────────────────────────────────────────────────── */
export default function ThumbnailSection() {
  return (
    <section className="v2-thumb">
      <div className="v2-container">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="v2-thumb-header"
        >
          <span className="v2-label">Creator Tools</span>
          <h2>
            Better thumbnails.<br />
            <span>More clicks.</span>
          </h2>
          <p>
            Diagnose what&apos;s killing your CTR. Then generate a fixed version in
            seconds — free to use, no account needed. Grow first, monetize when
            you&apos;re ready.
          </p>
        </motion.div>

        {/* Feature rows */}
        <div className="v2-thumb-rows">

          {/* Row 1 — text LEFT, visual RIGHT */}
          <motion.div
            className="v2-thumb-row"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="v2-thumb-row-content">
              <div className="v2-tc-icon-row">
                <div className="v2-tc-icon" style={{ color: ORANGE }}><TrendingUp size={18} /></div>
                <div className="v2-tc-tag" style={{ background: 'rgba(255,89,0,0.12)', color: ORANGE, border: '1px solid rgba(255,89,0,0.2)' }}>
                  <span className="v2-tc-tag-dot" style={{ background: ORANGE }} />
                  AI MODEL
                </div>
              </div>
              <h3 className="v2-thumb-row-title">AI CTR Optimizer</h3>
              <p className="v2-thumb-row-desc">
                Upload any thumbnail and get a score in seconds. Face detection,
                text legibility, contrast — every signal YouTube rewards, explained
                in plain language.
              </p>
              <ul className="v2-thumb-row-list">
                {ctrFeatures.map((f) => (
                  <li key={f}>
                    <Check size={13} style={{ color: ORANGE, flexShrink: 0, marginTop: 1 }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="v2-thumb-row-visual">
              <CTROptimizerVisual />
            </div>
          </motion.div>

          {/* Row 2 — visual LEFT, text RIGHT */}
          <motion.div
            className="v2-thumb-row reverse"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <div className="v2-thumb-row-content">
              <div className="v2-tc-icon-row">
                <div className="v2-tc-icon" style={{ color: BLUE }}><Wand2 size={18} /></div>
                <div className="v2-tc-tag" style={{ background: 'rgba(0,117,255,0.12)', color: BLUE, border: '1px solid rgba(59,158,255,0.22)' }}>
                  <span className="v2-tc-tag-dot" style={{ background: BLUE }} />
                  GEN AI
                </div>
              </div>
              <h3 className="v2-thumb-row-title">AI Thumbnail Generator</h3>
              <p className="v2-thumb-row-desc">
                Describe your video in a sentence. Get 4 conversion-optimized
                variants with projected CTR scores. Pick the best one and download
                instantly.
              </p>
              <ul className="v2-thumb-row-list">
                {genFeatures.map((f) => (
                  <li key={f}>
                    <Check size={13} style={{ color: BLUE, flexShrink: 0, marginTop: 1 }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="v2-thumb-row-visual">
              <GeneratorVisual />
            </div>
          </motion.div>

        </div>

        {/* Funnel bridge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="v2-thumb-bridge"
        >
          <div className="v2-thumb-bridge-steps">
            <span className="v2-thumb-bridge-step active">Creator Tools</span>
            <span className="v2-thumb-bridge-sep">→</span>
            <span className="v2-thumb-bridge-step">Grow Your Audience</span>
            <span className="v2-thumb-bridge-sep">→</span>
            <span className="v2-thumb-bridge-step">Monetize with Content Pass</span>
          </div>
          <div className="v2-thumb-bridge-note">
            <a href="https://beta.base.tube/sign-up" target="_blank" rel="noopener noreferrer">
              Already have an audience? Skip straight to monetizing →
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
