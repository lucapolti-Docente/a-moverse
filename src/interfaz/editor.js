import { S } from '../estado.js';
import { CATS, KEYS, PAL } from '../datos/bloques.js';
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

export function renderProgram(){
  const root = $('#program'); root.innerHTML = '';
  if (S.L.mode === 'explore') return renderExplore();
  if (S.L.mode === 'cierre') return renderCierre();
  fixSel();
  if (S.L.sprites && S.sprites.length > 1){
    const tabs = el('div','tabs'); tabs.setAttribute('role','tablist');
    S.sprites.forEach((sp, i) => {
      if (sp.isClone) return;
      const tb = el('button','tab' + (i === S.curSp ? ' on' : '')); tb.setAttribute('role','tab'); tb.setAttribute('aria-selected', String(i === S.curSp));
      const dot = el('i'); dot.style.background = sp.color; tb.append(dot, txt(sp.name));
      const n = sp.program.length; tb.append(el('small', null, n ? String(n) : '0'));
      tb.onclick = () => { selectSprite(i); SND.pop(); };
      tabs.append(tb);
    });
    root.append(tabs);
  }
  const head = el('div','prog-head'); head.append(el('h3','prog-title', S.L.sprites ? 'Programas de ' + S.sprites[S.curSp].name : 'Tu programa'));
  const clr = el('button','ghost','Volver a como estaba'); clr.onclick = () => {
    if (S.L.sprites){ const np = S.L.sprites[S.curSp].program(); programs[S.L.id][S.curSp] = np; S.sprites[S.curSp].program = np; S.prog = np; }
    else { programs[S.L.id] = S.L.program ? S.L.program() : []; S.prog = programs[S.L.id]; S.sprites[0].program = S.prog; }
    S.sel = null; S.engine.stop(); renderProgram(); };
  head.append(clr); root.append(head);
  if (!S.prog.length) root.append(el('p','empty','Tocá un bloque amarillo de Eventos para empezar. Los bloques que toques aparecen acá.'));
  root.append(programView(S.prog, false));
}

export function paletteBlock(t){
  let b;
  const firstColor = (S.L.colors || ['goal'])[0];
  if (t === 'flag'){ b = el('button','blk ev hat'); b.append(txt('al hacer clic en')); b.insertAdjacentHTML('beforeend', FLAG_SVG); }
  else if (t === 'key'){ b = el('button','blk ev hat'); b.append(txt('al presionar tecla'), el('span','val', (S.L.defaultKey ? KEYS[S.L.defaultKey] : 'flecha') + ' ▾')); }
  else if (t === 'move'){ b = el('button','blk mo'); b.append(txt('mover'), el('span','val','10'), txt('pasos')); }
  else if (t === 'cx'){ b = el('button','blk mo'); b.append(txt('sumar a x'), el('span','val','10')); }
  else if (t === 'cy'){ b = el('button','blk mo'); b.append(txt('sumar a y'), el('span','val','10')); }
  else if (t === 'goto'){ b = el('button','blk mo'); b.append(txt('ir a x:'), el('span','val', String(S.L.start.x)), txt('y:'), el('span','val', String(S.L.start.y))); }
  else if (t === 'say'){ b = el('button','blk ap'); b.append(txt('decir'), el('span','val','¡Llegué!')); }
  else if (t === 'forever'){ b = el('button','blk co'); b.append(txt('por siempre')); }
  else if (t === 'repeat'){ b = el('button','blk co'); b.append(txt('repetir'), el('span','val','5'), txt('veces')); }
  else if (t === 'nextcos'){ b = el('button','blk ap'); b.append(txt('siguiente disfraz')); }
  else if (t === 'setcos'){ b = el('button','blk ap'); b.append(txt('cambiar disfraz a'), el('span','val', (S.L.defaultCos || 'feliz') + ' ▾')); }
  else if (t === 'if'){ b = el('button','blk co'); b.append(txt('si'), el('span','condslot'), txt('entonces')); }
  else if (t === 'stop'){ b = el('button','blk co'); b.append(txt('detener'), el('span','val','todos ▾')); }
  else if (t === 'keyp'){ b = el('button','blk se'); b.append(txt('¿tecla'), el('span','val', (S.L.defaultKey ? KEYS[S.L.defaultKey] : 'flecha') + ' ▾'), txt('presionada?')); }
  else if (t === 'bounce'){ b = el('button','blk mo'); b.append(txt('rebotar si toca un borde')); }
  else if (t === 'pointdir'){ b = el('button','blk mo'); b.append(txt('apuntar en dirección'), el('span','val','90 → ▾')); }
  else if (t === 'pointto'){ b = el('button','blk mo'); b.append(txt('apuntar hacia'), el('span','val', (otherNames()[0] || 'Bichito') + ' ▾')); }
  else if (t === 'wait'){ b = el('button','blk co'); b.append(txt('esperar'), el('span','val','1'), txt('segundos')); }
  else if (t === 'whenmsg'){ b = el('button','blk ev hat'); b.append(txt('al recibir'), el('span','val', msgNames()[0] + ' ▾')); }
  else if (t === 'whenbd'){ b = el('button','blk ev hat'); b.append(txt('al cambiar el fondo a'), el('span','val', (bdNames()[1] || bdNames()[0]) + ' ▾')); }
  else if (t === 'switchbd'){ b = el('button','blk ap'); b.append(txt('cambiar fondo a'), el('span','val', (S.L.defaultBd || bdNames()[0]) + ' ▾')); }
  else if (t === 'whenclone'){ b = el('button','blk co hat'); b.append(txt('al comenzar como clon')); }
  else if (t === 'broadcast'){ b = el('button','blk ev'); b.append(txt('enviar mensaje'), el('span','val', msgNames()[0] + ' ▾')); }
  else if (t === 'hide'){ b = el('button','blk ap'); b.append(txt('esconder')); }
  else if (t === 'show'){ b = el('button','blk ap'); b.append(txt('mostrar')); }
  else if (t === 'and'){ b = el('button','blk op'); b.append(el('span','condslot op'), txt('y'), el('span','condslot op')); }
  else if (t === 'gotoobj'){ b = el('button','blk mo'); b.append(txt('ir a'), el('span','val', (otherNames()[0] || 'Bichito') + ' ▾')); }
  else if (t === 'clone'){ b = el('button','blk co'); b.append(txt('crear clon de'), el('span','val', (otherNames().includes('Semilla') ? 'Semilla' : 'mí mismo') + ' ▾')); }
  else if (t === 'delclone'){ b = el('button','blk co'); b.append(txt('eliminar este clon')); }
  else if (t === 'setvar'){ b = el('button','blk va'); b.append(txt('dar a'), el('span','val', varNames()[0] + ' ▾'), txt('el valor'), el('span','val','0')); }
  else if (t === 'changevar'){ b = el('button','blk va'); b.append(txt('sumar a'), el('span','val', varNames()[0] + ' ▾'), el('span','val','1')); }
  else if (t === 'eq'){ b = el('button','blk op'); b.append(el('span','vrep', varNames()[0]), txt('='), el('span','val','0')); }
  else if (t === 'gt'){ b = el('button','blk op'); b.append(el('span','vrep', varNames()[0]), txt('>'), el('span','val','0')); }
  else if (t === 'lt'){ b = el('button','blk op'); b.append(el('span','vrep', varNames()[0]), txt('<'), el('span','val','0')); }
  else if (t === 'gorandom'){ b = el('button','blk mo'); b.append(txt('ir a'), el('span','val','posición aleatoria ▾')); }
  else if (t === 'toucho'){ b = el('button','blk se'); b.append(txt('¿tocando'), el('span','val', (otherNames()[0] || 'borde') + ' ▾'), txt('?')); }
  else if (t === 'or'){ b = el('button','blk op'); b.append(el('span','condslot op'), txt('o'), el('span','condslot op')); }
  else if (t === 'touchc'){ b = el('button','blk se'); const sw = el('span','swatch'); sw.style.background = COLORS[firstColor].hex; b.append(txt('¿tocando el color'), sw, txt('?')); }
  b.onclick = () => insert(t);
  return b;
}

