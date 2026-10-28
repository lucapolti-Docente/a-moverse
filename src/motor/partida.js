import { S, createdVars, programs } from '../estado.js';
import { AL_CARGAR, MSJ } from '../datos/textos.js';
import { leerCreacion, saveDone } from '../guardado.js';
import { nid } from './bloques.js';
import { avisos } from './avisos.js';
import { ARROWS, WASD } from './bloques.js';
import { createEngine } from './motor.js';
import { cosNames } from './nombres.js';
import { allBlocks, has, ifOutsideForever, walk } from './recorrer.js';
import { hasEqRule, hasRule, nested, reglaSinDetener, progOf, scan, starsDone, wallRule } from './reglas.js';

const say = (t, bien) => avisos.decir(t, bien);
const SND = new Proxy({}, { get: (_, nombre) => () => avisos.sonar(nombre) });
const burst = (x, y, color) => avisos.chispas(x, y, color);

export function newRun(){ S.R = {saidOnGoal:false, stopOnGoal:false, inside:false, lavaIgnored:false, wallTicks:0, lavaTicks:0, goalTicks:0, lastCheckMsg:''}; }

export function makeSprite(x, y, color, program, bounds, label, extra){ return Object.assign({x, y, sx:x, sy:y, color, program, bounds, label, kind:'bug', face:1, lastOrigin:null, moved:0, bubble:'', dir:90, sdir:90}, extra || {}); }

export function loadLevel(level){
  S.L = level; S.won = false;
  if (S.L.backdrops){ S.BACKDROP = S.L.startBackdrop || S.L.bdOrder[0]; S.L.map = S.L.backdrops[S.BACKDROP].map; } else S.BACKDROP = null; S.VARS = Object.assign({}, S.L.vars || {}); (createdVars[S.L.id] || []).forEach(v => S.VARS[v] = 0); S.particles = []; S.exploreIdx = 0; S.dragging = false; S.insideCount = 0; newRun();
  S.curSp = 0;
  if (S.L.sprites){
    if (S.L.mode === 'sandbox' && !programs[S.L.id]) recuperarCreacion();
    if (!programs[S.L.id] || S.L.mode === 'cierre') programs[S.L.id] = S.L.sprites.map(d => d.program());
    S.sprites = S.L.sprites.map((d, i) => makeSprite(d.x, d.y, d.color || '#E8553F', programs[S.L.id][i], d.bounds || null, d.name,
      {name:d.name, kind:d.kind || 'bug', dir:d.dir || 90, sdir:d.dir || 90, hidden:!!d.hidden, shidden:!!d.hidden, costume:d.costume, scostume:d.costume}));
    S.curSp = S.L.mode === 'cierre' ? 0 : (S.L.selSprite || 0);
    S.prog = S.sprites[S.curSp].program; S.sel = null;
  } else {
    if (!programs[S.L.id]) programs[S.L.id] = S.L.program ? S.L.program() : [];
    S.prog = programs[S.L.id]; S.sel = null;
  }
  S.engine = createEngine(hooks);
  if (S.L.sprites){ if (S.L.mode === 'cierre') S.quiz = S.L.quiz.map(() => false); }
  else if (S.L.mode === 'cierre'){
    S.quiz = S.L.quiz.map(() => false);
    S.sprites = S.L.demo().map(d => makeSprite(d.x, d.y, d.color, d.program, d.bounds, d.label));
  } else S.sprites = [makeSprite(S.L.start.x, S.L.start.y, '#E8553F', S.prog)];
  S.engine.sprites = S.sprites;
  S.stars = S.L.stars.map(s => ({...s, got:false}));
  if (S.L.mode === 'free'){ S.freeCount = 0; spawnFree(); }
  avisos.nivelCargado();
}

/* Qué decir al cargar un nivel (la interfaz lo muestra). */
export function mensajeAlCargar(){
  if (S.L.mode === 'explore') return AL_CARGAR.explore;
  if (S.L.mode === 'sandbox') return AL_CARGAR.sandbox;
  if (S.L.mode === 'free') return S.P.rasgos.animaciones ? AL_CARGAR.libreAnimar : AL_CARGAR.libre;
  if (S.P.rasgos.alCargar === 'movimientoArmado' && S.L.mode !== 'cierre') return AL_CARGAR.movimientoArmado;
  if (S.P.rasgos.alCargar === 'pestanas' && S.L.mode !== 'cierre' && S.sprites.length > 1) return AL_CARGAR.pestanas;
  return '';
}

