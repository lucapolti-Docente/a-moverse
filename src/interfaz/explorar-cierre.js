import { S } from '../estado.js';
import { burst } from '../dibujo/escenario.js';
import { say } from './aviso.js';
import { $, el, txt } from './dom.js';
import { programView } from './vista-bloques.js';
import { adivinar, responder } from '../motor/partida.js';
import { CIERRE, EXPLORAR } from '../datos/textos.js';
import { SND, ac } from '../sonido.js';

export function renderExplore(){
  const root = $('#program'); root.innerHTML = '';
  const box = el('div','explore');
  if (S.exploreIdx >= S.L.stars.length){ box.append(el('p',null,EXPLORAR.todas)); root.append(box); return; }
  box.append(el('p',null, S.exploreIdx ? EXPLORAR.falta(S.L.stars.length - S.exploreIdx) : EXPLORAR.elegi));
  box.append(el('p','hintline',EXPLORAR.pista));
  for (const ax of ['x','y']){
    const r = el('div','ex-row'); const lab = el('label', null, ax); lab.htmlFor = 'g' + ax;
    const minus = el('button','step','−10'), plus = el('button','step','+10'), inp = el('input'); inp.type = 'number'; inp.id = 'g' + ax; inp.value = 0; inp.step = 10;
    minus.onclick = () => inp.value = (Number(inp.value) || 0) - 10; plus.onclick = () => inp.value = (Number(inp.value) || 0) + 10;
    r.append(lab, minus, inp, plus); box.append(r);
  }
  const ok = el('button','primary',EXPLORAR.comprobar); ok.onclick = checkGuess; box.append(ok);
  root.append(box);
}

export function checkGuess(){
  ac();
  const gx = Number($('#gx').value) || 0, gy = Number($('#gy').value) || 0;
  const { estrella: s, okx, oky } = adivinar(gx, gy);
  if (okx && oky){
    burst(s.x, s.y); SND.star();
    say(EXPLORAR.si(s.x, s.y), true);
    renderExplore(); return;
  }
  SND.oops();
  if (!okx && !oky) say(EXPLORAR.ningunaBien);
  else if (!okx) say(EXPLORAR.xMal);
  else say(EXPLORAR.yMal);
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
    Q.opts.forEach(([t, right, exp], oi) => {
      const b = el('button', S.quiz[qi] && right ? 'yes' : '', t);
      b.onclick = () => {
        ac();
        if (responder(qi, oi)){ b.className = 'yes'; why.textContent = exp; why.hidden = false; SND.star(); }
        else { b.className = 'no'; SND.oops(); say(CIERRE.mal); }
      };
      q.append(b);
    });
    if (S.quiz[qi]){ why.textContent = Q.opts.find(o => o[1])[2]; why.hidden = false; }
    q.append(why); box.append(q);
  });
  root.append(box);
}