export function openCreateVar(){
  ac();
  const wrap = el('div','modal'), card = el('div','card mkcard');
  card.setAttribute('role','dialog'); card.setAttribute('aria-modal','true'); card.setAttribute('aria-labelledby','mkTitle');
  card.innerHTML = `<h2 id="mkTitle">Nueva variable</h2>
    <label class="lab" for="mkName">Nombre de la variable:</label>
    <input id="mkName" class="mkname" type="text" maxlength="16" autocomplete="off" placeholder="por ejemplo: monedas">
    <div class="mkradio"><span class="on">● Para todos los objetos</span><span>○ Solo para este objeto</span></div>
    <p class="mkerr" id="mkErr" hidden></p>
    <div class="acts"><button class="ghost" id="mkCancel">Cancelar</button><button class="primary" id="mkOk">Aceptar</button></div>`;
  wrap.append(card); document.body.append(wrap);
  const inp = card.querySelector('#mkName'), err = card.querySelector('#mkErr');
  inp.focus();
  const close = () => wrap.remove();
  const ok = () => {
    const name = inp.value.trim().toLowerCase();
    if (!name){ err.textContent = 'Escribí un nombre. Por ejemplo: monedas.'; err.hidden = false; return; }
    if (varNames().includes(name)){ err.textContent = 'Ya hay una variable con ese nombre.'; err.hidden = false; return; }
    (createdVars[S.L.id] = createdVars[S.L.id] || []).push(name);
    S.VARS[name] = 0; monitorPulse[name] = performance.now();
    close(); SND.star(); renderPalette(); renderProgram();
    say(`¡Creaste la variable “${name}”! Ya aparece el cartel en el escenario y los bloques naranjas para usarla.`, true);
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
  p.append(el('h3','pal-title','Bloques (tocá para sumar)'));
  for (const cat of ['ev','mo','ap','co','se','op','va']){
    let items = S.L.palette.filter(t => PAL[t].cat === cat);
    const mk = cat === 'va' && S.L.allowCreateVar;
    if (cat === 'va' && !varNames().length) items = [];
    if (!items.length && !mk) continue;
    const g = el('div','pal-group'); const h = el('div','pal-cat'); const dot = el('i'); dot.style.background = CATS[cat][1]; h.append(dot, txt(CATS[cat][0])); g.append(h);
    const box = el('div','pal-items');
    if (mk){ const cb = el('button','mkvar','Crear una variable'); cb.onclick = openCreateVar; box.append(cb); }
    for (const t of items) box.append(paletteBlock(t));
    g.append(box); p.append(g);
  }
}

export function selectSprite(i){ S.curSp = i; S.prog = S.sprites[i].program; S.sel = null; fixSel(); renderProgram(); }
