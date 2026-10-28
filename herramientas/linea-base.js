/* Línea de base: juega cada nivel del ORIGINAL con su solución esperada y anota cuáles se ganan.
   Corre en un navegador real (Playwright) y avanza el motor tick por tick, sin esperar el tiempo real.
   Uso: node herramientas/linea-base.js [id-de-nivel ...] */
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { SOLUCIONES as BASE, ALTERNATIVAS } from './soluciones-original.js';

const url = pathToFileURL(resolve('original/a-moverse.html')).href;
const ALT = process.argv.includes('--alt');
const SOLUCIONES = ALT ? ALTERNATIVAS : BASE;
const soloEstos = process.argv.slice(2).filter(a => a !== '--alt');
const AZAR = 'let s=12345;Math.random=()=>(s=(s*16807)%2147483647,(s-1)/2147483646);';

/* Se inyecta en la página: piloto automático y acciones. Usa los globales del original. */
const PILOTO = () => {
  const T = window.__T = {};
  const TECLAS = { arrows: { r: 'right', l: 'left', u: 'up', d: 'down' }, wasd: { r: 'd', l: 'a', u: 'w', d: 's' } };
  const bicho = () => sprites.find(o => o.kind === 'bug') || sprites[0];
  const vel = {};
  T.tick = () => { engine.step(); afterStep(); for (const s of sprites) { vel[s.name] = { x: s.x - (s.__px ?? s.x), y: s.y - (s.__py ?? s.y) }; s.__px = s.x; s.__py = s.y; } };
  T.soltar = () => { for (const k of [...engine.held]) keyUp(k); };
  T.apretar = k => { if (!engine.held.has(k)) keyDown(k); };
  // lo que nunca se puede pisar: lava, paredes, piedras
  const bloqueada = (x, y) => touchAt(x, y, BODY_R + 1, 'wall') || touchAt(x, y, BODY_R + 1, 'lava') ||
    !!(L.rocks && L.rocks.some(r => Math.hypot(r.x - x, r.y - y) < 28));
  // campo de distancias (BFS desde el destino, grilla de 5 px); se guarda mientras no cambien destino ni mapa
  const G = 5, NX = 91, NY = 67, celda = (x, y) => [Math.round((x + 225) / G), Math.round((y + 165) / G)];
  let campo = null, campoClave = '';
  const distancias = a => {
    const clave = Math.round(a.x / G) + ',' + Math.round(a.y / G) + ',' + (L.map ? L.map.length + ':' + BACKDROP : '') + L.id;
    if (clave === campoClave) return campo;
    const libre = new Uint8Array(NX * NY), d = new Float32Array(NX * NY).fill(Infinity);
    for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) libre[i * NY + j] = bloqueada(i * G - 225, j * G - 165) ? 0 : 1;
    const [fi, fj] = celda(a.x, a.y), cola = [];
    for (let i = fi - 2; i <= fi + 2; i++) for (let j = fj - 2; j <= fj + 2; j++) if (i >= 0 && j >= 0 && i < NX && j < NY) { d[i * NY + j] = 0; cola.push(i * NY + j); }
    for (let q = 0; q < cola.length; q++) {
      const c = cola[q], i = Math.floor(c / NY), j = c % NY;
      for (const [di, dj, w] of [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.4], [1, -1, 1.4], [-1, 1, 1.4], [-1, -1, 1.4]]) {
        const ni = i + di, nj = j + dj, n = ni * NY + nj;
        if (ni < 0 || nj < 0 || ni >= NX || nj >= NY || !libre[n] || d[n] <= d[c] + w) continue;
        d[n] = d[c] + w; cola.push(n);
      }
    }
    campo = d; campoClave = clave; return d;
  };
  const distEn = (d, x, y) => { const [i, j] = celda(Math.max(-224, Math.min(224, x)), Math.max(-164, Math.min(164, y))); return d[i * NY + j]; };
  // prueba las 9 combinaciones de teclas y elige la que más acerca sin pisar nada ni quedar cerca de un enemigo
  const mejorMovida = (b, obj, enemigos, op) => {
    const d = distancias(obj), paso = 10;
    const opciones = [];
    for (const sx of [0, 1, -1]) for (const sy of [0, 1, -1]) {
      if (op.ejes === 1 && sx && sy) continue;
      const x = b.x + sx * paso, y = b.y + sy * paso;
      if ((sx || sy) && bloqueada(x, y)) continue;
      let costo = distEn(d, x, y);
      for (const e of enemigos) {
        const v = vel[e.name] || { x: 0, y: 0 };
        for (const t of [0, 3, 6]) { const r = Math.hypot(e.x + v.x * t - x, e.y + v.y * t - y); if (r < 60) costo += (60 - r) * 4; }
      }
      opciones.push({ sx, sy, costo });
    }
    opciones.sort((p, q) => p.costo - q.costo);
    return opciones[0];
  };
  const destino = (d, b) => {
    if (d === 'estrellas') {
      const quedan = stars.filter(s => !s.got && !s.opt);
      if (!quedan.length) return null;
      return quedan.reduce((m, s) => Math.hypot(s.x - b.x, s.y - b.y) < Math.hypot(m.x - b.x, m.y - b.y) ? s : m);
    }
    if (d === 'meta') {
      const g = (L.map || []).find(m => m.c === 'goal');
      return g && { x: (Math.max(g.x0, -224) + Math.min(g.x1, 224)) / 2, y: (Math.max(g.y0, -164) + Math.min(g.y1, 164)) / 2 };
    }
    if (typeof d === 'string') { const s = sprites.find(o => o.name === d && !o.hidden); return s && { x: s.x, y: s.y }; }
    if (d.debajo) {
      const vs = sprites.filter(o => o.name === d.debajo && !o.hidden && o.y > b.y + 20);
      if (!vs.length) return null;
      const s = vs.reduce((m, o) => o.y < m.y ? o : m);
      const v = vel[s.name] || { x: 0 }, t = Math.max(0, (s.y - b.y) / 15);
      return { x: s.x + v.x * t, y: b.y, apuntar: true };
    }
  };
  // un tick del piloto: elige teclas y avanza el motor
  T.piloto = (d, op) => {
    const b = bicho(), tec = TECLAS[op.teclas || (L.pad === 'wasd' ? 'wasd' : 'arrows')];
    let quiero = [];
    const obj = destino(d, b);
    if (op.espacio) quiero.push('space');
    if (obj) {
      const caza = typeof d === 'string' && d !== 'estrellas' && d !== 'meta';
      const enemigos = op.esquivar ? sprites.filter(o => o.kind === 'wasp' && !o.hidden && o !== b && o.name !== d) : [];
      {
        const dx = obj.x - b.x, dist = Math.hypot(obj.x - b.x, obj.y - b.y);
        const cerca = op.golpe ? dist < 42 : dist < 5;
        if (obj.apuntar) { if (dx > 4) quiero.push(tec.r); else if (dx < -4) quiero.push(tec.l); }
        else if (!cerca) {
          const m = mejorMovida(b, obj, enemigos, op);
          if (m.sx > 0) quiero.push(tec.r); else if (m.sx < 0) quiero.push(tec.l);
          if (m.sy > 0) quiero.push(tec.u); else if (m.sy < 0) quiero.push(tec.d);
        }
        if (op.golpe && dist < 48 && T.n % 12 === 0) quiero.push('space');
        if (obj.apuntar && Math.abs(dx) < 12 && T.n % 8 === 0) quiero.push('space');
        if (caza && op.golpe && dist < 30) quiero = quiero.filter(k => k === 'space');
      }
    }
    if (d && d.debajo && (VARS.semillas ?? 1) < 2) { // ir a buscar la bolsa
      const bolsa = sprites.find(o => o.name === 'Bolsa');
      if (bolsa) { quiero = quiero.filter(k => k === 'space'); const dx = bolsa.x - b.x; if (dx > 4) quiero.push(tec.r); else if (dx < -4) quiero.push(tec.l); }
    }
    for (const k of [...engine.held]) if (!quiero.includes(k)) keyUp(k);
    for (const k of quiero) if (!engine.held.has(k)) keyDown(k);
    T.n = (T.n || 0) + 1;
    T.tick();
    if (quiero.includes('space') && !op.espacio) keyUp('space');
  };
  T.quiz = () => {
    const qs = [...document.querySelectorAll('#program .cierre .q')];
    L.quiz.forEach((Q, qi) => { const i = Q.opts.findIndex(o => o[1]); qs[qi].querySelectorAll('button')[i].click(); });
  };
  T.explorar = () => {
    for (const s of L.stars) {
      document.querySelector('#gx').value = s.x; document.querySelector('#gy').value = s.y;
      [...document.querySelectorAll('#program .explore button.primary')].pop().click();
    }
  };
};