/* Trae el proyecto guardado de "Creá tu juego", si coincide con los personajes del nivel. */
function recuperarCreacion(){
  const c = leerCreacion();
  if (!c || !Array.isArray(c.programas) || c.programas.length !== S.L.sprites.length) return;
  const reId = o => { if (Array.isArray(o)) o.forEach(reId); else if (o && typeof o === 'object'){ if (typeof o.id === 'string') o.id = nid(); Object.values(o).forEach(reId); } };
  reId(c.programas);
  programs[S.L.id] = c.programas;
  createdVars[S.L.id] = c.variables || [];
  S.terminado = c.terminado || [];
}

export function resetLevel(){
  S.engine.stop(); S.engine.releaseAll(); avisos.teclas(); newRun();
  S.sprites.forEach(s => { s.hidden = !!s.shidden; s.costume = s.scostume; });
  S.sprites.forEach(s => { s.x = s.sx; s.y = s.sy; s.lastOrigin = null; s.bubble = ''; s.dir = s.sdir; s.bounced = false; });
  if (S.L.mode !== 'free' && S.L.mode !== 'explore') S.stars.forEach(s => s.got = false);
  S.won = false; avisos.reiniciado();
}

export function freeSpot(x, y){ return !touchAt(x, y, 30); }

export function spawnFree(){
  S.stars = [];
  const sp = S.sprites[0]; let tries = 0;
  while (S.stars.length < 5 && tries++ < 500){
    const s = {x:Math.round((Math.random()*400 - 200)/10)*10, y:Math.round((Math.random()*290 - 145)/10)*10, got:false};
    if (Math.hypot(s.x - sp.x, s.y - sp.y) > 70 && freeSpot(s.x, s.y) && S.stars.every(o => Math.hypot(o.x - s.x, o.y - s.y) > 60)) S.stars.push(s);
  }
}

export function checkWin(){
  if (S.won) return;
  let ok = false;
  if (S.L.mode === 'cierre') ok = S.quiz.every(Boolean);
  else if (S.L.mode === 'free' || S.L.mode === 'sandbox') ok = false;
  else if (S.L.check){
    const r = S.L.check(S.R);
    if (typeof r === 'string'){ if (S.R.lastCheckMsg !== r){ S.R.lastCheckMsg = r; say(r); SND.oops(); } return; }
    ok = r === true;
  }
  else ok = starsDone();
  if (!ok) return;
  S.won = true; S.done.add(S.L.id); saveDone();
  avisos.gano();
}

export const BODY_R = 15;

export function touchAt(x, y, r, c){
  if (!S.L.map) return false;
  for (const m of S.L.map){
    if (c && m.c !== c) continue;
    const dx = x - Math.max(m.x0, Math.min(x, m.x1)), dy = y - Math.max(m.y0, Math.min(y, m.y1));
    if (dx*dx + dy*dy < r*r) return true;
  }
  return false;
}

