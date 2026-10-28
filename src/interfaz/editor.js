import { S } from '../estado.js';
import { UI } from '../datos/textos.js';
import { CATS, ETIQUETAS, KEYS, PAL } from '../datos/bloques.js';
import { COLORS } from '../datos/fondos.js';
import { monitorPulse } from '../dibujo/escenario.js';
import { createdVars, programs } from '../estado.js';
import { say } from './aviso.js';
import { $, FLAG_SVG, el, txt } from './dom.js';
import { fixSel, insert } from './edicion.js';
import { renderCierre, renderExplore } from './explorar-cierre.js';
import { programView } from './vista-bloques.js';
import { bdNames, msgNames, otherNames, varNames } from '../motor/nombres.js';
import { SND, ac } from '../sonido.js';
import { loadLevel } from '../motor/partida.js';
import { borrarCreacion, guardarCreacion, saveDone } from '../guardado.js';

export function renderProgram(){
  const root = $('#program'); root.innerHTML = '';
  if (S.L.mode === 'explore') return renderExplore();
  if (S.L.mode === 'cierre') return renderCierre();
  fixSel();
  if (S.L.sprites && S.sprites.length > 1){
    const tabs = el('div','tabs'); tabs.setAttribute('role','tablist');
    S.sprites.forEach((sp, i) => {
      if (sp.isClone) return;
      const tb = el('button','tab' + (i === S.curSp ? ' on' : '')); tb.dataset.sp = i; tb.setAttribute('role','tab'); tb.setAttribute('aria-selected', String(i === S.curSp));
      const dot = el('i'); dot.style.background = sp.color; tb.append(dot, txt(sp.name));
      const n = sp.program.length; tb.append(el('small', null, n ? String(n) : '0'));
      tb.onclick = () => { selectSprite(i); SND.pop(); };
      tabs.append(tb);
    });
    root.append(tabs);
  }
  const head = el('div','prog-head'); head.append(el('h3','prog-title', S.L.sprites ? UI.programasDe(S.sprites[S.curSp].name) : UI.tuPrograma));
  const clr = el('button','ghost',UI.volverComoEstaba); clr.onclick = () => {
    if (S.L.sprites){ const np = S.L.sprites[S.curSp].program(); programs[S.L.id][S.curSp] = np; S.sprites[S.curSp].program = np; S.prog = np; }
    else { programs[S.L.id] = S.L.program ? S.L.program() : []; S.prog = programs[S.L.id]; S.sprites[0].program = S.prog; }
    S.sel = null; S.engine.stop(); renderProgram(); };
  head.append(clr); root.append(head);
  if (S.L.mode === 'sandbox'){ root.append(listaTerminado()); head.append(botonDeCero()); guardarProyecto(); }
  if (!S.prog.length) root.append(el('p','empty',UI.programaVacio));
  root.append(programView(S.prog, false));
}

