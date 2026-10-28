import { S } from '../estado.js';
import { UI } from '../datos/textos.js';
import { $ } from './dom.js';
import { go, showParts } from './menu.js';
import { programView } from './vista-bloques.js';
import { ac } from '../sonido.js';

export function showWin(){
  $('#winText').textContent = typeof S.L.learn === 'function' ? S.L.learn() : S.L.learn;
  $('#winExtra').hidden = !S.L.extra; $('#winExtra').textContent = S.L.extra || '';
  const last = S.li === S.P.levels.length - 1;
  $('#winNext').textContent = last ? UI.volverAlMenu : UI.siguienteNivel;
  $('#winTitle').textContent = last ? UI.terminaste(S.P.n) : UI.loLograste;
  $('#winModal').hidden = false; $('#winNext').focus();
}

export function showIntro(){
  const I = S.L.intro;
  $('#introTitle').textContent = I.title; $('#introText').textContent = I.text; $('#introNote').textContent = I.note;
  const ex = $('#introEx'); ex.innerHTML = '';
  ex.hidden = $('#introExLab').hidden = !I.example; if (I.example) ex.append(programView(I.example(), true));
  $('#introNote').hidden = !I.note; $('#introNote').textContent = I.note || '';
  $('#introModal').hidden = false; $('#introGo').focus({preventScroll:true}); $('#introModal .card').scrollTop = 0;
}

export function iniciarVentanas(){
  $('#introGo').onclick = () => { ac(); $('#introModal').hidden = true; };
  $('#introBtn').onclick = showIntro;
  $('#winAgain').onclick = () => { $('#winModal').hidden = true; };
  $('#winNext').onclick = () => { $('#winModal').hidden = true; if (S.li === S.P.levels.length - 1) showParts(); else go(S.li + 1); };
}
