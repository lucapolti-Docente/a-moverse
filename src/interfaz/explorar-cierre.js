import { S } from '../estado.js';
import { burst } from '../dibujo/escenario.js';
import { say } from './aviso.js';
import { $, el, txt } from './dom.js';
import { programView } from './vista-bloques.js';
import { checkWin } from '../motor/partida.js';
import { SND, ac } from '../sonido.js';

export function renderExplore(){
  const root = $('#program'); root.innerHTML = '';
  const box = el('div','explore');
  if (S.exploreIdx >= S.L.stars.length){ box.append(el('p',null,'¡Encontraste las dos estrellas!')); root.append(box); return; }
  box.append(el('p',null, S.exploreIdx ? `¡Ya encontraste una! Falta ${S.L.stars.length - S.exploreIdx}. ¿En qué x y en qué y está?` : 'Elegí cualquier estrella, la que quieras. ¿En qué x y en qué y está?'));
  box.append(el('p','hintline','Pista: llevá al bichito arriba de la estrella y mirá los números de arriba a la izquierda.'));
  for (const ax of ['x','y']){
    const r = el('div','ex-row'); const lab = el('label', null, ax); lab.htmlFor = 'g' + ax;
    const minus = el('button','step','−10'), plus = el('button','step','+10'), inp = el('input'); inp.type = 'number'; inp.id = 'g' + ax; inp.value = 0; inp.step = 10;
    minus.onclick = () => inp.value = (Number(inp.value) || 0) - 10; plus.onclick = () => inp.value = (Number(inp.value) || 0) + 10;
    r.append(lab, minus, inp, plus); box.append(r);
  }
  const ok = el('button','primary','Comprobar'); ok.onclick = checkGuess; box.append(ok);
  root.append(box);
}

export function checkGuess(){
  ac();
  const gx = Number($('#gx').value) || 0, gy = Number($('#gy').value) || 0;
  const left = S.stars.filter(st => !st.got);
  const s = left.reduce((a, b) => Math.hypot(b.x - gx, b.y - gy) < Math.hypot(a.x - gx, a.y - gy) ? b : a);
  const okx = Math.abs(gx - s.x) <= 20, oky = Math.abs(gy - s.y) <= 20;
  if (okx && oky){
    s.got = true; burst(s.x, s.y); SND.star();
    say(`¡Sí! Está en x: ${s.x}, y: ${s.y}.`, true);
    S.exploreIdx++; renderExplore(); checkWin(); return;
  }
  SND.oops();
  if (!okx && !oky) say('Todavía no. Mirá: ¿la estrella está a la derecha (más) o a la izquierda (menos) del centro?');
  else if (!okx) say('La y está bien. La x no: x es para los costados. Derecha es más, izquierda es menos.');
  else say('La x está bien. La y no: y es arriba y abajo. Arriba es más, abajo es menos.');
}

export function renderCierre(){
  const root = $('#program'); root.innerHTML = '';
  const box = el('div','cierre');
  const two = el('div','twoprog');
  if (S.sprites.length === 1) two.style.gridTemplateColumns = '1fr';
  if (S.L.sprites) two.style.gridTemplateColumns = '1fr';
  S.sprites.forEach(sp => {
    const col = el('div'); const h = el('h4'); const dot = el('i'); dot.style.background = sp.color; h.append(dot, txt(sp.label)); col.append(h, programView(sp.program, true)); two.append(col);
  });
  box.append(two);
  S.L.quiz.forEach((Q, qi) => {
    const q = el('div','q'); q.append(el('p', null, Q.q));
    const why = el('p','why'); why.hidden = true;
    Q.opts.forEach(([t, right, exp]) => {
      const b = el('button', S.quiz[qi] && right ? 'yes' : '', t);
      b.onclick = () => {
        ac();
        if (right){ S.quiz[qi] = true; b.className = 'yes'; why.textContent = exp; why.hidden = false; SND.star(); checkWin(); }
        else { b.className = 'no'; SND.oops(); say('Mmm, no. Mirá el programa y probá otra.'); }
      };
      q.append(b);
    });
    if (S.quiz[qi]){ why.textContent = Q.opts.find(o => o[1])[2]; why.hidden = false; }
    q.append(why); box.append(q);
  });
  root.append(box);
}
