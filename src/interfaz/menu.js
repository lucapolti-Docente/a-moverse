import { S } from '../estado.js';
import { UI } from '../datos/textos.js';
import { PARTS } from '../datos/partes/index.js';
import { $, LOCK_SVG, el, txt } from './dom.js';
import { loadLevel } from '../motor/partida.js';
import { ac } from '../sonido.js';

export function go(i){ S.li = Math.max(0, Math.min(S.P.levels.length - 1, i)); loadLevel(S.P.levels[S.li]); }

export function partProgress(p){ return p.levels ? p.levels.filter(l => S.done.has(l.id)).length / p.levels.length : 0; }

export function showParts(){
  if (S.engine){ S.engine.stop(); S.engine.releaseAll(); }
  const g = $('#pgrid'); g.innerHTML = '';
  PARTS.forEach(p => {
    const b = el('button', 'pcard p' + p.n);
    b.append(el('span','pn', String(p.n)), el('strong', null, p.name));
    if (p.locked){
      b.disabled = true; b.append(el('small', null, p.desc));
      const lk = el('span','lock', LOCK_SVG + UI.proximamente); b.append(lk);
      b.setAttribute('aria-label', UI.ariaParte(p.n, p.name) + '. ' + UI.proximamente);
    } else {
      b.append(el('small', null, p.desc));
      const pr = el('span','prog'); const fill = el('i'); fill.style.width = Math.round(partProgress(p) * 100) + '%'; pr.append(fill); b.append(pr);
      b.setAttribute('aria-label', UI.ariaParte(p.n, p.name));
      b.onclick = () => { ac(); showPart(p); };
    }
    g.append(b);
  });
  $('#partsView').hidden = false; $('#partView').hidden = true;
  $('#startScreen').hidden = false; $('#winModal').hidden = true;
  $('#startScreen').scrollTop = 0;
}

export function showPart(p){
  if (S.engine){ S.engine.stop(); S.engine.releaseAll(); }
  S.P = p;
  $('#partTitle').innerHTML = '<small>' + UI.parte(p.n) + '</small>'; $('#partTitle').append(p.name);
  $('#partTag').textContent = p.tag;
  const n = p.levels.filter(l => l.mode !== 'cierre').length;
  $('#stepsSub').textContent = p.levels.some(l => l.mode === 'cierre') ? UI.nivelesYCierre(n) : UI.niveles(n);
  const g = $('#lgrid'); g.innerHTML = '';
  p.levels.forEach((lv, i) => {
    const b = el('button', 'lbtn' + (S.done.has(lv.id) ? ' done' : ''));
    const isC = lv.mode === 'cierre';
    b.append(el('b', null, isC ? '★' : String(i + 1)), txt(lv.short || lv.name));
    b.setAttribute('aria-label', (isC ? '' : UI.ariaNivel(i + 1)) + lv.name + (S.done.has(lv.id) ? UI.hecho : ''));
    b.onclick = () => { ac(); $('#startScreen').hidden = true; go(i); };
    g.append(b);
  });
  const tc_ = $('#teachCols'); tc_.innerHTML = '';
  p.teach.forEach(([h, html]) => { const d = el('div'); d.append(el('h3', null, h)); d.insertAdjacentHTML('beforeend', html); tc_.append(d); });
  $('#partsView').hidden = true; $('#partView').hidden = false;
  $('#startScreen').hidden = false; $('#winModal').hidden = true;
  $('#startScreen').scrollTop = 0;
}

export function iniciarMenu(){
  $('#backParts').onclick = showParts;
  $('#goSteps').onclick = () => { ac(); $('#startScreen').hidden = true; const first = S.P.levels.findIndex(l => !S.done.has(l.id)); go(first < 0 ? 0 : first); };
  $('#goFree').onclick = () => { ac(); $('#startScreen').hidden = true; S.li = -1; loadLevel(S.P.free); };
}
