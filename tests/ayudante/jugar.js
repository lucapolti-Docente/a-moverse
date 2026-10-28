/* Juega un nivel en Node, sin pantalla: carga el nivel, pone el programa de la solución, aprieta la
   banderita y simula las teclas con un piloto automático que esquiva paredes, lava, piedras y avispas.
   Avanza el motor tick por tick (30 ticks = 1 segundo), así un nivel entero tarda milisegundos. */
import { S } from '../../src/estado.js';
import { PARTS } from '../../src/datos/partes/index.js';
import { avisos } from '../../src/motor/avisos.js';
import { BODY_R, adivinar, afterStep, flagPressed, keyDown, keyUp, loadLevel, responder, touchAt } from '../../src/motor/partida.js';
import { programs, createdVars } from '../../src/estado.js';

/* Azar repetible: el mismo de las capturas. */
export function fijarAzar(){ let s = 12345; Math.random = () => (s = (s * 16807) % 2147483647, (s - 1) / 2147483646); }

/* Todos los niveles, con su parte y su posición. */
export const NIVELES = PARTS.flatMap(p => p.levels.map((l, i) => ({ parte: p, i, nivel: l })));

const TECLAS = { arrows: { r: 'right', l: 'left', u: 'up', d: 'down' }, wasd: { r: 'd', l: 'a', u: 'w', d: 's' } };

function crearPiloto(){
  const vel = {};
  let n = 0, campo = null, campoClave = '';
  const tick = () => {
    S.engine.step(); afterStep();
    for (const s of S.sprites){ vel[s.name] = { x: s.x - (s.__px ?? s.x), y: s.y - (s.__py ?? s.y) }; s.__px = s.x; s.__py = s.y; }
  };
  const bloqueada = (x, y) => touchAt(x, y, BODY_R + 1, 'wall') || touchAt(x, y, BODY_R + 1, 'lava') ||
    !!(S.L.rocks && S.L.rocks.some(r => Math.hypot(r.x - x, r.y - y) < 28));
  const G = 5, NX = 91, NY = 67, celda = (x, y) => [Math.round((x + 225) / G), Math.round((y + 165) / G)];
  // distancias desde el destino (BFS en grilla de 5 px), recalculadas solo si cambia el destino o el mapa
  const distancias = a => {
    const clave = Math.round(a.x / G) + ',' + Math.round(a.y / G) + ',' + S.BACKDROP + S.L.id;
    if (clave === campoClave) return campo;
    const libre = new Uint8Array(NX * NY), d = new Float32Array(NX * NY).fill(Infinity);
    for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) libre[i * NY + j] = bloqueada(i * G - 225, j * G - 165) ? 0 : 1;
    const [fi, fj] = celda(a.x, a.y), cola = [];
    for (let i = fi - 2; i <= fi + 2; i++) for (let j = fj - 2; j <= fj + 2; j++) if (i >= 0 && j >= 0 && i < NX && j < NY){ d[i * NY + j] = 0; cola.push(i * NY + j); }
    for (let q = 0; q < cola.length; q++){
      const c = cola[q], i = Math.floor(c / NY), j = c % NY;
      for (const [di, dj, w] of [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.4], [1, -1, 1.4], [-1, 1, 1.4], [-1, -1, 1.4]]){
        const ni = i + di, nj = j + dj, k = ni * NY + nj;
        if (ni < 0 || nj < 0 || ni >= NX || nj >= NY || !libre[k] || d[k] <= d[c] + w) continue;
        d[k] = d[c] + w; cola.push(k);
      }
    }
    campo = d; campoClave = clave; return d;
  };
  const distEn = (d, x, y) => { const [i, j] = celda(Math.max(-224, Math.min(224, x)), Math.max(-164, Math.min(164, y))); return d[i * NY + j]; };
  // prueba las 9 combinaciones de flechas y elige la que más acerca sin pisar nada ni quedar cerca de una avispa
  const mejorMovida = (b, obj, enemigos, op) => {
    const d = distancias(obj), opciones = [];
    for (const sx of [0, 1, -1]) for (const sy of [0, 1, -1]){
      if (op.ejes === 1 && sx && sy) continue;
      const x = b.x + sx * 10, y = b.y + sy * 10;
      if ((sx || sy) && bloqueada(x, y)) continue;
      let costo = distEn(d, x, y);
      for (const e of enemigos){
        const v = vel[e.name] || { x: 0, y: 0 };
        for (const t of [0, 3, 6]){ const r = Math.hypot(e.x + v.x * t - x, e.y + v.y * t - y); if (r < 60) costo += (60 - r) * 4; }
      }
      opciones.push({ sx, sy, costo });
    }
    opciones.sort((p, q) => p.costo - q.costo);
    return opciones[0];
  };
  const destino = (d, b) => {
    if (d === 'estrellas'){
      const quedan = S.stars.filter(s => !s.got && !s.opt);
      if (!quedan.length) return null;
      return quedan.reduce((m, s) => Math.hypot(s.x - b.x, s.y - b.y) < Math.hypot(m.x - b.x, m.y - b.y) ? s : m);
    }
    if (d === 'meta'){
      const g = (S.L.map || []).find(m => m.c === 'goal');
      return g && { x: (Math.max(g.x0, -224) + Math.min(g.x1, 224)) / 2, y: (Math.max(g.y0, -164) + Math.min(g.y1, 164)) / 2 };
    }
    if (typeof d === 'string'){ const s = S.sprites.find(o => o.name === d && !o.hidden); return s && { x: s.x, y: s.y }; }
    if (d.debajo){
      const vs = S.sprites.filter(o => o.name === d.debajo && !o.hidden && o.y > b.y + 20);
      if (!vs.length) return null;
      const s = vs.reduce((m, o) => o.y < m.y ? o : m);
      const v = vel[s.name] || { x: 0 }, t = Math.max(0, (s.y - b.y) / 15);
      return { x: s.x + v.x * t, y: b.y, apuntar: true };
    }
  };
  const piloto = (d, op) => {
    const b = S.sprites.find(o => o.kind === 'bug') || S.sprites[0], tec = TECLAS[op.teclas || (S.L.pad === 'wasd' ? 'wasd' : 'arrows')];
    let quiero = [];
    const obj = destino(d, b);
    if (op.espacio) quiero.push('space');
    if (obj){
      const caza = typeof d === 'string' && d !== 'estrellas' && d !== 'meta';
      const enemigos = op.esquivar ? S.sprites.filter(o => o.kind === 'wasp' && !o.hidden && o !== b && o.name !== d) : [];
      const dx = obj.x - b.x, dist = Math.hypot(obj.x - b.x, obj.y - b.y);
      const cerca = op.golpe ? dist < 42 : dist < 5;
      if (obj.apuntar){ if (dx > 4) quiero.push(tec.r); else if (dx < -4) quiero.push(tec.l); }
      else if (!cerca){
        const m = mejorMovida(b, obj, enemigos, op);
        if (m.sx > 0) quiero.push(tec.r); else if (m.sx < 0) quiero.push(tec.l);
        if (m.sy > 0) quiero.push(tec.u); else if (m.sy < 0) quiero.push(tec.d);
      }
      if (op.golpe && dist < 48 && n % 12 === 0) quiero.push('space');
      if (obj.apuntar && Math.abs(dx) < 12 && n % 8 === 0) quiero.push('space');
      if (caza && op.golpe && dist < 30) quiero = quiero.filter(k => k === 'space');
    }
    if (d && d.debajo && (S.VARS.semillas ?? 1) < 2){ // sin semillas: ir a buscar la bolsa
      const bolsa = S.sprites.find(o => o.name === 'Bolsa');
      if (bolsa){ quiero = quiero.filter(k => k === 'space'); const dx = bolsa.x - b.x; if (dx > 4) quiero.push(tec.r); else if (dx < -4) quiero.push(tec.l); }
    }
    for (const k of [...S.engine.held]) if (!quiero.includes(k)) keyUp(k);
    for (const k of quiero) if (!S.engine.held.has(k)) keyDown(k);
    n++;
    tick();
    if (quiero.includes('space') && !op.espacio) keyUp('space');
  };
  return { tick, piloto };
}

