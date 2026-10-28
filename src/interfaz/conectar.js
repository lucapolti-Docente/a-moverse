/* Conecta los avisos del motor con la pantalla: mensajes, sonidos, chispas, botones y ventanas. */
import { S } from '../estado.js';
import { UI } from '../datos/textos.js';
import { avisos } from '../motor/avisos.js';
import { mensajeAlCargar } from '../motor/partida.js';
import { agregarEfecto, burst, monitorPulse, updateXY } from '../dibujo/escenario.js';
import { SND, tone } from '../sonido.js';
import { say } from './aviso.js';
import { padSync, setPadMode } from './controles.js';
import { $ } from './dom.js';
import { fixSel } from './edicion.js';
import { renderPalette, renderProgram } from './editor.js';
import { showWin } from './ventanas.js';

/* Lo que se ve al cargar un nivel: barra de arriba, desafío, botones, paleta y programa. */
function mostrarNivel(){
  clearTimeout(S.winTimer);
  fixSel();
  const inPart = S.li >= 0;
  const n = S.P.levels.filter(l => l.mode !== 'cierre').length;
  $('#lvlNum').textContent = !inPart ? UI.barraLibre(S.P.n) : S.L.mode === 'cierre' ? UI.barraCierre(S.P.n) : UI.barraNivel(S.P.n, S.li + 1, n);
  $('#lvlName').textContent = S.L.mode === 'cierre' ? S.L.name.replace(UI.prefijoCierre, '') : S.L.name;
  $('#prev').disabled = !inPart || S.li === 0; $('#next').disabled = !inPart || S.li === S.P.levels.length - 1;
  $('#goalText').textContent = S.L.goal;
  $('#pad').classList.toggle('off', S.L.mode === 'explore');
  setPadMode(S.L.pad === 'wasd' ? 'wasd' : 'arrows');
  $('#padMode').hidden = !S.L.padToggle;
  $('#spaceBtn').hidden = !S.L.spaceBtn;
  $('#app').classList.toggle('withspace', !!S.L.spaceBtn);
  $('#flagBtn').disabled = $('#stopBtn').disabled = S.L.mode === 'explore';
  $('#fb').hidden = true; S.lastMsg = '';
  renderPalette(); renderProgram(); updateXY();
  $('#introBtn').hidden = !S.L.intro;
  const m = mensajeAlCargar();
  if (m) say(m);
}

/* Errores amables: el mensaje se sacude un poquito (después de que se muestra). */
function sacudirMensaje(){
  setTimeout(() => { const fb = $('#fb'); if (fb.hidden) return; fb.classList.remove('sacudir'); void fb.offsetWidth; fb.classList.add('sacudir'); }, 0);
}

export function conectarMotor(){
  Object.assign(avisos, {
    decir: (texto, bien) => say(texto, bien),
    sonar: nombre => { SND[nombre](); if (nombre === 'oops' || nombre === 'bump') sacudirMensaje(); },
    tono: (...a) => tone(...a),
    chispas: (x, y, color) => burst(x, y, color),
    variable: v => { monitorPulse[v] = performance.now(); },
    teclas: () => padSync(),
    nivelCargado: mostrarNivel,
    reiniciado: () => updateXY(),
    gano: () => { clearTimeout(S.winTimer); agregarEfecto('festejo', {}); S.winTimer = setTimeout(() => { SND.win(); showWin(); }, 500); },
    efecto: (tipo, datos) => agregarEfecto(tipo, datos)
  });
}