export const hooks = {
  move(t, dx, dy, b){
    if (t.origin === 'flag' && (dx || dy)){ if (ARROWS.some(k => S.engine.held.has(k))) S.R.movedArrow = true; if (WASD.some(k => S.engine.held.has(k))) S.R.movedWasd = true; }
    const s = t.sprite; if (dx) s.face = Math.sign(dx); s.moved = performance.now(); if (dx || dy) SND.tick();
    if (b.type === 'move' && t.origin === 'key'){
      if (t.key === 'left' && dx > 0) say(MSJ.moverIzquierda);
      if (t.key === 'up' || t.key === 'down') say(MSJ.moverArribaAbajo);
    }
  },
  touching(s, color){ return touchAt(s.x, s.y, BODY_R, color); },
  findSprite(name){ return S.sprites.find(o => o.name === name && !o.isClone); },
  getVar(v){ return S.VARS[v] ?? 0; },
  switchBackdrop(name, t){
    if (!S.L.backdrops) return null;
    const order = S.L.bdOrder, from = S.BACKDROP;
    let to = name === 'siguiente fondo' ? order[(order.indexOf(from) + 1) % order.length] : name;
    if (!S.L.backdrops[to]) return null;
    if (from === 'noche' && name === 'siguiente fondo') S.R.finishedNoche = true;
    if (t && t.origin === 'msg' && name !== 'siguiente fondo' && S.L.msgs && !S.R.fijoHint){ S.R.fijoHint = true; say(MSJ.fondoFijo(name)); }
    if (from === 'arena' && to === 'arena') S.R.arenaGoal = true;
    S.BACKDROP = to; S.L.map = S.L.backdrops[to].map;
    if (from !== to){ avisos.tono(523, .1, 'triangle', .08); avisos.tono(784, .14, 'triangle', .08, .09); }
    return to;
  },
  costumeList(s){ return cosNames(); },
  costume(t, name){
    const s = t.sprite; if (s.kind !== 'bug') return;
    S.R.cosChanges = (S.R.cosChanges || 0) + 1;
    if (S.engine.held.size){
      S.R.walkSwaps = (S.R.walkSwaps || 0) + 1; if (name === 'feliz' || name === 'dolor') S.R.oddWhileWalk = (S.R.oddWhileWalk || 0) + 1;
      S.R.pasosVistos = [...new Set([...(S.R.pasosVistos || []), name])];
      // cuánto pasó desde el cambio anterior: si es casi nada, ese disfraz no llega a verse
      const dt = S.R.ultimoCambio == null ? null : S.engine.time - S.R.ultimoCambio;
      if (dt != null && dt < 50) S.R.cambiosRapidos = (S.R.cambiosRapidos || 0) + 1;
      if (dt != null && dt > 600 && dt < 2000) S.R.cambiosLentos = (S.R.cambiosLentos || 0) + 1;
    }
    S.R.ultimoCambio = S.engine.time;
    if (name === 'feliz' && t.origin === 'key' && t.key === 'up') S.R.felizConFlecha = true;
    // volver a la cara de siempre desde la regla de la avispa (no desde el programa de caminar)
    if (S.R.hurtShown && (name === 'paso 1' || name === 'paso 2') && scan([t.script], b => b.type === 'if' && b.cond && b.cond.type === 'toucho' && b.cond.target === 'Avispa')) S.R.recuperoEnRegla = true;
    if (name === 'dolor'){ S.R.hurtShown = true; if (S.R.tDolor == null) S.R.tDolor = S.engine.time; }
    if (S.R.hurtShown && name !== 'dolor' && name !== 'feliz') S.R.recovered = true;
    if (name === 'feliz') S.R.happyShown = true;
    S.R.cosLog = (S.R.cosLog || []).concat(S.engine.time).slice(-40);
  },
  hidden(t){ const s = t.sprite; if (s.kind === 'seed' && s.y >= 150) S.R.semillaArriba = true; if (s.kind === 'bug') S.R.bugBlinks = (S.R.bugBlinks || 0) + 1; if (s.kind === 'wasp'){ S.R.waspHid = true; burst(s.x, s.y, '#7A4DD8'); SND.star(); if (S.engine.held.has('space')) S.R.hidWithSpace = true; else S.R.hidSinEspacio = true; } },
  shown(t){
    const s = t.sprite; if (s.kind === 'wasp') S.R.waspShown = true;
    if (s.kind === 'bubble'){ avisos.tono(660, .12, 'sine', .06, 0, 990); S.R.swings = (S.R.swings || 0) + 1; }
    if (s.kind === 'seed'){
      S.R.shots = (S.R.shots || 0) + 1; avisos.tono(700, .08, 'triangle', .07);
      const bug = S.sprites.find(o => o.kind === 'bug');
      if (bug && Math.hypot(bug.x - s.x, bug.y - s.y) < 6) S.R.shotsFromBug = (S.R.shotsFromBug || 0) + 1;
      else if (S.L.id === 'p5-dedonde'){ burst(s.x, s.y, '#8B5A2B'); if (!S.R.topHint){ S.R.topHint = true; say(MSJ.semillaArriba); } }
    }
  },
  cloned(c){
    if (c.kind === 'seed'){
      avisos.tono(760, .06, 'triangle', .06);
      // si tiró sin semillas, la variable queda en negativo: eso lo mira afterStep (no importa el orden de los bloques)
      if (S.L.id === 'p5-balas') S.R.legitShots = (S.R.legitShots || 0) + 1;
    }
    if (c.kind === 'cloud') S.R.nubes = (S.R.nubes || 0) + 1;
  },
  deleted(t){
    const s = t.sprite;
    if (s.kind === 'cloud' && S.sprites.some(o => o.kind === 'seed' && !o.hidden && Math.hypot(o.x - s.x, o.y - s.y) < 26)){ burst(s.x, s.y, '#F472B6'); avisos.tono(880, .12, 'triangle', .06); }
  },
  setVar(v, n, t){
    const before = S.VARS[v] ?? 0; S.VARS[v] = Math.round(n * 100) / 100;
    if (v === 'puntos' && S.VARS[v] === 0 && t) S.R.startedZero = true;
    if (S.VARS[v] > before) SND.star(); else if (S.VARS[v] < before) SND.bump();
    if (v === 'vidas' && S.VARS[v] < before) S.R.tocado = true;
    avisos.variable(v);
  },
  randomPos(s){
    const bug = S.sprites.find(o => o.kind === 'bug');
    for (let i = 0; i < 40; i++){
      const x = Math.round(Math.random()*380 - 190), y = Math.round(Math.random()*260 - 140);
      if (bug && Math.hypot(x - bug.x, y - bug.y) < 110) continue;
      if (touchAt(x, y, 24)) continue;
      return {x, y};
    }
    return {x:0, y:0};
  },
  jumped(t){
    const s = t.sprite; burst(s.x, s.y, s.kind === 'heart' ? '#E11D48' : '#FFC93C');
    if (s.kind === 'coin') S.R.coinJumps = (S.R.coinJumps || 0) + 1;
    if (S.L.id === 'p4-pts' && !scan(s.program, b => b.type === 'changevar')) say(MSJ.monedaSinPuntos);
  },
  touchingObj(s, target){
    if (target === 'borde'){ const B = s.bounds || {x0:-224,x1:224,y0:-164,y1:164}; return s.x >= B.x1 || s.x <= B.x0 || s.y >= B.y1 || s.y <= B.y0; }
    if (s.hidden) return false;
    const rad = o => (o.kind === 'bubble' || s.kind === 'bubble') ? 50 : (o.kind === 'seed' || s.kind === 'seed') ? 22 : (o.kind === 'cloud' || s.kind === 'cloud') ? 26 : 28;
    return S.sprites.some(o => o.name === target && o !== s && !o.hidden && Math.hypot(o.x - s.x, o.y - s.y) < rad(o));
  },
  bounce(t){
    const s = t.sprite; s.bounced = true;
    const ad = Math.abs(s.dir);
    if ((s.y >= 164 || s.y <= -164) && s.name === 'Avispa 2' && (ad < 1 || ad > 179)) S.R.vBounce = (S.R.vBounce || 0) + 1;
    if ((s.x >= 224 || s.x <= -224) && s.name === 'Avispa' && Math.abs(ad - 90) < 1) S.R.hBounce = (S.R.hBounce || 0) + 1;
    if (((s.y >= 164 || s.y <= -164) && s.name === 'Avispa' && (ad < 1 || ad > 179)) || ((s.x >= 224 || s.x <= -224) && s.name === 'Avispa 2' && Math.abs(ad - 90) < 1)) S.R.alReves = (S.R.alReves || 0) + 1;
    if (Math.abs(ad - 45) < 1 || Math.abs(ad - 135) < 1) S.R.diagonal = (S.R.diagonal || 0) + 1;
    if (S.L.id === 'p3-2' && !scan(s.program, b => b.type === 'move')) say(MSJ.rebotoSumarX);
  },
  goto(t){ if (S.L.avisoVolviste && t.sprite.kind === 'bug' && t.origin === 'flag' && S.sprites.some(o => o.kind === 'wasp' && !o.hidden && Math.hypot(o.x - t.sprite.x, o.y - t.sprite.y) < 28)) say(S.L.avisoVolviste); if (touchAt(t.sprite.x, t.sprite.y, BODY_R, 'lava')){ S.R.lavaFunciona = true; SND.lava(); burst(t.sprite.x, t.sprite.y, '#E5322D'); } },
  say(t){ if (S.L.id === 'p5-mayor'){ if ((S.VARS.semillas ?? 0) > 3) S.R.saidGt = true; if ((S.VARS.semillas ?? 0) < 3) S.R.saidLt = true; } if (touchAt(t.sprite.x, t.sprite.y, BODY_R, 'goal')) S.R.saidOnGoal = true; if (S.L.id === 'p4-igual' && S.VARS.puntos === 5) S.R.said5 = true; },
  stop(t){
    if (S.P.rasgos.finPorNivel){ S.R.stopNivel = S.VARS.nivel ?? null; if (S.R.stopNivel == null) S.R.stopNivel = 0; }
    if (touchAt(t.sprite.x, t.sprite.y, BODY_R, 'goal')){ S.R.stopOnGoal = true; S.R.goalBd = S.BACKDROP; if (S.R.tStart != null) S.R.tEnd = S.engine.time - S.R.tStart; }
    else if (S.L.id === 'p4-regresiva' && (S.VARS.tiempo ?? 1) <= 0 && (S.VARS.puntos ?? 0) < 8){ S.R.timeUp = true; S.R.stopPts = S.VARS.puntos; SND.oops(); say(MSJ.seAcaboTiempo); }
    else if (S.L.id === 'p4-reloj' || S.L.id === 'p4-regresiva' || S.P.rasgos.puntosAlDetener){ S.R.stopPts = S.VARS.puntos ?? 0; }
    else if (S.P.rasgos.finPorVariables && S.L.vars && (S.VARS.vidas ?? 1) <= 0){ S.R.gameOver = true; SND.oops(); if (S.L.id !== 'p4-over') say(MSJ.sinVidas); }
    else if (S.P.rasgos.finPorVariables && S.L.vars && (S.VARS.puntos ?? 0) >= 10){ S.R.wonByPoints = true; }
    else if (S.L.loseMsg){ SND.bump(); say(S.L.loseMsg()); }
    else if (S.P.rasgos.avisoAtrapo && S.L.mode !== 'cierre'){ SND.bump(); say(MSJ.atrapo); }
    else if (S.L.mode !== 'cierre' && S.L.mode !== 'sandbox' && S.P.rasgos.avisarDetuvoAntes) say(MSJ.detuvoAntes);
  },
  emptyCond(){ say(MSJ.siSinPregunta); },
};

