import { S } from '../estado.js';
import { KEYS } from '../datos/bloques.js';
import { COLORS } from '../datos/fondos.js';
import { FLAG_SVG, X_SVG, el, stopEv, txt } from './dom.js';
import { findInScript, removeBlock } from './edicion.js';
import { renderProgram } from './editor.js';
import { normDir } from '../motor/motor.js';
import { bdNames, cosNames, msgNames, otherNames, varNames } from '../motor/nombres.js';
import { SND } from '../sonido.js';

export function numIn(b, ro, key='n'){
  if (b[key] && typeof b[key] === 'object'){
    const pill = el('span','vrep');
    if (ro){ pill.textContent = b[key].v; return pill; }
    const s_ = el('select','key vsel'); s_.id = 'nv-' + key + '-' + b.id; s_.setAttribute('aria-label','variable o número');
    for (const n of [...new Set([...varNames(), b[key].v])]){ const o = el('option', null); o.value = n; o.textContent = n; if (n === b[key].v) o.selected = true; s_.append(o); }
    const o2 = el('option', null); o2.value = '__num'; o2.textContent = '↩ número'; s_.append(o2);
    s_.addEventListener('change', () => { if (s_.value === '__num'){ b[key] = 5; renderProgram(); } else b[key] = {v:s_.value}; });
    pill.append(stopEv(s_)); return pill;
  }
  if (ro) return el('span','val', String(b[key]));
  if (S.L.varInNum && b.type === 'move'){
    const wrap = el('span','numwrap');
    const i = el('input','num'); i.type = 'number'; i.step = '1'; i.value = b[key]; i.id = key + '-' + b.id; i.setAttribute('aria-label','número');
    i.addEventListener('input', () => { b[key] = i.value; });
    const vb = el('button','tovar','＋ variable'); vb.setAttribute('aria-label','Poner una variable en este hueco');
    vb.onclick = ev => { ev.stopPropagation(); b[key] = {v:varNames()[0]}; SND.pop(); renderProgram(); };
    vb.addEventListener('pointerdown', ev => ev.stopPropagation());
    wrap.append(stopEv(i), vb); return wrap;
  }
  const i = el('input','num'); i.type = 'number'; i.step = (b.type === 'changevar' || b.type === 'setvar' || b.type === 'eq' || b.type === 'gt' || b.type === 'lt' || b.type === 'repeat') ? '1' : b.type === 'wait' ? '0.1' : '10'; i.value = b[key]; i.id = key + '-' + b.id; i.setAttribute('aria-label', key === 'n' ? 'número' : key);
  i.addEventListener('input', () => { b[key] = i.value; if (b.type === 'pointdir') i.step = '90'; const vc = i.parentNode && i.parentNode.querySelector('.dir'); if (vc && vc._upd){ vc._upd(); return; } const ch = i.parentNode && i.parentNode.querySelector('.dir'); if (ch) setDir(ch, b); });
  return stopEv(i);
}

export const DIRS = {
  cx:{pos:['derecha','▶'], neg:['izquierda','◀'], c:'x'},
  cy:{pos:['arriba','▲'], neg:['abajo','▼'], c:'y'},
  move:{pos:['adelante','▶'], neg:['para atrás','◀'], c:'x'},
};

export function setDir(ch, b){
  if (b.type === 'pointdir'){
    const v = normDir(Number(b.n) || 0), M = {'0':'▲ arriba', '90':'derecha ▶', '180':'▼ abajo', '-90':'◀ izquierda', '45':'↗ diagonal', '135':'↘ diagonal', '-135':'↙ diagonal', '-45':'↖ diagonal'};
    ch.hidden = false; ch.className = 'dir ' + ((v === 0 || v === 180) ? 'y' : 'x');
    ch.textContent = M[String(v)] || 'en diagonal ↗'; return;
  }
  const d = DIRS[b.type], v = Number(b.n) || 0;
  if (!v){ ch.hidden = true; return; }
  ch.hidden = false;
  const [word, ar] = v < 0 ? d.neg : d.pos;
  ch.className = 'dir ' + d.c + (v < 0 ? ' neg' : '');
  ch.textContent = (ar === '◀' ? ar + ' ' : '') + (v < 0 ? 'menos: ' : 'más: ') + word + (ar !== '◀' ? ' ' + ar : '');
}

export function dirChip(b){ const ch = el('span','dir'); setDir(ch, b); return ch; }

