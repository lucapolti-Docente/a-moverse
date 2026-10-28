/* Conecta los avisos del motor con la pantalla: mensajes, sonidos, chispas, botones y ventanas. */
import { S } from '../estado.js';
import { avisos } from '../motor/avisos.js';
import { mensajeAlCargar } from '../motor/partida.js';
import { burst, monitorPulse, updateXY } from '../dibujo/escenario.js';
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
  $('#lvlNum').textContent = !inPart ? `Parte ${S.P.n} · Libre` : S.L.mode === 'cierre' ? `Parte ${S.P.n} · Cierre` : `Parte ${S.P.n} · ${S.li + 1} / ${n}`;
  $('#lvlName').textContent = S.L.mode === 'cierre' ? S.L.name.replace('Cierre: ','') : S.L.name;
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

export function conectarMotor(){
  Object.assign(avisos, {
    decir: (texto, bien) => say(texto, bien),
    sonar: nombre => SND[nombre](),
    tono: (...a) => tone(...a),
    chispas: (x, y, color) => burst(x, y, color),
    variable: v => { monitorPulse[v] = performance.now(); },
    teclas: () => padSync(),
    nivelCargado: mostrarNivel,
    reiniciado: () => updateXY(),
    gano: () => { clearTimeout(S.winTimer); S.winTimer = setTimeout(() => { SND.win(); showWin(); }, 500); }
  });
}