const navegador = await chromium.launch();
const ctx = await navegador.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
await ctx.addInitScript(AZAR);
const pag = await ctx.newPage();
const errores = [];
pag.on('pageerror', e => errores.push(e.message));
await pag.goto(url);
await pag.evaluate(PILOTO);
if (process.env.TRAZA) await pag.evaluate(() => { window.__TRAZA = true; });

const niveles = await pag.evaluate(() => PARTS.flatMap(p => p.levels.map((l, i) => ({ parte: p.n, i, id: l.id, nombre: l.name, modo: l.mode || '' }))));
const resultados = [];

for (const nv of niveles) {
  if (soloEstos.length && !soloEstos.includes(String(nv.id))) continue;
  const sol = SOLUCIONES[nv.id];
  const fila = { ...nv, gana: false, ticks: 0, reintentos: 0, nota: '' };
  if (!sol && ALT) continue;
  if (!sol) { fila.nota = nv.modo === 'sandbox' ? 'modo libre: no tiene victoria' : 'sin solución escrita'; resultados.push(fila); continue; }
  const antes = errores.length;
  const r = await pag.evaluate(async ({ parte, i, sol }) => {
    const T = window.__T;
    clearTimeout(winTimer); T.n = 0; window.__traza = window.__TRAZA ? [] : null;
    P = PARTS[parte - 1]; li = i;
    document.querySelector('#startScreen').hidden = false; // el bucle de la página no avanza el motor: lo avanzamos nosotros
    document.querySelector('#winModal').hidden = true;
    delete programs[P.levels[i].id];
    loadLevel(P.levels[i]);
    if (L.mode === 'cierre' || L.mode === 'explore') renderProgram();
    if (sol.programa) { const nuevo = eval(sol.programa); prog.length = 0; prog.push(...nuevo); }
    if (sol.sprites) for (const [nom, cod] of Object.entries(sol.sprites)) {
      const sp = sprites.find(o => o.name === nom); if (!sp) return { error: 'no existe el personaje ' + nom };
      const nuevo = eval(cod); sp.program.length = 0; sp.program.push(...nuevo);
    }
    let ticks = 0, reintentos = 0, ultimoMsg = '';
    const sayOrig = window.say; window.say = (m, ...r) => { ultimoMsg = m; return sayOrig(m, ...r); };
    const MAX = 2400;
    try {
      for (const [acc, a, b, c] of sol.acciones) {
        if (won) break;
        if (acc === 'bandera') flagPressed();
        else if (acc === 'esperar') for (let k = 0; k < a && !won; k++, ticks++) T.tick();
        else if (acc === 'tener') { T.apretar(a); for (let k = 0; k < b && !won; k++, ticks++) T.tick(); keyUp(a); }
        else if (acc === 'tocar') for (let v = 0; v < b; v++) { keyDown(a); T.tick(); keyUp(a); for (let k = 0; k < c; k++, ticks++) T.tick(); }
        else if (acc === 'js') eval(a);
        else if (acc === 'quiz') T.quiz();
        else if (acc === 'explorar') T.explorar();
        else if (acc === 'ir') {
          const op = b || {};
          for (let k = 0; k < MAX && !won; k++, ticks++) {
            if (op.parar && eval(op.parar)) break;
            if (!engine.alive() && engine.stopped && reintentos < 6) { T.soltar(); flagPressed(); reintentos++; }
            T.piloto(a, op);
            if (window.__traza && k % 40 === 0) { const b = sprites[0]; window.__traza.push(Math.round(b.x) + ',' + Math.round(b.y) + (engine.alive() ? '' : '!') + [...engine.held].join('')); }
          }
        }
      }
      for (let k = 0; k < 90 && !won; k++, ticks++) T.tick(); // margen final
    } finally { T.soltar(); window.say = sayOrig; }
    return { traza: (window.__traza || []).join(' '), gana: won, ticks, reintentos, msg: ultimoMsg, R: JSON.stringify(R).slice(0, 300) };
  }, { parte: nv.parte, i: nv.i, sol });
  Object.assign(fila, r);
  if (errores.length > antes) fila.nota += ' errores: ' + errores.slice(antes).join(' | ');
  resultados.push(fila);
  if (r.traza) console.log(r.traza);
  console.log(`${r.gana ? 'GANA ' : 'NO   '} P${nv.parte} ${String(nv.id).padEnd(14)} ${String(r.ticks).padStart(5)}t ${r.reintentos ? r.reintentos + 'r ' : ''}${r.gana ? '' : '· ' + (r.error || r.msg || '') + ' ' + (r.gana ? '' : r.R || '')}${fila.nota}`);
}
await navegador.close();
if (!soloEstos.length) writeFileSync(ALT ? 'pruebas/base/alternativas.json' : 'pruebas/base/niveles.json', JSON.stringify(resultados, null, 2));
const g = resultados.filter(r => r.gana).length;
console.log(`\n${g} de ${resultados.length} niveles ganados.`);
