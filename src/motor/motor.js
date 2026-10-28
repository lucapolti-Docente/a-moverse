export const DT = 1000/30;

export const KEY_DELAY = 500;

export const KEY_REPEAT = 33;

export const STOP_ALL = {stop:true}, DEL_CLONE = {del:true};

export function normDir(d){ d = ((d + 180) % 360 + 360) % 360 - 180; return d === -180 ? 180 : Math.round(d * 100) / 100; }

export function createEngine(hooks){
  hooks = hooks || {};
  const E = {time:0, held:new Set(), last:null, nextRep:0, threads:[], sprites:[], stopped:false};
  const num = v => { if (v && typeof v === 'object') v = hooks.getVar ? hooks.getVar(v.v) : 0; const n = Number(v); return isFinite(n) ? n : 0; };
  function clamp(s){
    const B = s.bounds || {x0:-224,x1:224,y0:-164,y1:164};
    s.x = Math.max(B.x0, Math.min(B.x1, s.x)); s.y = Math.max(B.y0, Math.min(B.y1, s.y));
  }
  function move(t, dx, dy, b){
    const s = t.sprite; s.x += dx; s.y += dy; clamp(s);
    s.lastOrigin = t.origin;
    if (dx || dy) s.lastDir = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'up' : 'down';
    if (hooks.move) hooks.move(t, dx, dy, b);
  }
  function evalCond(c, t){
    if (c.type === 'keyp') return E.held.has(c.key);
    if (c.type === 'touchc') return hooks.touching ? !!hooks.touching(t.sprite, c.color) : false;
    if (c.type === 'or') return (!!c.a && evalCond(c.a, t)) || (!!c.b && evalCond(c.b, t));
    if (c.type === 'and') return (!!c.a && evalCond(c.a, t)) && (!!c.b && evalCond(c.b, t));
    if (c.type === 'toucho') return hooks.touchingObj ? !!hooks.touchingObj(t.sprite, c.target) : false;
    if (c.type === 'eq') return hooks.getVar ? Number(hooks.getVar(c.v)) === num(c.n) : false;
    if (c.type === 'gt') return hooks.getVar ? Number(hooks.getVar(c.v)) > num(c.n) : false;
    if (c.type === 'lt') return hooks.getVar ? Number(hooks.getVar(c.v)) < num(c.n) : false;
    return false;
  }
  function* runList(list, t){ for (let i = 0; i < list.length; i++) yield* runBlock(list[i], t); }
  function* runBlock(b, t){
    const s = t.sprite;
    switch (b.type){
      case 'move': {
        const a = (s.dir == null ? 90 : s.dir) * Math.PI / 180, n = num(b.n);
        move(t, Math.round(n * Math.sin(a) * 100) / 100, Math.round(n * Math.cos(a) * 100) / 100, b); break;
      }
      case 'pointdir': s.dir = normDir(num(b.n)); break;
      case 'pointto': { const o = hooks.findSprite && hooks.findSprite(b.target); if (o && (o.x !== s.x || o.y !== s.y)) s.dir = normDir(Math.atan2(o.x - s.x, o.y - s.y) * 180 / Math.PI); break; }
      case 'bounce': {
        const B = s.bounds || {x0:-224,x1:224,y0:-164,y1:164}; let hit = false;
        if (s.x >= B.x1 || s.x <= B.x0){ s.dir = normDir(-(s.dir == null ? 90 : s.dir)); hit = true; }
        if (s.y >= B.y1 || s.y <= B.y0){ s.dir = normDir(180 - (s.dir == null ? 90 : s.dir)); hit = true; }
        if (hit && hooks.bounce) hooks.bounce(t);
        break;
      }
      case 'switchbd': { const nb = hooks.switchBackdrop ? hooks.switchBackdrop(b.bd, t) : null; if (nb) E.backdropEvent(nb); break; }
      case 'hide': s.hidden = true; if (hooks.hidden) hooks.hidden(t); break;
      case 'show': s.hidden = false; if (hooks.shown) hooks.shown(t); break;
      case 'broadcast': E.broadcast(b.msg); break;
      case 'gotoobj': { const o = hooks.findSprite && hooks.findSprite(b.target); if (o){ s.x = o.x; s.y = o.y; s.lastOrigin = t.origin; } break; }
      case 'clone': { const src = b.target === 'mí mismo' ? s : (hooks.findSprite && hooks.findSprite(b.target)); if (src) E.makeClone(src); break; }
      case 'delclone': if (s.isClone){ E.removeSprite(s); throw DEL_CLONE; } break;
      case 'setvar': if (hooks.setVar) hooks.setVar(b.v, num(b.n), t); break;
      case 'changevar': if (hooks.setVar) hooks.setVar(b.v, Number(hooks.getVar(b.v) || 0) + num(b.n), t); break;
      case 'gorandom': { const p = hooks.randomPos ? hooks.randomPos(s) : {x:0, y:0}; s.x = p.x; s.y = p.y; if (hooks.jumped) hooks.jumped(t); break; }
      case 'wait': { const n = Math.max(0, Math.round(num(b.n) * 30)); for (let i = 0; i < n; i++) yield; break; }
      case 'cx':   move(t, num(b.n), 0, b); break;
      case 'cy':   move(t, 0, num(b.n), b); break;
      case 'goto':
        if (hooks.goto) hooks.goto(t, b);
        s.x = num(b.x); s.y = num(b.y); clamp(s); s.lastOrigin = t.origin;
        if (hooks.move) hooks.move(t, 0, 0, b);
        break;
      case 'say': s.bubble = String(b.text == null ? '' : b.text); if (hooks.say) hooks.say(t, b); break;
      case 'stop': E.threads = []; E.stopped = true; if (hooks.stop) hooks.stop(t); throw STOP_ALL;
      case 'forever': for(;;){ yield* runList(b.body, t); yield; }
      case 'repeat': { const n = Math.max(0, Math.round(num(b.n))); for (let i = 0; i < n; i++){ yield* runList(b.body, t); yield; } break; }
      case 'nextcos': { const cyc = hooks.costumeList ? hooks.costumeList(s) : ['paso 1','paso 2','feliz','dolor']; const i = cyc.indexOf(s.costume); s.costume = cyc[(i + 1) % cyc.length]; if (hooks.costume) hooks.costume(t, s.costume); break; }
      case 'setcos': s.costume = b.cos; if (hooks.costume) hooks.costume(t, s.costume); break;
      case 'if':
        t.askedIf = true;
        if (!b.cond){ if (hooks.emptyCond) hooks.emptyCond(t); break; }
        if (evalCond(b.cond, t)) yield* runList(b.body, t);
        break;
    }
  }
  function start(sprite, script, origin){
    const t = {sprite, script, origin, key: script.key};
    t.gen = runList(script.body, t);
    E.threads.push(t);
    return t;
  }
  function fire(k){
    for (const s of E.sprites.slice()) for (const sc of s.program)
      if (sc.hat === 'key' && sc.key === k && !E.threads.some(t => t.script === sc && t.sprite === s)) start(s, sc, 'key');
  }
  function clearClones(){ for (let i = E.sprites.length - 1; i >= 0; i--) if (E.sprites[i].isClone) E.sprites.splice(i, 1); }
  E.broadcast = msg => {
    for (const s of E.sprites.slice()) for (const sc of s.program) if (sc.hat === 'msg' && sc.msg === msg){
      E.threads = E.threads.filter(t => !(t.script === sc && t.sprite === s));
      start(s, sc, 'msg');
    }
  };
  E.makeClone = src => {
    if (E.sprites.filter(o => o.isClone).length >= 40) return;
    const c = Object.assign({}, src, {isClone:true, bubble:'', moved:0});
    E.sprites.push(c);
    for (const sc of c.program) if (sc.hat === 'clone') start(c, sc, 'clone');
    if (hooks.cloned) hooks.cloned(c);
  };
  E.backdropEvent = name => {
    for (const s of E.sprites.slice()) for (const sc of s.program) if (sc.hat === 'bd' && sc.bd === name){
      E.threads = E.threads.filter(t => !(t.script === sc && t.sprite === s));
      start(s, sc, 'bd');
    }
  };
  E.removeSprite = sp => { const i = E.sprites.indexOf(sp); if (i >= 0) E.sprites.splice(i, 1); E.threads = E.threads.filter(t => t.sprite !== sp); };
  E.flag = () => { E.threads = []; E.stopped = false; clearClones(); for (const s of E.sprites) for (const sc of s.program) if (sc.hat === 'flag') start(s, sc, 'flag'); };
  E.stop = () => { E.threads = []; clearClones(); };
  E.keyDown = k => {
    if (E.held.has(k)) return;
    E.held.add(k); E.last = k; E.nextRep = E.time + KEY_DELAY;   // solo repite la ÚLTIMA tecla apretada
    fire(k);
  };
  E.keyUp = k => { E.held.delete(k); if (E.last === k) E.last = null; };
  E.releaseAll = () => { E.held.clear(); E.last = null; };
  E.alive = () => E.threads.length > 0;
  E.step = () => {
    E.time += DT;
    while (E.last && E.time >= E.nextRep){ fire(E.last); E.nextRep += KEY_REPEAT; }
    for (const t of E.threads.slice()){
      if (!E.threads.includes(t)) continue;
      let done;
      try { done = t.gen.next().done; } catch(e){ if (e === STOP_ALL) break; if (e === DEL_CLONE) continue; throw e; }
      if (done) E.threads.splice(E.threads.indexOf(t), 1);
    }
  };
  return E;
}
