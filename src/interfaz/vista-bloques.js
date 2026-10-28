import { S } from '../estado.js';
import { ETIQUETAS, KEYS } from '../datos/bloques.js';
import { COLORS } from '../datos/fondos.js';
import { FLAG_SVG, X_SVG, el, stopEv, txt } from './dom.js';
import { findInScript, removeBlock } from './edicion.js';
import { renderProgram } from './editor.js';
import { normDir } from '../motor/motor.js';
import { bdNames, cosNames, msgNames, otherNames, varNames } from '../motor/nombres.js';
import { SND } from '../sonido.js';
import { EDITOR } from '../datos/textos.js';

export function numIn(b, ro, key='n'){
  if (b[key] && typeof b[key] === 'object'){
    const pill = el('span','vrep');
    if (ro){ pill.textContent = b[key].v; return pill; }
    const s_ = el('select','key vsel'); s_.id = 'nv-' + key + '-' + b.id; s_.setAttribute('aria-label',EDITOR.variableONumero);
    for (const n of [...new Set([...varNames(), b[key].v])]){ const o = el('option', null); o.value = n; o.textContent = n; if (n === b[key].v) o.selected = true; s_.append(o); }
    const o2 = el('option', null); o2.value = '__num'; o2.textContent = EDITOR.volverANumero; s_.append(o2);
    s_.addEventListener('change', () => { if (s_.value === '__num'){ b[key] = 5; renderProgram(); } else b[key] = {v:s_.value}; });
    pill.append(stopEv(s_)); return pill;
  }
  if (ro) return el('span','val', String(b[key]));
  if (S.L.varInNum && b.type === 'move'){
    const wrap = el('span','numwrap');
    const i = el('input','num'); i.type = 'number'; i.step = '1'; i.value = b[key]; i.id = key + '-' + b.id; i.setAttribute('aria-label',EDITOR.numero);
    i.addEventListener('input', () => { b[key] = i.value; });
    const vb = el('button','tovar',EDITOR.masVariable); vb.setAttribute('aria-label',EDITOR.ariaMasVariable);
    vb.onclick = ev => { ev.stopPropagation(); b[key] = {v:varNames()[0]}; SND.pop(); renderProgram(); };
    vb.addEventListener('pointerdown', ev => ev.stopPropagation());
    wrap.append(stopEv(i), vb); return wrap;
  }
  const i = el('input','num'); i.type = 'number'; i.step = (b.type === 'changevar' || b.type === 'setvar' || b.type === 'eq' || b.type === 'gt' || b.type === 'lt' || b.type === 'repeat') ? '1' : b.type === 'wait' ? '0.1' : '10'; i.value = b[key]; i.id = key + '-' + b.id; i.setAttribute('aria-label', key === 'n' ? EDITOR.numero : key);
  i.addEventListener('input', () => { b[key] = i.value; if (b.type === 'pointdir') i.step = '90'; const vc = i.parentNode && i.parentNode.querySelector('.dir'); if (vc && vc._upd){ vc._upd(); return; } const ch = i.parentNode && i.parentNode.querySelector('.dir'); if (ch) setDir(ch, b); });
  return stopEv(i);
}

export const DIRS = {
  cx:{pos:[EDITOR.dir.derecha,'▶'], neg:[EDITOR.dir.izquierda,'◀'], c:'x'},
  cy:{pos:[EDITOR.dir.arriba,'▲'], neg:[EDITOR.dir.abajo,'▼'], c:'y'},
  move:{pos:[EDITOR.dir.adelante,'▶'], neg:[EDITOR.dir.atras,'◀'], c:'x'},
};