export function wallMsg(s){
  if (S.L.noWallMsg && !nested(['right','d'], 'wall', x => x.type === 'cx' && Number(x.n) < 0)) return S.L.noWallMsg;
  if (!wallRule()) return MSJ.paredSinRegla;
  if (S.insideCount < 2) return MSJ.paredSeMetio(S.engine.last || [...S.engine.held][0] || s.lastDir);
  return MSJ.paredOtraVez;
}

export function afterStep(){
  if (S.P.rasgos.animaciones && S.engine.alive()){
    const b = S.sprites[0];
    if (S.engine.held.size) S.R.heldTicks = (S.R.heldTicks || 0) + 1;
    S.R.hurtTicks = b.costume === 'dolor' ? (S.R.hurtTicks || 0) + 1 : 0;
    if (S.R.hurtTicks > 75) S.R.hurtLong = true;
    if (S.R.tDolor != null && !S.R.recuperoEnRegla && S.engine.time - S.R.tDolor > 2500) S.R.hurtLong = true;
  }
  if (S.L.map && S.L.mode !== 'cierre' && S.L.mode !== 'sandbox' && S.engine.alive()){
    const s = S.sprites[0];
    const inWall = touchAt(s.x, s.y, BODY_R, 'wall');
    S.R.wallTicks = inWall ? S.R.wallTicks + 1 : 0;
    if (S.R.wallTicks === 2){ S.R.inside = true; S.insideCount++; if (!S.P.rasgos.mapaCallado){ SND.bump(); say(wallMsg(s)); } }
    if (inWall && S.R.wallTicks === 1) SND.thud();
    const inLava = touchAt(s.x, s.y, BODY_R, 'lava');
    S.R.lavaTicks = inLava ? S.R.lavaTicks + 1 : 0;
    if (S.R.lavaTicks === 2){ S.R.lavaIgnored = true; if (!S.P.rasgos.mapaCallado || S.L.id === 'p6-juego'){ SND.oops(); say(S.L.id === 'p6-juego' ? MSJ.lavaConVidas : MSJ.lava); } }
    if (S.L.timeLimit){
      if (S.R.tStart == null && (s.x !== s.sx || s.y !== s.sy)) S.R.tStart = S.engine.time;
      if (S.R.tStart != null && !S.R.stopOnGoal && S.engine.time - S.R.tStart > S.L.timeLimit){
        s.x = s.sx; s.y = s.sy; S.R.tStart = null; SND.oops();
        say(nested(['right','d'], 'ice', x => x.type === 'cx' && Number(x.n) > 0) || hasRule('ice', x => x.type === 'cx' && Number(x.n) > 0) ? MSJ.hieloOtraVez : MSJ.hieloFalta);
      }
    }
    if (S.L.mudSlideHint){
      const moved = S.R.px != null && (s.x !== S.R.px || s.y !== S.R.py);
      if (moved && S.engine.held.size === 0 && touchAt(s.x, s.y, BODY_R, 'mud')) say(MSJ.barroResbala);
      S.R.px = s.x; S.R.py = s.y;
    }
    const onGoal = touchAt(s.x, s.y, BODY_R, 'goal');
    S.R.goalTicks = onGoal ? S.R.goalTicks + 1 : 0;
    if (S.L.goalSayHint && S.R.goalTicks === 20 && !S.R.saidOnGoal) say(MSJ.metaSinDecir);
    if (S.L.avisoMeta && S.R.goalTicks === 30) say(S.L.avisoMeta);
    if (S.L.needStop && S.R.goalTicks === 40 && !S.R.stopOnGoal) say(MSJ.metaSinDetener);
  }
  if (S.L.backdrops && S.L.mode !== 'cierre' && S.L.mode !== 'sandbox' && S.engine.alive()){
    const bug = S.sprites[0], w = S.sprites.find(o => o.kind === 'wasp');
    if (S.BACKDROP === 'arena' && touchAt(bug.x, bug.y, BODY_R, 'goal')) S.R.arenaGoal = true;
    if (w && S.BACKDROP === 'arena' && !w.hidden) S.R.waspInArena = true;
    if (w && S.BACKDROP === 'noche' && !w.hidden && S.engine.time - (S.R.ncT || 0) > 600) S.R.waspInNoche = true;
    if (S.BACKDROP !== 'noche') S.R.ncT = S.engine.time;
    if (S.engine.held.size && !S.R.gotoHint && S.R.heldSince != null && S.engine.time - S.R.heldSince > 900 && bug.x === bug.sx && bug.y === bug.sy
        && progOf('Bichito').some(sc => walk(sc.body, () => {}) || sc.body.some(f => f.type === 'forever' && f.body.some(x => x.type === 'goto')))){
      S.R.gotoHint = true; say(MSJ.gotoSuelto);
    }
    if (S.engine.held.size){ if (S.R.heldSince == null) S.R.heldSince = S.engine.time; } else S.R.heldSince = null;
    if (S.L.id === 'p6-pasar' && S.BACKDROP === 'arena' && S.R.inside && !S.R.stuckHint){ S.R.stuckHint = true; say(scan(progOf('Bichito'), b => b.type === 'goto') ? MSJ.gotoLejos : MSJ.paredNivelNuevo); }
    if (S.L.id === 'p6-inicio' && S.BACKDROP === 'noche' && !S.R.ncHint && S.engine.time > 1200){ S.R.ncHint = true; say(MSJ.nocheVieja); }
  }
  if (S.L.sprites && S.L.mode !== 'cierre' && S.P.rasgos.seguirClones){
    S.R.maxClones = Math.max(S.R.maxClones || 0, S.sprites.filter(o => o.isClone && o.kind === 'coin' && !o.hidden).length);
    const flying = S.sprites.filter(o => o.kind === 'seed' && !o.hidden && o.y < 150).length;
    S.R.maxSeeds = Math.max(S.R.maxSeeds || 0, flying);
    const piled = S.sprites.filter(o => o.isClone && o.y >= 160).length;
    if (piled >= 5 && !S.R.pileHint){ S.R.pileHint = true; say(MSJ.semillasAmontonadas); }
    if (S.L.id === 'p5-mostrar' && S.engine.alive() && S.sprites[1].hidden && !S.R.waspShown && !S.R.ghostHint && S.engine.time > 1500){ S.R.ghostHint = true; say(MSJ.avispaEscondida); }
    // tiró semillas sin tener: la variable quedó en negativo
    if (S.L.id === 'p5-balas' && (S.VARS.semillas ?? 0) < 0){ S.R.freeShot = true; if (!S.R.freeHint){ S.R.freeHint = true; say(MSJ.sinSemillas); } }
    // la semilla llegó arriba y no se esconde
    const sem = S.sprites.find(o => o.kind === 'seed' && !o.isClone);
    if (S.L.id === 'p5-vuela' && sem && S.engine.alive()){ S.R.pegadaTicks = !sem.hidden && sem.y >= 160 ? (S.R.pegadaTicks || 0) + 1 : 0; if (S.R.pegadaTicks > 20) S.R.semillaPegada = true; }
    // un objeto que tenía que crear clones solo y no crea
    if (S.L.avisoSinClones && S.R.flagT != null && S.engine.alive() && !S.R.nubes && S.engine.time - S.R.flagT > 3000 && !S.R.clonHint){ S.R.clonHint = true; say(S.L.avisoSinClones); }
    // la avispa se escondió y hace rato que no vuelve
    const w = S.sprites.find(o => o.kind === 'wasp');
    if (S.L.avisoEscondida && w && S.engine.alive()){ S.R.escondidaTicks = w.hidden ? (S.R.escondidaTicks || 0) + 1 : 0; if (S.R.escondidaTicks === 120) say(S.L.avisoEscondida); }
    if (S.L.id === 'p5-espacio' && S.R.waspHid && !S.R.hidWithSpace && !S.R.spaceHint){ S.R.spaceHint = true; say(MSJ.sinEspacio); }
  }
  if (S.L.sprites && S.L.mode !== 'cierre' && S.engine.alive()){
    const bug = S.sprites[0];
    for (const w of S.sprites.slice(1)){
      if (S.L.id === 'p3-1' && w.lastOrigin === 'flag' && w.x >= 223) S.R.waspEdge = true;
      if (S.L.id === 'p3-2' && w.bounced && w.x <= 100) S.R.waspBack = true;
    }
    if (S.L.enemyMatters){
      const hit = S.sprites.filter(w => w.kind === 'wasp').some(w => Math.hypot(w.x - bug.x, w.y - bug.y) < 28);
      S.R.enemyTicks = hit ? (S.R.enemyTicks || 0) + 1 : 0;
      if (S.R.enemyTicks === 2){ S.R.enemyIgnored = true; SND.oops(); say(MSJ.picoSinPasar); }
    }
    if (S.L.id === 'p4-reloj' && S.R.flagT != null && S.VARS.tiempo > (S.engine.time - S.R.flagT) / 1000 + 3 && !S.R.fastHint){ S.R.fastHint = true; say(MSJ.relojVuela); }
    if (S.L.id === 'p4-regresiva' && S.VARS.tiempo > 10 && !S.R.upHint){ S.R.upHint = true; say(MSJ.relojSube); }
    if (S.L.id === 'p4-regresiva' && S.VARS.tiempo < 0 && !S.R.zeroHint && !hasEqRule('tiempo', 0)){ S.R.zeroHint = true; say(MSJ.tiempoPasoCero); }
    if (S.L.id === 'p4-golpe' && S.VARS.vidas < 0 && !S.R.golpeHint){ S.R.golpeHint = true; say(MSJ.vidasDeGolpe); }
    if (S.L.id === 'p4-over' && S.VARS.vidas <= 0 && !S.R.overHint && !hasEqRule('vidas', 0)){ S.R.overHint = true; say(reglaSinDetener('vidas', 0) ? MSJ.reglaSinDetener : MSJ.sinVidasSigue); }
    if (S.L.id === 'p4-todo' && S.VARS.puntos > 10 && !S.R.winHint && !hasEqRule('puntos', 10)){ S.R.winHint = true; say(reglaSinDetener('puntos', 10) ? MSJ.reglaSinDetener : MSJ.pasastePuntos); }
    if (S.L.id === 'p3-1' && !S.sprites[1].program.length && !S.R.tabHint){ S.R.tabHint = true; say(MSJ.avispaSinProgramas); }
  }
  for (const [si, sp] of S.sprites.entries()){
    if (sp.kind !== 'bug' && !S.L.waspStars) continue;
    if (S.L.rocks) for (const r of S.L.rocks) if (Math.hypot(r.x - sp.x, r.y - sp.y) < 27){
      sp.x = sp.sx; sp.y = sp.sy; SND.bump(); say(MSJ.piedra); break;
    }
    for (const s of S.stars){
      if (s.got || (s.opt && !S.L.waspStars)) continue;
      if (s.owner != null && s.owner !== si) continue;
      if (S.L.tween ? Math.hypot(s.x - (sp.vx ?? sp.x), s.y - (sp.vy ?? sp.y)) >= 24 : Math.hypot(s.x - sp.x, s.y - sp.y) >= 24) continue;
      if (S.L.collectFrom && sp.lastOrigin !== S.L.collectFrom){
        if (S.L.collectFrom === 'key') say(MSJ.conBanderita);
        continue;
      }
      if (S.L.needWasd && !WASD.some(k => S.engine.held.has(k))){
        say(MSJ.conFlechas);
        continue;
      }
      if (S.L.holdStar){
        s.hold = (s.hold || 0) + 1; s.near = true;
        if (s.hold === 1) say(MSJ.ahiEsta);
        if (s.hold < 30) continue;
      }
      s.got = true; burst(s.x, s.y); SND.star();
    }
    if (S.L.holdStar) for (const s of S.stars) if (!s.got && Math.hypot(s.x - sp.x, s.y - sp.y) >= 24){
      if (s.near && !s.got){ s.near = false; s.hold = 0;
        // si un "sumar" quedó suelto en el "por siempre", camina aunque no apretes nada
        const suelto = S.prog.some(sc => sc.body.some(f => f.type === 'forever' && f.body.some(x => x.type === 'cx' || x.type === 'cy')));
        say(suelto ? MSJ.sePasoDeLargo : MSJ.sePaso);
      }
    }
    if (S.L.foreverHint && S.engine && !S.engine.alive() && sp.lastOrigin === 'flag' && !S.R.hinted && !S.stars.every(s => s.got)){
      S.R.hinted = true; say(MSJ.unaSolaVez);
    }
  }
  // niveles de "repetir": cuando el programa termina, decir si se salteó estrellas o si quedó corto
  if (S.L.pasoAPaso && !S.engine.alive() && S.R.flagT != null && !S.R.pasoAviso && !S.stars.every(s => s.got)){
    S.R.pasoAviso = true;
    const b = S.sprites[0], atras = S.stars.filter(s => !s.got && s.x < b.x), adelante = S.stars.filter(s => !s.got && s.x > b.x);
    if (atras.length) say(MSJ.salteo);
    else if (adelante.length) say(MSJ.faltanPasos(Math.round(Math.min(...adelante.map(s => s.x)) - b.x)));
  }
  if (S.L.mode === 'free' && S.stars.length && S.stars.every(s => s.got)){ S.freeCount++; say(MSJ.rondas(S.freeCount), true); spawnFree(); }
  if (S.L.mode !== 'cierre') checkWin();
}