export function textIn(b, ro){
  if (ro) return el('span','val', b.text);
  const i = el('input','txtin'); i.type = 'text'; i.value = b.text; i.id = 't-' + b.id; i.maxLength = 20; i.setAttribute('aria-label','texto');
  i.addEventListener('input', () => { b.text = i.value; });
  return stopEv(i);
}

export function keySel(obj, ro){
  if (ro) return el('span','val', KEYS[obj.key]);
  const s = el('select','key'); s.id = 'k-' + obj.id; s.setAttribute('aria-label','tecla');
  for (const k in KEYS){ const o = el('option', null); o.value = k; o.textContent = KEYS[k]; if (k === obj.key) o.selected = true; s.append(o); }
  s.addEventListener('change', () => { obj.key = s.value; });
  return stopEv(s);
}

export const DIR8 = [[0,'↑','arriba'],[45,'↗',''],[90,'→','derecha'],[135,'↘',''],[180,'↓','abajo'],[-135,'↙',''],[-90,'←','izquierda'],[-45,'↖','']];

export const dirGlyph = v => (DIR8.find(d => d[0] === normDir(Number(v) || 0)) || [0,'↗'])[1];

export function dirPickBtn(b, ro){
  if (ro) return el('span','val', String(b.n));
  const btn = el('button','dirpick'); btn.id = 'dp-' + b.id;
  btn.innerHTML = `<b>${normDir(Number(b.n) || 0)}</b><span>${dirGlyph(b.n)}</span><i>▾</i>`;
  btn.setAttribute('aria-label', 'Dirección ' + b.n + '. Tocá para elegir');
  btn.addEventListener('pointerdown', ev => ev.stopPropagation());
  btn.addEventListener('click', ev => { ev.stopPropagation(); openDirPicker(btn, b); });
  return btn;
}

export function openDirPicker(btn, b){
  const wrap = el('div','dirpop-wrap'), pop = el('div','dirpop');
  pop.setAttribute('role','dialog'); pop.setAttribute('aria-label','Elegí una dirección');
  pop.append(el('div','dp-center','¿para<br>dónde?'));
  const cur = normDir(Number(b.n) || 0);
  DIR8.forEach(([v, g, word]) => {
    const o = el('button','dp-opt' + (v === cur ? ' on' : '') + (word ? ' card' : ''));
    o.innerHTML = `<span class="g">${g}</span><span class="n">${v}</span>${word ? `<span class="w">${word}</span>` : ''}`;
    o.setAttribute('aria-label', (word || 'diagonal') + ', ' + v);
    const a = v * Math.PI / 180;
    o.style.left = `calc(50% + ${Math.sin(a) * 92}px)`; o.style.top = `calc(50% - ${Math.cos(a) * 92}px)`;
    o.onclick = ev => { ev.stopPropagation(); b.n = v; SND.pop(); wrap.remove(); renderProgram(); };
    pop.append(o);
  });
  wrap.append(pop); document.body.append(wrap);
  const r = btn.getBoundingClientRect(), W = 256, H = 256;
  let x = r.left + r.width/2 - W/2, y = r.bottom + 6;
  if (y + H > innerHeight - 8) y = Math.max(8, r.top - H - 6);
  x = Math.max(8, Math.min(innerWidth - W - 8, x));
  pop.style.left = x + 'px'; pop.style.top = y + 'px';
  wrap.addEventListener('click', () => wrap.remove());
  pop.addEventListener('click', ev => ev.stopPropagation());
  const first = pop.querySelector('.dp-opt.on') || pop.querySelector('.dp-opt'); first.focus();
  wrap.addEventListener('keydown', ev => { if (ev.key === 'Escape') wrap.remove(); });
}

export function cosSel(obj, ro){
  if (ro) return el('span','val', obj.cos);
  const s_ = el('select','key'); s_.id = 'cos-' + obj.id; s_.setAttribute('aria-label','disfraz');
  for (const n of [...new Set([...cosNames(), obj.cos])]){ const o = el('option', null); o.value = n; o.textContent = n; if (n === obj.cos) o.selected = true; s_.append(o); }
  s_.addEventListener('change', () => { obj.cos = s_.value; });
  return stopEv(s_);
}

export function bdSel(obj, ro, withNext){
  if (ro) return el('span','val', obj.bd);
  const s_ = el('select','key'); s_.id = 'bd-' + obj.id; s_.setAttribute('aria-label','fondo');
  for (const n of [...new Set([...bdNames(), ...(withNext ? ['siguiente fondo'] : []), obj.bd])]){ const o = el('option', null); o.value = n; o.textContent = n; if (n === obj.bd) o.selected = true; s_.append(o); }
  s_.addEventListener('change', () => { obj.bd = s_.value; });
  return stopEv(s_);
}