/* Juega un nivel con una solución { programa, sprites, acciones } y devuelve si ganó y qué dijo el juego. */
export function jugar(parte, i, sol, { max = 2400 } = {}){
  fijarAzar();
  const dichos = [];
  avisos.decir = t => dichos.push(t);
  S.P = parte; S.li = i;
  delete programs[parte.levels[i].id];
  delete createdVars[parte.levels[i].id];
  loadLevel(parte.levels[i]);
  if (sol.programa){ const nuevo = sol.programa(); S.prog.length = 0; S.prog.push(...nuevo); }
  for (const [nom, crear] of Object.entries(sol.sprites || {})){
    const sp = S.sprites.find(o => o.name === nom);
    if (!sp) throw new Error('No existe el personaje ' + nom);
    const nuevo = crear(); sp.program.length = 0; sp.program.push(...nuevo);
  }
  const { tick, piloto } = crearPiloto();
  let ticks = 0, reintentos = 0;
  for (const [acc, a, b, c] of sol.acciones){
    if (S.won) break;
    if (acc === 'bandera') flagPressed();
    else if (acc === 'esperar') for (let k = 0; k < a && !S.won; k++, ticks++) tick();
    else if (acc === 'tener'){ keyDown(a); for (let k = 0; k < b && !S.won; k++, ticks++) tick(); keyUp(a); }
    else if (acc === 'tocar') for (let v = 0; v < b; v++){ keyDown(a); tick(); keyUp(a); for (let k = 0; k < c; k++, ticks++) tick(); }
    else if (acc === 'hacer') a(S, createdVars);
    else if (acc === 'quiz') S.L.quiz.forEach((Q, qi) => responder(qi, Q.opts.findIndex(o => o[1])));
    else if (acc === 'explorar') for (const s of S.L.stars) adivinar(s.x, s.y);
    else if (acc === 'ir'){
      const op = b || {};
      for (let k = 0; k < max && !S.won; k++, ticks++){
        if (op.parar && op.parar(S)) break;
        if (!S.engine.alive() && S.engine.stopped && reintentos < 6){ for (const t of [...S.engine.held]) keyUp(t); flagPressed(); reintentos++; }
        piloto(a, op);
      }
    }
  }
  for (let k = 0; k < 90 && !S.won; k++, ticks++) tick(); // un margen al final
  for (const t of [...S.engine.held]) keyUp(t);
  return { gana: S.won, ticks, reintentos, dichos, ultimo: dichos[dichos.length - 1] || '', R: S.R };
}