export function paletteBlock(t){
  let b;
  const firstColor = (S.L.colors || ['goal'])[0];
  if (t === 'flag'){ b = el('button','blk ev hat'); b.append(txt(ETIQUETAS.flag[0])); b.insertAdjacentHTML('beforeend', FLAG_SVG); }
  else if (t === 'key'){ b = el('button','blk ev hat'); b.append(txt(ETIQUETAS.key[0]), el('span','val', (S.L.defaultKey ? KEYS[S.L.defaultKey] : 'flecha') + ' ▾')); }
  else if (t === 'move'){ b = el('button','blk mo'); b.append(txt(ETIQUETAS.move[0]), el('span','val','10'), txt(ETIQUETAS.move[1])); }
  else if (t === 'cx'){ b = el('button','blk mo'); b.append(txt(ETIQUETAS.cx[0]), el('span','val','10')); }
  else if (t === 'cy'){ b = el('button','blk mo'); b.append(txt(ETIQUETAS.cy[0]), el('span','val','10')); }
  else if (t === 'goto'){ b = el('button','blk mo'); b.append(txt(ETIQUETAS.goto[0]), el('span','val', String(S.L.start.x)), txt(ETIQUETAS.goto[1]), el('span','val', String(S.L.start.y))); }
  else if (t === 'say'){ b = el('button','blk ap'); b.append(txt(ETIQUETAS.say[0]), el('span','val','¡Llegué!')); }
  else if (t === 'forever'){ b = el('button','blk co'); b.append(txt(ETIQUETAS.forever[0])); }
  else if (t === 'repeat'){ b = el('button','blk co'); b.append(txt(ETIQUETAS.repeat[0]), el('span','val','5')); }
  else if (t === 'nextcos'){ b = el('button','blk ap'); b.append(txt(ETIQUETAS.nextcos[0])); }
  else if (t === 'setcos'){ b = el('button','blk ap'); b.append(txt(ETIQUETAS.setcos[0]), el('span','val', (S.L.defaultCos || 'feliz') + ' ▾')); }
  else if (t === 'if'){ b = el('button','blk co'); b.append(txt(ETIQUETAS['if'][0]), el('span','condslot'), txt(ETIQUETAS['if'][1])); }
  else if (t === 'stop'){ b = el('button','blk co'); b.append(txt(ETIQUETAS.stop[0]), el('span','val',ETIQUETAS.stop[1])); }
  else if (t === 'keyp'){ b = el('button','blk se'); b.append(txt(ETIQUETAS.keyp[0]), el('span','val', (S.L.defaultKey ? KEYS[S.L.defaultKey] : 'flecha') + ' ▾'), txt(ETIQUETAS.keyp[1])); }
  else if (t === 'bounce'){ b = el('button','blk mo'); b.append(txt(ETIQUETAS.bounce[0])); }
  else if (t === 'pointdir'){ b = el('button','blk mo'); b.append(txt(ETIQUETAS.pointdir[0]), el('span','val','90 → ▾')); }
  else if (t === 'pointto'){ b = el('button','blk mo'); b.append(txt(ETIQUETAS.pointto[0]), el('span','val', (otherNames()[0] || 'Bichito') + ' ▾')); }
  else if (t === 'wait'){ b = el('button','blk co'); b.append(txt(ETIQUETAS.wait[0]), el('span','val','1'), txt(ETIQUETAS.wait[1])); }
  else if (t === 'whenmsg'){ b = el('button','blk ev hat'); b.append(txt(ETIQUETAS.whenmsg[0]), el('span','val', msgNames()[0] + ' ▾')); }
  else if (t === 'whenbd'){ b = el('button','blk ev hat'); b.append(txt(ETIQUETAS.whenbd[0]), el('span','val', (bdNames()[1] || bdNames()[0]) + ' ▾')); }
  else if (t === 'switchbd'){ b = el('button','blk ap'); b.append(txt(ETIQUETAS.switchbd[0]), el('span','val', (S.L.defaultBd || bdNames()[0]) + ' ▾')); }
  else if (t === 'whenclone'){ b = el('button','blk co hat'); b.append(txt(ETIQUETAS.whenclone[0])); }
  else if (t === 'broadcast'){ b = el('button','blk ev'); b.append(txt(ETIQUETAS.broadcast[0]), el('span','val', msgNames()[0] + ' ▾')); }
  else if (t === 'hide'){ b = el('button','blk ap'); b.append(txt(ETIQUETAS.hide[0])); }
  else if (t === 'show'){ b = el('button','blk ap'); b.append(txt(ETIQUETAS.show[0])); }
  else if (t === 'and'){ b = el('button','blk op'); b.append(el('span','condslot op'), txt(ETIQUETAS.and[0]), el('span','condslot op')); }
  else if (t === 'gotoobj'){ b = el('button','blk mo'); b.append(txt(ETIQUETAS.gotoobj[0]), el('span','val', (otherNames()[0] || 'Bichito') + ' ▾')); }
  else if (t === 'clone'){ b = el('button','blk co'); b.append(txt(ETIQUETAS.clone[0]), el('span','val', (otherNames().includes('Semilla') ? 'Semilla' : 'mí mismo') + ' ▾')); }
  else if (t === 'delclone'){ b = el('button','blk co'); b.append(txt(ETIQUETAS.delclone[0])); }
  else if (t === 'setvar'){ b = el('button','blk va'); b.append(txt(ETIQUETAS.setvar[0]), el('span','val', varNames()[0] + ' ▾'), txt(ETIQUETAS.setvar[1]), el('span','val','0')); }
  else if (t === 'changevar'){ b = el('button','blk va'); b.append(txt(ETIQUETAS.changevar[0]), el('span','val', varNames()[0] + ' ▾'), el('span','val','1')); }
  else if (t === 'eq'){ b = el('button','blk op'); b.append(el('span','vrep', varNames()[0]), txt(ETIQUETAS.eq[0]), el('span','val','0')); }
  else if (t === 'gt'){ b = el('button','blk op'); b.append(el('span','vrep', varNames()[0]), txt(ETIQUETAS.gt[0]), el('span','val','0')); }
  else if (t === 'lt'){ b = el('button','blk op'); b.append(el('span','vrep', varNames()[0]), txt(ETIQUETAS.lt[0]), el('span','val','0')); }
  else if (t === 'gorandom'){ b = el('button','blk mo'); b.append(txt(ETIQUETAS.gorandom[0]), el('span','val',ETIQUETAS.gorandom[1])); }
  else if (t === 'toucho'){ b = el('button','blk se'); b.append(txt(ETIQUETAS.toucho[0]), el('span','val', (otherNames()[0] || 'borde') + ' ▾'), txt(ETIQUETAS.toucho[1])); }
  else if (t === 'or'){ b = el('button','blk op'); b.append(el('span','condslot op'), txt(ETIQUETAS.or[0]), el('span','condslot op')); }
  else if (t === 'touchc'){ b = el('button','blk se'); const sw = el('span','swatch'); sw.style.background = COLORS[firstColor].hex; b.append(txt(ETIQUETAS.touchc[0]), sw, txt(ETIQUETAS.touchc[1])); }
  b.onclick = () => insert(t);
  return b;
}

