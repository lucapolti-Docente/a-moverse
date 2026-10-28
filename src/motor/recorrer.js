import { S } from '../estado.js';

export function walk(list, fn, parentId){ list.forEach((b,i) => { fn(b, list, i, parentId); if (b.body) walk(b.body, fn, b.id); }); }

export function allBlocks(){ const out = []; S.prog.forEach(sc => walk(sc.body, b => out.push(b), sc.id)); return out; }

export function findBlock(id){ return allBlocks().find(b => b.id === id); }

export function findList(id){ const sc = S.prog.find(s => s.id === id); if (sc) return sc.body; const b = findBlock(id); return b && b.body ? b.body : null; }

export function findParent(id){ let r = null; S.prog.forEach(sc => walk(sc.body, (b, list, i, pid) => { if (b.id === id) r = {list, i, pid}; }, sc.id)); return r; }

export const has = (list, type) => { let f = false; walk(list, b => { if (b.type === type) f = true; }); return f; };

export function ifOutsideForever(list){ return list.some(b => b.type === 'if'); }
