'use client';

import { useId, useState } from 'react';
import ThumbText, { type OutlineWidth, type ResolvedFont } from './ThumbText';
import { BG_PRESETS, DEFAULT_TEXT, FILL_PRESETS, MAX_CHARS, OUTLINE_PRESETS } from './content';
import { MEASURED, MEASURED_ON_LABEL } from '../thumbnail-size/specs';
import s from './thumbnail-fonts.module.css';

/** Real on-screen widths we measured on youtube.com (see /youtube-thumbnail-size). */
const VIEWS = [
  { id: 'phone', label: 'Phone feed', width: MEASURED.mobileFeed.w },
  { id: 'search', label: 'Desktop search', width: MEASURED.desktopSearch.w },
  { id: 'upnext', label: 'Desktop up next', width: MEASURED.desktopSidebar.w },
] as const;
type ViewId = (typeof VIEWS)[number]['id'];

const OUTLINE_WIDTHS: { id: OutlineWidth; label: string }[] = [
  { id: 'thick', label: 'Thick' },
  { id: 'thin', label: 'Thin' },
  { id: 'none', label: 'None' },
];

function Swatches({
  label,
  presets,
  value,
  onChange,
  customValue,
  onCustom,
}: {
  label: string;
  presets: { name: string; value: string; swatch?: string }[];
  value: string;
  onChange: (v: string) => void;
  customValue: string;
  onCustom: (hex: string) => void;
}) {
  const id = useId();
  const isCustom = !presets.some((p) => p.value === value);
  return (
    <fieldset className={s.field}>
      <legend className={s.fieldLabel}>{label}</legend>
      <div className={s.swatches}>
        {presets.map((p) => (
          <button
            key={p.name}
            type="button"
            className={s.swatch}
            style={{ background: p.value }}
            aria-label={`${label}: ${p.name}`}
            aria-pressed={value === p.value}
            title={p.name}
            onClick={() => onChange(p.value)}
          />
        ))}
        <label className={`${s.swatch} ${s.swatchCustom}`} htmlFor={id} data-active={isCustom || undefined} title="Pick any colour">
          <span className={s.srOnly}>{label}: pick any colour</span>
          <input
            id={id}
            type="color"
            className={s.colorInput}
            value={customValue}
            onChange={(e) => onCustom(e.target.value)}
          />
        </label>
      </div>
    </fieldset>
  );
}

export default function FontPreview({ fonts }: { fonts: ResolvedFont[] }) {
  const inputId = useId();
  const [text, setText] = useState(DEFAULT_TEXT);
  const [fill, setFill] = useState(FILL_PRESETS[1].value);
  const [fillCustom, setFillCustom] = useState('#ffcc00');
  const [outline, setOutline] = useState(OUTLINE_PRESETS[0].value);
  const [outlineCustom, setOutlineCustom] = useState('#222222');
  const [outlineWidth, setOutlineWidth] = useState<OutlineWidth>('thick');
  const [shadow, setShadow] = useState(true);
  const [bg, setBg] = useState(BG_PRESETS[0].value);
  const [bgCustom, setBgCustom] = useState('#2563eb');
  const [view, setView] = useState<ViewId>('phone');

  const width = VIEWS.find((v) => v.id === view)?.width ?? MEASURED.mobileFeed.w;
  const shown = text.trim() ? text : DEFAULT_TEXT;

  return (
    <div className={s.tool}>
      <div className={s.controls}>
        <div className={s.textField}>
          <label htmlFor={inputId} className={s.fieldLabel}>
            Your thumbnail text
          </label>
          <div className={s.textRow}>
            <input
              id={inputId}
              type="text"
              className={s.textInput}
              value={text}
              maxLength={MAX_CHARS}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
              placeholder={DEFAULT_TEXT}
            />
            <span className={s.counter} aria-live="polite">
              {text.length}/{MAX_CHARS}
            </span>
          </div>
        </div>

        <Swatches
          label="Text colour"
          presets={FILL_PRESETS}
          value={fill}
          onChange={setFill}
          customValue={fillCustom}
          onCustom={(hex) => {
            setFillCustom(hex);
            setFill(hex);
          }}
        />

        <Swatches
          label="Outline colour"
          presets={OUTLINE_PRESETS}
          value={outline}
          onChange={setOutline}
          customValue={outlineCustom}
          onCustom={(hex) => {
            setOutlineCustom(hex);
            setOutline(hex);
          }}
        />

        <Swatches
          label="Background"
          presets={BG_PRESETS}
          value={bg}
          onChange={setBg}
          customValue={bgCustom}
          onCustom={(hex) => {
            setBgCustom(hex);
            setBg(hex);
          }}
        />

        <fieldset className={s.field}>
          <legend className={s.fieldLabel}>Outline</legend>
          <div className={s.seg}>
            {OUTLINE_WIDTHS.map((o) => (
              <label key={o.id} className={s.segOption}>
                <input
                  type="radio"
                  name="outline-width"
                  className={s.segInput}
                  checked={outlineWidth === o.id}
                  onChange={() => setOutlineWidth(o.id)}
                />
                <span className={s.segLabel}>{o.label}</span>
              </label>
            ))}
          </div>
          <label className={s.check}>
            <input type="checkbox" checked={shadow} onChange={(e) => setShadow(e.target.checked)} />
            <span>Drop shadow</span>
          </label>
        </fieldset>

        <fieldset className={`${s.field} ${s.viewField}`}>
          <legend className={s.fieldLabel}>Show at the size viewers see</legend>
          <div className={s.seg}>
            {VIEWS.map((v) => (
              <label key={v.id} className={s.segOption}>
                <input
                  type="radio"
                  name="view-size"
                  className={s.segInput}
                  checked={view === v.id}
                  onChange={() => setView(v.id)}
                />
                <span className={s.segLabel}>
                  {v.label} <small>{v.width} px</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <p className={s.toolNote}>
        Each tile is shown {width} pixels wide, the size we measured on youtube.com on {MEASURED_ON_LABEL}. On a
        narrow screen the tiles shrink to fit. Your text stays in your browser; nothing is uploaded.
      </p>

      <ul className={s.previewGrid} style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${width}px), 1fr))` }}>
        {fonts.map((f) => (
          <li key={f.id} className={s.previewItem}>
            <ThumbText
              text={shown}
              font={f}
              fill={fill}
              outline={outline}
              outlineWidth={outlineWidth}
              shadow={shadow}
              background={bg}
              width={width}
              badge
            />
            <div className={s.previewCaption}>
              <span className={s.previewName}>{f.name}</span>
              <a href={f.url} target="_blank" rel="noopener noreferrer" className={s.previewLink}>
                Google Fonts ↗
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