export function setDir(ch, b){
  if (b.type === 'pointdir'){
    const v = normDir(Number(b.n) || 0), M = EDITOR.apuntar;
    ch.hidden = false; ch.className = 'dir ' + ((v === 0 || v === 180) ? 'y' : 'x');
    ch.textContent = M[String(v)] || EDITOR.enDiagonal; return;
  }
  const d = DIRS[b.type], v = Number(b.n) || 0;
  if (!v){ ch.hidden = true; return; }
  ch.hidden = false;
  const [word, ar] = v < 0 ? d.neg : d.pos;
  ch.className = 'dir ' + d.c + (v < 0 ? ' neg' : '');
  ch.textContent = (ar === '◀' ? ar + ' ' : '') + (v < 0 ? EDITOR.menos : EDITOR.mas) + word + (ar !== '◀' ? ' ' + ar : '');
}

export function dirChip(b){ const ch = el('span','dir'); setDir(ch, b); return ch; }

export function textIn(b, ro){
  if (ro) return el('span','val', b.text);
  const i = el('input','txtin'); i.type = 'text'; i.value = b.text; i.id = 't-' + b.id; i.maxLength = 20; i.setAttribute('aria-label',EDITOR.texto);
  i.addEventListener('input', () => { b.text = i.value; });
  return stopEv(i);
}

export function keySel(obj, ro){
  if (ro) return el('span','val', KEYS[obj.key]);
  const s = el('select','key'); s.id = 'k-' + obj.id; s.setAttribute('aria-label',EDITOR.tecla);
  for (const k in KEYS){ const o = el('option', null); o.value = k; o.textContent = KEYS[k]; if (k === obj.key) o.selected = true; s.append(o); }
  s.addEventListener('change', () => { obj.key = s.value; });
  return stopEv(s);
}

export const DIR8 = [[0,'↑',EDITOR.dir.arriba],[45,'↗',''],[90,'→',EDITOR.dir.derecha],[135,'↘',''],[180,'↓',EDITOR.dir.abajo],[-135,'↙',''],[-90,'←',EDITOR.dir.izquierda],[-45,'↖','']];

export const dirGlyph = v => (DIR8.find(d => d[0] === normDir(Number(v) || 0)) || [0,'↗'])[1];

export function dirPickBtn(b, ro){
  if (ro) return el('span','val', String(b.n));
  const btn = el('button','dirpick'); btn.id = 'dp-' + b.id;
  btn.innerHTML = `<b>${normDir(Number(b.n) || 0)}</b><span>${dirGlyph(b.n)}</span><i>▾</i>`;
  btn.setAttribute('aria-label', EDITOR.ariaDireccion(b.n));
  btn.addEventListener('pointerdown', ev => ev.stopPropagation());
  btn.addEventListener('click', ev => { ev.stopPropagation(); openDirPicker(btn, b); });
  return btn;
}

