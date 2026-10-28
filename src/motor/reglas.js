import { S, createdVars } from '../estado.js';
import { walk } from './recorrer.js';

/* Lo que los niveles pueden mirar de la partida en curso (para sus chequeos y mensajes). */
export const vars = () => S.VARS;
export const corrida = () => S.R;
export const fondo = () => S.BACKDROP;
export const creadas = () => createdVars[S.L.id] || [];

export function walkF(list, fn, inF){ list.forEach(b => { if (inF) fn(b); if (b.body) walkF(b.body, fn, inF || b.type === 'forever'); }); }

export const hasRule = (color, pred) => { let ok = false; S.prog.forEach(sc => walkF(sc.body, b => {
  if (b.type === 'if' && b.cond && b.cond.type === 'touchc' && b.cond.color === color){ walk(b.body, x => { if (pred(x)) ok = true; }); }
})); return ok; };

export const lavaRule = () => hasRule('lava', b => b.type === 'goto');

export const nested = (keys, color, pred) => { let ok = false; S.prog.forEach(sc => walk(sc.body, b => {
  if (b.type === 'if' && b.cond && b.cond.type === 'keyp' && keys.includes(b.cond.key))
    b.body.forEach(x => { if (x.type === 'if' && x.cond && x.cond.type === 'touchc' && x.cond.color === color && x.body.some(pred)) ok = true; });
})); return ok; };

export const mudNested = () => { let ok = false; S.prog.forEach(sc => walk(sc.body, b => {
  if (b.type === 'if' && b.cond && b.cond.type === 'keyp' && (b.cond.key === 'right' || b.cond.key === 'd'))
    b.body.forEach(x => { if (x.type === 'if' && x.cond && x.cond.type === 'touchc' && x.cond.color === 'mud' && x.body.some(y => y.type === 'cx' && Number(y.n) < 0)) ok = true; });
})); return ok; };

export const wallRule = () => hasRule('wall', b => b.type === 'cx' || b.type === 'cy');

export const starsDone = () => S.stars.every(s => s.got || s.opt);

export const progOf = name => { const sp = S.sprites.find(o => o.name === name); return sp ? sp.program : []; };

export const scan = (programs_, pred) => { let ok = false; programs_.forEach(sc => walk(sc.body, b => { if (pred(b)) ok = true; })); return ok; };

export const condTargets = c => !c ? [] : c.type === 'toucho' ? [c.target] : (c.type === 'or' || c.type === 'and') ? [...condTargets(c.a), ...condTargets(c.b)] : [];

export const scanF = (programs_, pred) => { let ok = false; programs_.forEach(sc => walkF(sc.body, b => { if (pred(b)) ok = true; })); return ok; };

export const enemyRule = (who, pred) => scanF(progOf('Bichito'), b => b.type === 'if' && condTargets(b.cond).includes(who) && b.body.some(pred));

export const enemyRuleOnce = (who) => scan(progOf('Bichito'), b => b.type === 'if' && condTargets(b.cond).includes(who));

/* Velocidad de la avispa: lo que avanza en cada vuelta del "por siempre" (suma de todos sus "mover"). */
export const chaseSpeed = () => { let n = null; progOf('Avispa').forEach(sc => walkF(sc.body, b => { if (b.type === 'move') n = (n || 0) + Number(b.n); })); return n; };

export const ruleIn = (who, pred) => scanF(progOf(who), pred);

export const hasVarChange = (who, target, v, sign) => ruleIn(who, b => b.type === 'if' && condTargets(b.cond).includes(target) && b.body.some(x => x.type === 'changevar' && x.v === v && Math.sign(Number(x.n)) === sign));

export const hasEqSay = (v, n) => scanF(progOf('Bichito'), b => b.type === 'if' && b.cond && b.cond.type === 'eq' && b.cond.v === v && Number(b.cond.n) === n && b.body.some(x => x.type === 'say'));

export const hasEqRule = (v, n) => scanF(progOf('Bichito'), b => b.type === 'if' && b.cond && b.cond.type === 'eq' && b.cond.v === v && Number(b.cond.n) === n && b.body.some(x => x.type === 'stop'));

export const andHas = (c, pred) => c && c.type === 'and' && [c.a, c.b].some(x => x && pred(x));
