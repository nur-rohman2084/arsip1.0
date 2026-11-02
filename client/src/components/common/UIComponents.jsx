import React from 'react';
import IMAGES from '../../assets/images.json';
import { ICONS } from '../../assets/icons';

export const Img = ({ n, c = '', a = '' }) => {
  const src = IMAGES[n] || n;
  return <img src={src} alt={a} className={c} draggable="false" />;
};

export const I = ({ n, c = 'w-5 h-5' }) => {
  const path = ICONS[n];
  if (!path) return null;
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
};

export const Bar = ({ v = 0, c = 'w-full', h = 'h-2' }) => (
  <div className={`${c} ${h} rounded-full bg-white/15 overflow-hidden`}>
    <div className="h-full rounded-full bg-[#ffc82c] transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, v))}%` }} />
  </div>
);

export const Gb = ({ children, onClick, cls = '', disabled = false, type = 'button' }) => (
  <button type={type} disabled={disabled} onClick={onClick} className={`gb inline-flex items-center justify-center gap-2 px-6 py-2.5 ${cls}`}>
    {children}
  </button>
);

export const Tog = ({ on, set, l }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={l}
    onClick={() => set(!on)}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 cursor-pointer ${on ? 'bg-[#ffc82c]' : 'bg-white/20'}`}
  >
    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-200 ${on ? 'left-[22px]' : 'left-0.5'}`} />
  </button>
);

export const Chip = ({ t, g }) => (
  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold inline-block ${g ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-blue-200'}`}>
    {t}
  </span>
);

export const Logo = ({ s = false }) => (
  <div className="flex items-center gap-2">
    <Img n="logo" c={s ? 'h-14 w-14' : 'h-12 w-12'} a="Archive Academy Logo" />
    <span className={`hd leading-none ${s ? 'text-4xl' : 'text-3xl'}`}>
      ARCHIVE <span className="text-[#ffc82c]">ACADEMY</span>
    </span>
  </div>
);

export const Stat = ({ ic, l, v, d, bar }) => (
  <div className="pn flex items-center gap-3 p-4">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1b3274]">
      {ic}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-blue-200">{l}</p>
      <p className="hd text-3xl">
        {v} {d && <span className="text-[10px] font-sans text-emerald-300">↑ {d}</span>}
      </p>
      {bar !== undefined && <Bar v={bar} h="h-1.5" />}
    </div>
  </div>
);