export function cloneSel(obj, ro){
  if (ro) return el('span','val', obj.target);
  const s_ = el('select','key'); s_.id = 'cl-' + obj.id; s_.setAttribute('aria-label','qué clonar');
  for (const n of [...new Set(['mí mismo', ...otherNames(), obj.target])]){ const o = el('option', null); o.value = n; o.textContent = n; if (n === obj.target) o.selected = true; s_.append(o); }
  s_.addEventListener('change', () => { obj.target = s_.value; });
  return stopEv(s_);
}

export function varSel(obj, ro){
  if (ro) return el('span','val', obj.v);
  const s_ = el('select','key vsel'); s_.id = 'v-' + obj.id; s_.setAttribute('aria-label','variable');
  for (const n of [...new Set([...varNames(), obj.v])]){ const o = el('option', null); o.value = n; o.textContent = n; if (n === obj.v) o.selected = true; s_.append(o); }
  s_.addEventListener('change', () => { obj.v = s_.value; });
  return stopEv(s_);
}

export function varChip(b){ const ch = el('span','dir'); const upd = () => { const v = Number(b.n) || 0; ch.hidden = !v; ch.className = 'dir' + (v < 0 ? ' neg' : ''); ch.textContent = v < 0 ? 'resta ' + Math.abs(v) : 'suma ' + v; }; upd(); ch._upd = upd; return ch; }

export function objSel(obj, ro, withEdge){
  if (ro) return el('span','val', obj.target);
  const s_ = el('select','key'); s_.id = 'o-' + obj.id; s_.setAttribute('aria-label','personaje');
  const names = [...new Set([...otherNames(), obj.target, ...(withEdge ? ['borde'] : [])])].filter(Boolean);
  for (const n of names){ const o = el('option', null); o.value = n; o.textContent = n; if (n === obj.target) o.selected = true; s_.append(o); }
  s_.addEventListener('change', () => { obj.target = s_.value; });
  return stopEv(s_);
}

export function swatchEl(obj, ro){
  const c = COLORS[obj.color];
  if (ro){ const s = el('span','swatch'); s.style.background = c.hex; s.title = c.name; s.setAttribute('aria-label', 'color ' + c.name); return s; }
  const b = el('button','swatch'); b.style.background = c.hex; b.id = 'c-' + obj.id;
  b.setAttribute('aria-label', `color ${c.name}. Tocá para cambiar`); b.title = c.name + ' (tocá para cambiar)';
  b.addEventListener('click', ev => {
    ev.stopPropagation();
    const list = S.L.colors && S.L.colors.length ? S.L.colors : Object.keys(COLORS);
    const i = list.indexOf(obj.color); obj.color = list[(i + 1) % list.length]; SND.pop(); renderProgram();
  });
  b.addEventListener('pointerdown', ev => ev.stopPropagation());
  return b;
}

export function delBtn(id, ro){
  if (ro) return null;
  const d = el('button','del', X_SVG); d.setAttribute('aria-label','Sacar bloque');
  d.addEventListener('click', ev => { ev.stopPropagation(); removeBlock(id); });
  return d;
}

export const isSel = (owner, i) => S.sel && S.sel.owner === owner && S.sel.index === i;

export const pick = (s, ro) => ev => { if (ro) return; ev.stopPropagation(); S.sel = s; renderProgram(); };

export function cursorEl(){ return el('div','cursor','▸ acá va el próximo bloque'); }

export function msgSel(obj, ro){
  if (ro) return el('span','val', obj.msg);
  const s_ = el('select','key'); s_.id = 'm-' + obj.id; s_.setAttribute('aria-label','mensaje');
  for (const n of [...new Set([...msgNames(), obj.msg])]){ const o = el('option', null); o.value = n; o.textContent = n; if (n === obj.msg) o.selected = true; s_.append(o); }
  s_.addEventListener('change', () => { obj.msg = s_.value; });
  return stopEv(s_);
}