export function openDirPicker(btn, b){
  const wrap = el('div','dirpop-wrap'), pop = el('div','dirpop');
  pop.setAttribute('role','dialog'); pop.setAttribute('aria-label',EDITOR.elegiDireccion);
  pop.append(el('div','dp-center',EDITOR.paraDonde));
  const cur = normDir(Number(b.n) || 0);
  DIR8.forEach(([v, g, word]) => {
    const o = el('button','dp-opt' + (v === cur ? ' on' : '') + (word ? ' card' : ''));
    o.innerHTML = `<span class="g">${g}</span><span class="n">${v}</span>${word ? `<span class="w">${word}</span>` : ''}`;
    o.setAttribute('aria-label', (word || EDITOR.diagonal) + ', ' + v);
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
  const s_ = el('select','key'); s_.id = 'cos-' + obj.id; s_.setAttribute('aria-label',EDITOR.disfraz);
  for (const n of [...new Set([...cosNames(), obj.cos])]){ const o = el('option', null); o.value = n; o.textContent = n; if (n === obj.cos) o.selected = true; s_.append(o); }
  s_.addEventListener('change', () => { obj.cos = s_.value; });
  return stopEv(s_);
}

export function bdSel(obj, ro, withNext){
  if (ro) return el('span','val', obj.bd);
  const s_ = el('select','key'); s_.id = 'bd-' + obj.id; s_.setAttribute('aria-label',EDITOR.fondo);
  for (const n of [...new Set([...bdNames(), ...(withNext ? ['siguiente fondo'] : []), obj.bd])]){ const o = el('option', null); o.value = n; o.textContent = n; if (n === obj.bd) o.selected = true; s_.append(o); }
  s_.addEventListener('change', () => { obj.bd = s_.value; });
  return stopEv(s_);
}

export function cloneSel(obj, ro){
  if (ro) return el('span','val', obj.target);
  const s_ = el('select','key'); s_.id = 'cl-' + obj.id; s_.setAttribute('aria-label',EDITOR.queClonar);
  for (const n of [...new Set(['mí mismo', ...otherNames(), obj.target])]){ const o = el('option', null); o.value = n; o.textContent = n; if (n === obj.target) o.selected = true; s_.append(o); }
  s_.addEventListener('change', () => { obj.target = s_.value; });
  return stopEv(s_);
}

export function varSel(obj, ro){
  if (ro) return el('span','val', obj.v);
  const s_ = el('select','key vsel'); s_.id = 'v-' + obj.id; s_.setAttribute('aria-label',EDITOR.variable);
  for (const n of [...new Set([...varNames(), obj.v])]){ const o = el('option', null); o.value = n; o.textContent = n; if (n === obj.v) o.selected = true; s_.append(o); }
  s_.addEventListener('change', () => { obj.v = s_.value; });
  return stopEv(s_);
}

export function varChip(b){ const ch = el('span','dir'); const upd = () => { const v = Number(b.n) || 0; ch.hidden = !v; ch.className = 'dir' + (v < 0 ? ' neg' : ''); ch.textContent = v < 0 ? EDITOR.resta(Math.abs(v)) : EDITOR.suma(v); }; upd(); ch._upd = upd; return ch; }

export function objSel(obj, ro, withEdge){
  if (ro) return el('span','val', obj.target);
  const s_ = el('select','key'); s_.id = 'o-' + obj.id; s_.setAttribute('aria-label',EDITOR.personaje);
  const names = [...new Set([...otherNames(), obj.target, ...(withEdge ? ['borde'] : [])])].filter(Boolean);
  for (const n of names){ const o = el('option', null); o.value = n; o.textContent = n; if (n === obj.target) o.selected = true; s_.append(o); }
  s_.addEventListener('change', () => { obj.target = s_.value; });
  return stopEv(s_);
}

export function swatchEl(obj, ro){
  const c = COLORS[obj.color];
  if (ro){ const s = el('span','swatch'); s.style.background = c.hex; s.title = c.name; s.setAttribute('aria-label', EDITOR.color(c.name)); return s; }
  const b = el('button','swatch'); b.style.background = c.hex; b.id = 'c-' + obj.id;
  b.setAttribute('aria-label', EDITOR.ariaColorCambiar(c.name)); b.title = EDITOR.tituloColorCambiar(c.name);
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
  const d = el('button','del', X_SVG); d.setAttribute('aria-label',EDITOR.sacarBloque);
  d.addEventListener('click', ev => { ev.stopPropagation(); removeBlock(id); });
  return d;
}

export const isSel = (owner, i) => S.sel && S.sel.owner === owner && S.sel.index === i;

export const pick = (s, ro) => ev => { if (ro) return; ev.stopPropagation(); S.sel = s; renderProgram(); };

export function cursorEl(){ return el('div','cursor',EDITOR.cursor); }

export function msgSel(obj, ro){
  if (ro) return el('span','val', obj.msg);
  const s_ = el('select','key'); s_.id = 'm-' + obj.id; s_.setAttribute('aria-label',EDITOR.mensaje);
  for (const n of [...new Set([...msgNames(), obj.msg])]){ const o = el('option', null); o.value = n; o.textContent = n; if (n === obj.msg) o.selected = true; s_.append(o); }
  s_.addEventListener('change', () => { obj.msg = s_.value; });
  return stopEv(s_);
}

export function hatEl(sc, ro){
  const h = el('div', 'blk ' + (sc.hat === 'clone' ? 'co' : 'ev') + ' hat');
  if (sc.hat === 'flag'){ h.append(txt(ETIQUETAS.flag[0])); h.insertAdjacentHTML('beforeend', FLAG_SVG); }
  else if (sc.hat === 'key'){ h.append(txt(ETIQUETAS.key[0]), keySel(sc, ro)); }
  else if (sc.hat === 'msg'){ h.append(txt(ETIQUETAS.whenmsg[0]), msgSel(sc, ro)); }
  else if (sc.hat === 'bd'){ h.append(txt(ETIQUETAS.whenbd[0]), bdSel(sc, ro, false)); }
  else { h.append(txt(ETIQUETAS.whenclone[0])); }
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
      const s_ = el('span','condslot op' + (S.sel && S.sel.orSlot === c.id && S.sel.side === side ? ' sel' : '')); s_.setAttribute('aria-label',EDITOR.huecoPregunta);
      s_.addEventListener('click', pick({orSlot:c.id, side}, ro));
      return s_;
    };
    e.append(slot('a'), txt(c.type === 'or' ? ETIQUETAS.or[0] : ETIQUETAS.and[0]), slot('b'));
    if (!ro){ const d = el('button','del', X_SVG); d.setAttribute('aria-label',EDITOR.sacarOperador(c.type === 'or' ? ETIQUETAS.or[0] : ETIQUETAS.and[0])); d.onclick = ev => { ev.stopPropagation(); onDel(c.a || c.b || null); }; e.append(d); }
    if (onClick) e.addEventListener('click', onClick);
    return e;
  }
  const e = el('span','blk se');
  if (c.type === 'eq' || c.type === 'gt' || c.type === 'lt'){
    const g = el('span','blk op');
    const rep_ = el('span','vrep'); rep_.append(varSel(c, ro));
    g.append(rep_, txt(ETIQUETAS[c.type][0]), numIn(c, ro));
    if (!ro){ const d = el('button','del', X_SVG); d.setAttribute('aria-label',EDITOR.sacarComparacion); d.onclick = ev => { ev.stopPropagation(); onDel(); }; g.append(d); }
    if (onClick) g.addEventListener('click', onClick);
    return g;
  }
  if (c.type === 'toucho') e.append(txt(ETIQUETAS.toucho[0]), objSel(c, ro, true), txt(ETIQUETAS.toucho[1]));
  else if (c.type === 'keyp') e.append(txt(ETIQUETAS.keyp[0]), keySel(c, ro), txt(ETIQUETAS.keyp[1]));
  else e.append(txt(ETIQUETAS.touchc[0]), swatchEl(c, ro), txt(ETIQUETAS.touchc[1]));
  if (!ro){ const d = el('button','del', X_SVG); d.setAttribute('aria-label',EDITOR.sacarSensor); d.onclick = ev => { ev.stopPropagation(); onDel(); }; e.append(d); }
  if (onClick) e.addEventListener('click', onClick);
  return e;
}

