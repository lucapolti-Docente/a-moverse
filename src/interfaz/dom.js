export const $ = s => document.querySelector(s);

export const FLAG_SVG = '<svg class="fl" viewBox="0 0 24 24" aria-label="bandera"><path d="M5 2.5v19" stroke="#13202B" stroke-width="2.6" stroke-linecap="round"/><path d="M6 3.5h12.5l-3.2 4.6 3.2 4.6H6z" fill="#1FA85A" stroke="#13202B" stroke-width="2" stroke-linejoin="round"/></svg>';

export const X_SVG = '<svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#111B24" stroke-width="2.4" stroke-linecap="round"/></svg>';

export const LOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

export function el(tag, cls, html){ const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

export function txt(s){ const e = document.createElement('span'); e.textContent = s; return e; }

export function stopEv(e){ e.addEventListener('click', ev => ev.stopPropagation()); e.addEventListener('pointerdown', ev => ev.stopPropagation()); return e; }
