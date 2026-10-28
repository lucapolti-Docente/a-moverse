import { S } from '../estado.js';
import { COND_TYPES, PAL } from '../datos/bloques.js';
import { say } from './aviso.js';
import { renderProgram } from './editor.js';
import { TWIN } from '../motor/bloques.js';
import { allBlocks, findBlock, findList, findParent, walk } from '../motor/recorrer.js';
import { condTargets } from '../motor/reglas.js';
import { SND, ac } from '../sonido.js';

export function defaultSel(){
  const open_ = S.prog.filter(sc => !(sc.fold && !sc.open));
  if (!open_.length) return null;
  const last = open_[open_.length - 1];
  if (S.L.selStart) return {owner:last.id, index:0};
  if (S.L.selInIf){
    let e = null;
    open_.forEach(sc => walk(sc.body, b => { if (!e && b.type === 'if' && b.cond && (condTargets(b.cond).length || b.cond.type === 'touchc')) e = b; }));
    if (e) return {owner:e.id, index:e.body.length};
  }
  if (S.L.selEmptyInner){ const e = allBlocks().find(b => b.type === 'if' && b.cond && b.cond.type === 'touchc' && !b.body.length); if (e) return {owner:e.id, index:0}; }
  if (S.L.selInside && last.body[0] && last.body[0].type === 'forever') return {owner:last.body[0].id, index:0};
  const lb = last.body[last.body.length - 1];
  if (lb && lb.type === 'forever') return {owner:lb.id, index:lb.body.length};
  return {owner:last.id, index:last.body.length};
}

export function findInScript(sc, id){ let f = false; walk(sc.body, b => { if (b.id === id) f = true; }); return f; }

export function allOrs(){ const out = []; const scan = c => { if (c && (c.type === 'or' || c.type === 'and')){ out.push(c); scan(c.a); scan(c.b); } }; allBlocks().forEach(b => { if (b.type === 'if') scan(b.cond); }); return out; }

export const findOr = id => allOrs().find(o => o.id === id);

export function fixSel(){
  if (S.sel && S.sel.orSlot && !findOr(S.sel.orSlot)) S.sel = null;
  if (S.sel && S.sel.cond && !findBlock(S.sel.cond)) S.sel = null;
  if (S.sel && S.sel.owner && !findList(S.sel.owner)) S.sel = null;
  if (!S.sel) S.sel = defaultSel();
}

export function insert(t){
  ac(); const Pb = PAL[t];
  if (Pb.hat){
    const sc = Pb.make(); S.prog.push(sc); S.sel = {owner:sc.id, index:0}; SND.pop(); renderProgram(); return;
  }
  if (t === 'or' || t === 'and'){
    const nm = t === 'or' ? '“o”' : '“y”', isOp = c => c && (c.type === 'or' || c.type === 'and');
    let target = S.sel && S.sel.cond ? findBlock(S.sel.cond) : null;
    if (!target && S.sel && S.sel.owner){ const ob = findBlock(S.sel.owner); if (ob && ob.type === 'if') target = ob; }
    if (!target) target = allBlocks().reverse().find(b => b.type === 'if' && !isOp(b.cond));
    if (!target){ say('El bloque ' + nm + ' va en el hueco de un “si”. Primero poné un “si”.'); SND.oops(); return; }
    if (isOp(target.cond)){ say('Ese “si” ya tiene un ' + (target.cond.type === 'or' ? '“o”' : '“y”') + '. Tocá otra pregunta celeste.'); SND.oops(); return; }
    const o = Pb.make(); o.a = target.cond || null; target.cond = o;
    S.sel = {orSlot:o.id, side:o.a ? 'b' : 'a'}; SND.pop(); renderProgram(); return;
  }
  if (COND_TYPES.includes(t)){
    // primero, un hueco libre de un "o"
    let slotOr = S.sel && S.sel.orSlot ? findOr(S.sel.orSlot) : null, side = S.sel && S.sel.side;
    if (!(slotOr && !slotOr[side])){ slotOr = allOrs().find(o => !o.a || !o.b); side = slotOr ? (!slotOr.a ? 'a' : 'b') : null; }
    if (slotOr && !(S.sel && S.sel.cond)){
      const c = Pb.make();
      const other = slotOr[side === 'a' ? 'b' : 'a'];
      if (c.type === 'keyp' && other && other.type === 'keyp' && TWIN[other.key]) c.key = TWIN[other.key];
      slotOr[side] = c;
      S.sel = (!slotOr.a || !slotOr.b) ? {orSlot:slotOr.id, side:!slotOr.a ? 'a' : 'b'} : null;
      fixSel(); SND.pop(); renderProgram(); return;
    }
    let target = S.sel && S.sel.cond ? findBlock(S.sel.cond) : null;
    if (!target && S.sel && S.sel.owner){ const ob = findBlock(S.sel.owner); if (ob && ob.type === 'if' && !ob.cond) target = ob; }
    if (!target) target = allBlocks().reverse().find(b => b.type === 'if' && !b.cond);
    if (!target){ say('Los bloques celestes van en el hueco de un “si”. Primero poné un “si”.'); SND.oops(); return; }
    target.cond = Pb.make(); S.sel = {owner:target.id, index:target.body.length}; SND.pop(); renderProgram(); return;
  }
  if (!S.prog.length){ say('Primero poné un evento amarillo: el programa necesita saber cuándo arrancar.'); SND.oops(); return; }
  fixSel();
  if (!S.sel){ say('Empezá un programa nuevo: tocá “al hacer clic en bandera”.'); SND.oops(); return; }
  let list, index, owner;
  if (S.sel.cond){ const ib = findBlock(S.sel.cond); list = ib.body; index = list.length; owner = ib.id; }
  else { list = findList(S.sel.owner); index = Math.min(S.sel.index, list.length); owner = S.sel.owner; }
  // debajo de un "por siempre" no se puede encastrar nada: va adentro
  const isScript = S.prog.some(s => s.id === owner);
  if (isScript && index > 0 && index === list.length && list[index - 1].type === 'forever'){
    const f = list[index - 1]; list = f.body; index = list.length; owner = f.id;
  }
  const b = Pb.make();
  if (b.type === 'forever' || b.type === 'repeat'){ b.body = list.splice(index); list.push(b); S.sel = {owner:b.id, index:b.body.length}; } // como Scratch: envuelve lo de abajo
  else if (b.type === 'if'){ b.body = list.splice(index); list.push(b); S.sel = {owner:b.id, index:b.body.length}; } // también envuelve, como Scratch
  else { list.splice(index, 0, b); S.sel = {owner, index:index + 1}; }
  SND.pop(); renderProgram();
}

export function removeBlock(id){
  const si = S.prog.findIndex(s => s.id === id);
  if (si >= 0) S.prog.splice(si, 1);
  else { const p = findParent(id); if (p) p.list.splice(p.i, 1); }
  fixSel(); renderProgram();
}