export function flagPressed(){
  if (S.L.mode === 'explore') return;
  SND.flag();
  if (S.L.mode !== 'cierre'){
    if (!S.L.sprites && !S.prog.length) say(MSJ.programaVacio);
    else if (!S.L.sprites && !S.prog.some(s => s.hat === 'flag')) say(S.L.palette.includes('flag') ? MSJ.sinBanderita : MSJ.sinBanderitaTeclas);
    else if (!S.L.sprites && S.prog.filter(s => s.hat === 'flag').every(s => !s.body.length)) say(MSJ.banderitaVacia);
    else if (S.P.rasgos.avisarSiAfuera && S.prog.some(s => s.hat === 'flag' && ifOutsideForever(s.body))) say(MSJ.siAfuera);
    else if (S.P.rasgos.avisarPorSiempreVacio && S.prog.some(s => s.hat === 'flag' && s.body.some(b => b.type === 'forever' && !b.body.length) && s !== S.prog[0])) say(MSJ.porSiempreVacio);
  }
  if (S.L.needReset && !S.sprites.some(o => scan(o.program, b => b.type === 'setvar' && b.v === 'puntos'))) say(MSJ.puntosArrancan(S.VARS.puntos));
  if (S.L.resetOnFlag){
    S.sprites.forEach(s => { s.x = s.sx; s.y = s.sy; s.bubble = ''; s.dir = s.sdir; s.bounced = false; s.costume = s.scostume; });
    if (S.L.mode !== 'free' && !S.L.keepStars) S.stars.forEach(s => { s.got = false; s.hold = 0; s.near = false; });
    newRun(); S.won = false; S.R.flagT = S.engine.time;
  }
  S.engine.flag();
}

