import { S } from '../estado.js';
import { UI } from '../datos/textos.js';
import { say } from './aviso.js';
import { $ } from './dom.js';
import { renderExplore } from './explorar-cierre.js';
import { go, showPart } from './menu.js';
import { flagPressed as banderaMotor, keyDown as teclaMotor, keyUp, resetLevel } from '../motor/partida.js';
import { SND, ac } from '../sonido.js';
import { guardarRef, guardarSilencio, leerRef, leerSilencio } from '../guardado.js';
import { guardarProyecto } from './editor.js';
import { pasoUnaVuelta, resaltar } from './bucle.js';

/* El motor no toca la pantalla: acá se prende el audio y se suelta el foco, como en el original. */
export function flagPressed(){
  ac(); if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  guardarProyecto();
  banderaMotor();
}
export function keyDown(k){
  if (S.L.mode !== 'explore') ac();
  teclaMotor(k);
}

export function ponerVelocidad(v){
  S.velocidad = v;
  $('#lentoBtn').classList.toggle('on', v === 'lento'); $('#lentoBtn').setAttribute('aria-pressed', String(v === 'lento'));
  $('#pasoBtn').hidden = v === 'normal'; $('#pasoBtn').classList.toggle('on', v === 'pausa');
  $('#app').classList.toggle('lentoOn', v !== 'normal');
  resaltar();
}

export const DOMKEY = {ArrowRight:'right', ArrowLeft:'left', ArrowUp:'up', ArrowDown:'down', KeyW:'w', KeyA:'a', KeyS:'s', KeyD:'d', Space:'space', ' ':'space'};

export const domKey = e => DOMKEY[e.key] || DOMKEY[e.code];

let padMode = 'arrows';

export const PADKEY = {arrows:{up:'up', left:'left', down:'down', right:'right'}, wasd:{up:'w', left:'a', down:'s', right:'d'}};

export const padKey = dir => PADKEY[padMode][dir];

export function setPadMode(m){
  if (S.engine){ S.engine.releaseAll(); }
  padMode = m;
  (() => {
  const b = $('#spaceBtn'); let on = false;
  b.addEventListener('pointerdown', e => { e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch(_){} on = true; b.classList.add('on'); keyDown('space'); });
  const up = () => { if (on && S.engine) keyUp('space'); on = false; b.classList.remove('on'); };
  b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('lostpointercapture', up);
  b.addEventListener('contextmenu', e => e.preventDefault());
})();
document.querySelectorAll('#pad button').forEach(b => {
    if (!b.dataset.svg) b.dataset.svg = b.innerHTML;
    b.innerHTML = m === 'wasd' ? `<span class="padl">${padKey(b.dataset.k).toUpperCase()}</span>` : b.dataset.svg;
    b.setAttribute('aria-label', m === 'wasd' ? UI.ariaTecla(padKey(b.dataset.k).toUpperCase()) : UI.ariaFlecha[b.dataset.k]);
  });
  const t = $('#padMode'); t.textContent = m === 'wasd' ? UI.padWasd : UI.padFlechas;
  padSync();
}

export function padSync(){ document.querySelectorAll('#pad button').forEach(b => b.classList.toggle('on', !!S.engine && S.engine.held.has(padKey(b.dataset.k)))); }

export function applyRef(){
  const b = $('#refBtn');
  b.setAttribute('aria-pressed', String(S.showRef));
  b.setAttribute('aria-label', S.showRef ? UI.ariaRefOcultar : UI.ariaRefMostrar);
  b.title = S.showRef ? UI.tituloRefOcultar : UI.tituloRefMostrar;
  document.body.classList.toggle('noref', !S.showRef);
}

export function iniciarControles(){
  addEventListener('pagehide', guardarProyecto);
  $('#padMode').onclick = () => { setPadMode(padMode === 'wasd' ? 'arrows' : 'wasd'); SND.pop(); };
  addEventListener('keydown', e => {
    const k = domKey(e);
    if (!k || !$('#startScreen').hidden || !$('#winModal').hidden || !$('#introModal').hidden) return;
    // en un cuadro de texto (decir, nombre de variable) las teclas escriben; en un número o un menú ▾, las flechas manejan al bichito
    if (e.target.matches && e.target.matches('textarea, input[type=text], .mkname')) return;
    if (e.target.matches && e.target.matches('input, select')) e.target.blur();
    e.preventDefault(); if (e.repeat) return;   // no usamos la repetición del navegador: la simula el motor
    keyDown(k);
  });
  addEventListener('keyup', e => { const k = domKey(e); if (k && S.engine) keyUp(k); });
  addEventListener('blur', () => { if (S.engine){ S.engine.releaseAll(); padSync(); } });
  (() => {
    const b = $('#spaceBtn'); let on = false;
    b.addEventListener('pointerdown', e => { e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch(_){} on = true; b.classList.add('on'); keyDown('space'); });
    const up = () => { if (on && S.engine) keyUp('space'); on = false; b.classList.remove('on'); };
    b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('lostpointercapture', up);
    b.addEventListener('contextmenu', e => e.preventDefault());
  })();
  document.querySelectorAll('#pad button').forEach(b => {
    let k = null;
    b.addEventListener('pointerdown', e => { e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch(_){} k = padKey(b.dataset.k); keyDown(k); });
    const up = () => { if (k && S.engine && S.engine.held.has(k)) keyUp(k); k = null; };
    b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('lostpointercapture', up);
    b.addEventListener('contextmenu', e => e.preventDefault());
  });
  $('#flagBtn').onclick = flagPressed;
  $('#stopBtn').onclick = () => { S.engine.stop(); };
  // 🐢: normal → lento → normal; si estaba en pausa (por Paso), vuelve a lento
  $('#lentoBtn').onclick = () => { ac(); ponerVelocidad(S.velocidad === 'normal' || S.velocidad === 'pausa' ? 'lento' : 'normal'); SND.pop(); };
  $('#pasoBtn').onclick = () => { ac(); ponerVelocidad('pausa'); pasoUnaVuelta(); SND.pop(); };
  $('#resetBtn').onclick = () => { resetLevel(); if (S.L.mode === 'explore'){ S.exploreIdx = 0; S.stars.forEach(s => s.got = false); renderExplore(); } };
  $('#prev').onclick = () => go(S.li - 1);
  $('#next').onclick = () => go(S.li + 1);
  $('#home').onclick = () => showPart(S.P);
  S.showRef = leerRef();
  $('#refBtn').onclick = () => {
    S.showRef = !S.showRef; applyRef(); SND.pop();
    guardarRef(S.showRef);
    say(S.showRef ? UI.refPrendidas : UI.refApagadas);
  };
  applyRef();
  const mostrarSonido = () => { $('#sndWave').style.display = S.muted ? 'none' : ''; $('#snd').setAttribute('aria-label', S.muted ? UI.sonidoApagado : UI.sonido); };
  S.muted = leerSilencio(); mostrarSonido();
  $('#snd').onclick = () => { S.muted = !S.muted; guardarSilencio(S.muted); mostrarSonido(); };
}