export function condEl(ib, ro){
  if (ib.cond) return condBlockEl(ib.cond, ro, keep => { ib.cond = keep || null; S.sel = keep ? {owner:ib.id, index:ib.body.length} : {cond:ib.id}; renderProgram(); }, pick({owner:ib.id, index:ib.body.length}, ro));
  const s = el('span','condslot' + (S.sel && S.sel.cond === ib.id ? ' sel' : '')); s.setAttribute('aria-label',EDITOR.huecoSensor);
  s.addEventListener('click', pick({cond:ib.id}, ro));
  return s;
}

export function stmtEl(b, owner, i, ro){
  const after = pick({owner, index:i + 1}, ro);
  if (['move','cx','cy','goto','say','stop','bounce','pointdir','pointto','wait','setvar','changevar','gorandom','hide','show','broadcast','gotoobj','clone','delclone','switchbd','nextcos','setcos'].includes(b.type)){
    const cls = (b.type === 'say' || b.type === 'hide' || b.type === 'show' || b.type === 'switchbd' || b.type === 'nextcos' || b.type === 'setcos') ? 'ap' : (b.type === 'stop' || b.type === 'wait' || b.type === 'clone' || b.type === 'delclone') ? 'co' : (b.type === 'setvar' || b.type === 'changevar') ? 'va' : b.type === 'broadcast' ? 'ev' : 'mo';
    const e = el('div','blk ' + cls);
    if (b.type === 'move') e.append(txt(ETIQUETAS.move[0]), numIn(b, ro), txt(ETIQUETAS.move[1]), dirChip(b));
    else if (b.type === 'cx' || b.type === 'cy') e.append(txt(b.type === 'cx' ? ETIQUETAS.cx[0] : ETIQUETAS.cy[0]), numIn(b, ro), dirChip(b));
    else if (b.type === 'goto') e.append(txt(ETIQUETAS.goto[0]), numIn(b, ro, 'x'), txt(ETIQUETAS.goto[1]), numIn(b, ro, 'y'));
    else if (b.type === 'say') e.append(txt(ETIQUETAS.say[0]), textIn(b, ro));
    else if (b.type === 'bounce') e.append(txt(ETIQUETAS.bounce[0]));
    else if (b.type === 'pointdir') e.append(txt(ETIQUETAS.pointdir[0]), dirPickBtn(b, ro), dirChip(b));
    else if (b.type === 'pointto') e.append(txt(ETIQUETAS.pointto[0]), objSel(b, ro, false));
    else if (b.type === 'wait') e.append(txt(ETIQUETAS.wait[0]), numIn(b, ro), txt(ETIQUETAS.wait[1]));
    else if (b.type === 'setvar') e.append(txt(ETIQUETAS.setvar[0]), varSel(b, ro), txt(ETIQUETAS.setvar[1]), numIn(b, ro));
    else if (b.type === 'changevar') e.append(txt(ETIQUETAS.changevar[0]), varSel(b, ro), numIn(b, ro), varChip(b));
    else if (b.type === 'gorandom') e.append(txt(ETIQUETAS.gorandom[0]), el('span','val',ETIQUETAS.gorandom[1]));
    else if (b.type === 'hide') e.append(txt(ETIQUETAS.hide[0]));
    else if (b.type === 'switchbd') e.append(txt(ETIQUETAS.switchbd[0]), bdSel(b, ro, true));
    else if (b.type === 'nextcos') e.append(txt(ETIQUETAS.nextcos[0]));
    else if (b.type === 'setcos') e.append(txt(ETIQUETAS.setcos[0]), cosSel(b, ro));
    else if (b.type === 'show') e.append(txt(ETIQUETAS.show[0]));
    else if (b.type === 'broadcast') e.append(txt(ETIQUETAS.broadcast[0]), msgSel(b, ro));
    else if (b.type === 'gotoobj') e.append(txt(ETIQUETAS.gotoobj[0]), objSel(b, ro, false));
    else if (b.type === 'clone') e.append(txt(ETIQUETAS.clone[0]), cloneSel(b, ro));
    else if (b.type === 'delclone') e.append(txt(ETIQUETAS.delclone[0]));
    else e.append(txt(ETIQUETAS.stop[0]), el('span','val',ETIQUETAS.stop[1]));
    const d = delBtn(b.id, ro); if (d) e.append(d);
    e.addEventListener('click', after); return e;
  }
  const c = el('div','cblk');
  const head = el('div','blk co');
  if (b.type === 'forever') head.append(txt(ETIQUETAS.forever[0]));
  else if (b.type === 'repeat') head.append(txt(ETIQUETAS.repeat[0]), numIn(b, ro));
  else head.append(txt(ETIQUETAS['if'][0]), condEl(b, ro), txt(ETIQUETAS['if'][1]));
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
      st.append(hatEl(sc, ro), el('div','foldbtn ro', EDITOR.plegadoFijo(sc.fold)));
    } else if (sc.fold && !ro){
      const fb_ = el('button','foldbtn', sc.open ? EDITOR.esconder(sc.fold) : EDITOR.yaArmado(sc.fold));
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