export function keyDown(k){
  if (S.L.mode === 'explore'){ return; }
  avisos.teclas();
  if (S.L.mode !== 'cierre' && !S.engine.held.has(k)){
    const listens = S.prog.filter(s => s.hat === 'key' && s.key === k);
    if (!listens.length && !S.engine.alive()){
      const flags = S.prog.filter(s => s.hat === 'flag');
      if (S.engine.stopped) say(MSJ.detenido);
      else if (flags.some(s => has(s.body, 'forever'))) say(MSJ.noArranco);
      else if (flags.some(s => ifOutsideForever(s.body))) say(MSJ.siUnaVez);
      else if (S.L.palette.includes('key')) say(MSJ.nadieEscucha(k));
    } else if (listens.length && listens.every(s => !s.body.length)) say(MSJ.eventoVacio(k));
  }
  if (S.L.mode !== 'cierre' && S.engine.alive() && !S.engine.held.has(k)){
    let asked = false; const scan = c => { if (!c) return; if (c.type === 'keyp' && c.key === k) asked = true; if (c.type === 'or'){ scan(c.a); scan(c.b); } };
    allBlocks().forEach(b => { if (b.type === 'if') scan(b.cond); });
    if (!asked && !S.prog.some(sc => sc.hat === 'key' && sc.key === k) && (WASD.includes(k) || S.L.pad === 'wasd' || S.L.palette.includes('keyp')))
      say(MSJ.teclaSinSi(k, WASD.includes(k)));
  }
  S.engine.keyDown(k); avisos.teclas();
}

export function keyUp(k){ S.engine.keyUp(k); avisos.teclas(); }

export function iniciarPartida(){
  newRun();
}

/* Nivel de explorar: ¿la x y la y que dijo el chico son las de alguna estrella? (20 de tolerancia) */
export function adivinar(gx, gy){
  const left = S.stars.filter(st => !st.got);
  const s = left.reduce((a, b) => Math.hypot(b.x - gx, b.y - gy) < Math.hypot(a.x - gx, a.y - gy) ? b : a);
  const okx = Math.abs(gx - s.x) <= 20, oky = Math.abs(gy - s.y) <= 20;
  if (okx && oky){ s.got = true; S.exploreIdx++; checkWin(); }
  return { estrella: s, okx, oky };
}

/* Cierre: contestar una pregunta. Devuelve si estuvo bien. */
export function responder(qi, opcion){
  const bien = !!S.L.quiz[qi].opts[opcion][1];
  if (bien){ S.quiz[qi] = true; checkWin(); }
  return bien;
}