export function hatEl(sc, ro){
  const h = el('div', 'blk ' + (sc.hat === 'clone' ? 'co' : 'ev') + ' hat');
  if (sc.hat === 'flag'){ h.append(txt('al hacer clic en')); h.insertAdjacentHTML('beforeend', FLAG_SVG); }
  else if (sc.hat === 'key'){ h.append(txt('al presionar tecla'), keySel(sc, ro)); }
  else if (sc.hat === 'msg'){ h.append(txt('al recibir'), msgSel(sc, ro)); }
  else if (sc.hat === 'bd'){ h.append(txt('al cambiar el fondo a'), bdSel(sc, ro, false)); }
  else { h.append(txt('al comenzar como clon')); }
  const d = delBtn(sc.id, ro); if (d) h.append(d);
  h.addEventListener('click', pick({owner:sc.id, index:0}, ro));
  return h;
}

export function listEl(list, owner, ro){
  const box = el('div','list');
  list.forEach((b, i) => { if (!ro && isSel(owner, i)) box.append(cursorEl()); box.append(stmtEl(b, owner, i, ro)); });
  if (!ro && isSel(owner, list.length)) box.append(cursorEl());
  return box;
}

export function condBlockEl(c, ro, onDel, onClick){
  if (c.type === 'or' || c.type === 'and'){
    const e = el('span','blk op');
    const slot = side => {
      if (c[side]) return condBlockEl(c[side], ro, () => { c[side] = null; S.sel = {orSlot:c.id, side}; renderProgram(); }, onClick);
      const s_ = el('span','condslot op' + (S.sel && S.sel.orSlot === c.id && S.sel.side === side ? ' sel' : '')); s_.setAttribute('aria-label','hueco para una pregunta');
      s_.addEventListener('click', pick({orSlot:c.id, side}, ro));
      return s_;
    };
    e.append(slot('a'), txt(c.type === 'or' ? 'o' : 'y'), slot('b'));
    if (!ro){ const d = el('button','del', X_SVG); d.setAttribute('aria-label','Sacar “' + (c.type === 'or' ? 'o' : 'y') + '”'); d.onclick = ev => { ev.stopPropagation(); onDel(c.a || c.b || null); }; e.append(d); }
    if (onClick) e.addEventListener('click', onClick);
    return e;
  }
  const e = el('span','blk se');
  if (c.type === 'eq' || c.type === 'gt' || c.type === 'lt'){
    const g = el('span','blk op');
    const rep_ = el('span','vrep'); rep_.append(varSel(c, ro));
    g.append(rep_, txt(c.type === 'eq' ? '=' : c.type === 'gt' ? '>' : '<'), numIn(c, ro));
    if (!ro){ const d = el('button','del', X_SVG); d.setAttribute('aria-label','Sacar comparación'); d.onclick = ev => { ev.stopPropagation(); onDel(); }; g.append(d); }
    if (onClick) g.addEventListener('click', onClick);
    return g;
  }
  if (c.type === 'toucho') e.append(txt('¿tocando'), objSel(c, ro, true), txt('?'));
  else if (c.type === 'keyp') e.append(txt('¿tecla'), keySel(c, ro), txt('presionada?'));
  else e.append(txt('¿tocando el color'), swatchEl(c, ro), txt('?'));
  if (!ro){ const d = el('button','del', X_SVG); d.setAttribute('aria-label','Sacar sensor'); d.onclick = ev => { ev.stopPropagation(); onDel(); }; e.append(d); }
  if (onClick) e.addEventListener('click', onClick);
  return e;
}

export function condEl(ib, ro){
  if (ib.cond) return condBlockEl(ib.cond, ro, keep => { ib.cond = keep || null; S.sel = keep ? {owner:ib.id, index:ib.body.length} : {cond:ib.id}; renderProgram(); }, pick({owner:ib.id, index:ib.body.length}, ro));
  const s = el('span','condslot' + (S.sel && S.sel.cond === ib.id ? ' sel' : '')); s.setAttribute('aria-label','hueco para un sensor');
  s.addEventListener('click', pick({cond:ib.id}, ro));
  return s;
}