export function openCreateVar(){
  ac();
  const wrap = el('div','modal'), card = el('div','card mkcard');
  card.setAttribute('role','dialog'); card.setAttribute('aria-modal','true'); card.setAttribute('aria-labelledby','mkTitle');
  const V = UI.nuevaVariable;
  card.innerHTML = `<h2 id="mkTitle">${V.titulo}</h2>
    <label class="lab" for="mkName">${V.nombre}</label>
    <input id="mkName" class="mkname" type="text" maxlength="16" autocomplete="off" placeholder="${V.ejemplo}">
    <div class="mkradio"><span class="on">${V.todos}</span><span>${V.este}</span></div>
    <p class="mkerr" id="mkErr" hidden></p>
    <div class="acts"><button class="ghost" id="mkCancel">${V.cancelar}</button><button class="primary" id="mkOk">${V.aceptar}</button></div>`;
  wrap.append(card); document.body.append(wrap);
  const inp = card.querySelector('#mkName'), err = card.querySelector('#mkErr');
  inp.focus();
  const close = () => wrap.remove();
  const ok = () => {
    const name = inp.value.trim().toLowerCase();
    if (!name){ err.textContent = UI.varSinNombre; err.hidden = false; return; }
    if (varNames().includes(name)){ err.textContent = UI.varRepetida; err.hidden = false; return; }
    (createdVars[S.L.id] = createdVars[S.L.id] || []).push(name);
    S.VARS[name] = 0; monitorPulse[name] = performance.now();
    close(); SND.star(); renderPalette(); renderProgram();
    say(UI.varCreada(name), true);
  };
  card.querySelector('#mkOk').onclick = ok;
  card.querySelector('#mkCancel').onclick = close;
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') ok(); if (e.key === 'Escape') close(); });
  wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
}

export function renderPalette(){
  const p = $('#palette'); p.innerHTML = '';
  $('#right').classList.toggle('nopal', !S.L.palette.length);
  if (!S.L.palette.length){ p.hidden = true; return; }
  p.hidden = false;
  p.append(el('h3','pal-title',UI.paletaTitulo));
  for (const cat of ['ev','mo','ap','co','se','op','va']){
    let items = S.L.palette.filter(t => PAL[t].cat === cat);
    const mk = cat === 'va' && S.L.allowCreateVar;
    if (cat === 'va' && !varNames().length) items = [];
    if (!items.length && !mk) continue;
    const g = el('div','pal-group'); const h = el('div','pal-cat'); const dot = el('i'); dot.style.background = CATS[cat][1]; h.append(dot, txt(CATS[cat][0])); g.append(h);
    const box = el('div','pal-items');
    if (mk){ const cb = el('button','mkvar',UI.crearVariable); cb.onclick = openCreateVar; box.append(cb); }
    for (const t of items) box.append(paletteBlock(t));
    g.append(box); p.append(g);
  }
}

/* Creá tu juego: guarda el proyecto (programas, variables creadas y lista). */
export function guardarProyecto(){
  if (S.L.mode !== 'sandbox') return;
  guardarCreacion({ programas: programs[S.L.id], variables: createdVars[S.L.id] || [], terminado: S.terminado });
}

function listaTerminado(){
  const d = el('details','terminado'); d.append(el('summary', null, UI.terminadoTitulo));
  S.L.terminado.forEach((t, i) => {
    const lab = el('label'), cb = el('input'); cb.type = 'checkbox'; cb.checked = S.terminado.includes(i);
    cb.onchange = () => {
      S.terminado = cb.checked ? [...new Set([...S.terminado, i])] : S.terminado.filter(x => x !== i);
      guardarProyecto(); SND.pop();
      if (S.terminado.length === S.L.terminado.length){ S.done.add(S.L.id); saveDone(); SND.win(); say(UI.terminadoListo, true); }
    };
    lab.append(cb, txt(t)); d.append(lab);
  });
  return d;
}

function botonDeCero(){
  const b = el('button','ghost',UI.empezarDeCero);
  b.onclick = () => {
    if (!confirm(UI.empezarDeCeroSeguro)) return;
    borrarCreacion(); delete programs[S.L.id]; delete createdVars[S.L.id]; S.terminado = [];
    loadLevel(S.L);
  };
  return b;
}

export function selectSprite(i){ S.curSp = i; S.prog = S.sprites[i].program; S.sel = null; fixSel(); renderProgram(); }