export function stmtEl(b, owner, i, ro){
  const after = pick({owner, index:i + 1}, ro);
  if (['move','cx','cy','goto','say','stop','bounce','pointdir','pointto','wait','setvar','changevar','gorandom','hide','show','broadcast','gotoobj','clone','delclone','switchbd','nextcos','setcos'].includes(b.type)){
    const cls = (b.type === 'say' || b.type === 'hide' || b.type === 'show' || b.type === 'switchbd' || b.type === 'nextcos' || b.type === 'setcos') ? 'ap' : (b.type === 'stop' || b.type === 'wait' || b.type === 'clone' || b.type === 'delclone') ? 'co' : (b.type === 'setvar' || b.type === 'changevar') ? 'va' : b.type === 'broadcast' ? 'ev' : 'mo';
    const e = el('div','blk ' + cls);
    if (b.type === 'move') e.append(txt('mover'), numIn(b, ro), txt('pasos'), dirChip(b));
    else if (b.type === 'cx' || b.type === 'cy') e.append(txt(b.type === 'cx' ? 'sumar a x' : 'sumar a y'), numIn(b, ro), dirChip(b));
    else if (b.type === 'goto') e.append(txt('ir a x:'), numIn(b, ro, 'x'), txt('y:'), numIn(b, ro, 'y'));
    else if (b.type === 'say') e.append(txt('decir'), textIn(b, ro));
    else if (b.type === 'bounce') e.append(txt('rebotar si toca un borde'));
    else if (b.type === 'pointdir') e.append(txt('apuntar en dirección'), dirPickBtn(b, ro), dirChip(b));
    else if (b.type === 'pointto') e.append(txt('apuntar hacia'), objSel(b, ro, false));
    else if (b.type === 'wait') e.append(txt('esperar'), numIn(b, ro), txt('segundos'));
    else if (b.type === 'setvar') e.append(txt('dar a'), varSel(b, ro), txt('el valor'), numIn(b, ro));
    else if (b.type === 'changevar') e.append(txt('sumar a'), varSel(b, ro), numIn(b, ro), varChip(b));
    else if (b.type === 'gorandom') e.append(txt('ir a'), el('span','val','posición aleatoria ▾'));
    else if (b.type === 'hide') e.append(txt('esconder'));
    else if (b.type === 'switchbd') e.append(txt('cambiar fondo a'), bdSel(b, ro, true));
    else if (b.type === 'nextcos') e.append(txt('siguiente disfraz'));
    else if (b.type === 'setcos') e.append(txt('cambiar disfraz a'), cosSel(b, ro));
    else if (b.type === 'show') e.append(txt('mostrar'));
    else if (b.type === 'broadcast') e.append(txt('enviar mensaje'), msgSel(b, ro));
    else if (b.type === 'gotoobj') e.append(txt('ir a'), objSel(b, ro, false));
    else if (b.type === 'clone') e.append(txt('crear clon de'), cloneSel(b, ro));
    else if (b.type === 'delclone') e.append(txt('eliminar este clon'));
    else e.append(txt('detener'), el('span','val','todos ▾'));
    const d = delBtn(b.id, ro); if (d) e.append(d);
    e.addEventListener('click', after); return e;
  }
  const c = el('div','cblk');
  const head = el('div','blk co');
  if (b.type === 'forever') head.append(txt('por siempre'));
  else if (b.type === 'repeat') head.append(txt('repetir'), numIn(b, ro), txt('veces'));
  else head.append(txt('si'), condEl(b, ro), txt('entonces'));
  const d = delBtn(b.id, ro); if (d) head.append(d);
  head.addEventListener('click', after);
  const m = el('div','mouth'); m.append(listEl(b.body, b.id, ro));
  m.addEventListener('click', pick({owner:b.id, index:b.body.length}, ro));
  const f = el('div','cfoot'); f.addEventListener('click', after);
  c.append(head, m, f); return c;
}

export function programView(p, ro){
  const wrap = el('div', ro ? 'ro' : '');
  p.forEach(sc => {
    const st = el('div','stack');
    if (sc.fold && ro){
      st.append(hatEl(sc, ro), el('div','foldbtn ro', '▸ ' + sc.fold.charAt(0).toUpperCase() + sc.fold.slice(1) + ' (ya armado)'));
    } else if (sc.fold && !ro){
      const fb_ = el('button','foldbtn', (sc.open ? '▾ Esconder: ' : '▸ Ya armado: ') + sc.fold + (sc.open ? '' : ' (tocá para ver)'));
      fb_.setAttribute('aria-expanded', String(!!sc.open));
      fb_.onclick = ev => { ev.stopPropagation(); sc.open = !sc.open; if (!sc.open && S.sel && (S.sel.owner === sc.id || findInScript(sc, S.sel.owner))) S.sel = null; renderProgram(); };
      st.append(hatEl(sc, ro));
      if (sc.open) st.append(listEl(sc.body, sc.id, ro));
      st.append(fb_);
    } else st.append(hatEl(sc, ro), listEl(sc.body, sc.id, ro));
    wrap.append(st);
  });
  return wrap;
}
