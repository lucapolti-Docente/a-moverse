import { bdB, bounceB, chV, cx, cy, delB, eqB, fe, gotoB, gotoO, hatClone, hatFlag, hatMsg, hideB, iff, kp, mv, orB, pdirB, rndB, sayB, sendB, setCos, setV, showB, stopB, tc, toO, waitB } from '../motor/bloques.js';

export const CIERRE_B = () => [hatFlag(fe(iff(kp('right'), cx(10)), iff(kp('left'), cx(-10)), iff(kp('up'), cy(10)), iff(kp('down'), cy(-10))))];

export const MOVE4 = () => fe(iff(kp('right'), cx(10)), iff(kp('left'), cx(-10)), iff(kp('up'), cy(10)), iff(kp('down'), cy(-10)));

export const MOVE4W = () => fe(
  iff(kp('right'), cx(10), iff(tc('wall'), cx(-10))),
  iff(kp('left'), cx(-10), iff(tc('wall'), cx(10))),
  iff(kp('up'), cy(10), iff(tc('wall'), cy(-10))),
  iff(kp('down'), cy(-10), iff(tc('wall'), cy(10))));

export const MOVE_S = (open) => Object.assign(hatFlag(MOVE4()), {fold:'moverse con las flechas', open:!!open});

export const MOVEW_S = () => Object.assign(hatFlag(MOVE4W()), {fold:'moverse con las flechas y frenar en las paredes'});

export const GOAL_S = stop => hatFlag(fe(iff(tc('goal'), sayB('¡Llegué!'), ...(stop ? [stopB()] : []))));

export const ARROW_FULL = (key, d) => { const m = v => d === 'x' ? cx(v) : cy(v), v = (key === 'right' || key === 'up') ? 10 : -10;
  return iff(kp(key), m(v), iff(tc('wall'), m(-v)), iff(tc('ice'), m(v), iff(tc('wall'), m(-v))), iff(tc('mud'), m(-v/2))); };

export const MOVE_FULL = () => fe(ARROW_FULL('right','x'), ARROW_FULL('left','x'), ARROW_FULL('up','y'), ARROW_FULL('down','y'));

export const PATROL = (n=5) => hatFlag(fe(mv(n), bounceB()));

export const LOSE_S = (who=['Avispa']) => Object.assign(hatFlag(fe(iff(who.length > 1 ? orB(toO(who[0]), toO(who[1])) : toO(who[0]), sayB('¡Ay!'), stopB()))), {fold:'si me toca la avispa, pierdo'});

export const COIN_S = (pts, reset) => hatFlag(...(reset ? [setV('puntos', 0)] : []), fe(iff(toO('Bichito'), ...(pts ? [chV('puntos', 1)] : []), rndB())));

export const HEART_S = () => hatFlag(fe(iff(toO('Bichito'), chV('vidas', 1), rndB())));

export const LIFE_S = (opts = {}) => Object.assign(hatFlag(setV('vidas', 3), fe(iff(toO('Avispa'), chV('vidas', -1), ...(opts.goto ? [gotoB(-190, -140)] : []), ...(opts.wait ? [waitB(1)] : [])))),
  opts.open ? {} : {fold:'si me pica la avispa, pierdo una vida'});

export const OVER_S = (open) => Object.assign(hatFlag(fe(iff(eqB('vidas', 0), sayB('¡Se terminó!'), stopB()))), open ? {} : {fold:'si me quedo sin vidas, pierdo'});

export const WIN_S = () => hatFlag(fe(iff(eqB('puntos', 10), sayB('¡Ganaste!'), stopB())));

export const SEED_FLY = () => hatFlag(hideB(), pdirB(0), fe(mv(15), iff(toO('borde'), hideB())));

export const SEED_CLONE = () => [Object.assign(hatFlag(hideB(), pdirB(0)), {fold:'al empezar: esconderse y mirar para arriba'}),
  hatClone(gotoO('Bichito'), showB(), fe(mv(15), iff(toO('borde'), delB())))];

export const HIT_S = (who='Semilla') => hatFlag(showB(), fe(iff(toO(who), hideB(), sendB('atrapada'))));

export const NEXT_BUG = () => Object.assign(hatFlag(fe(iff(tc('goal'), sendB('siguiente nivel'), waitB(0.5)))), {fold:'si toco la meta, aviso “siguiente nivel”'});

export const BACK_BUG = () => Object.assign(hatMsg('siguiente nivel', gotoB(-200, -150)), {fold:'al pasar de nivel, vuelvo al inicio'});

export const STAGE_START = (extra=[]) => Object.assign(hatFlag(bdB('pasto'), ...extra), {fold:'al empezar: fondo pasto' + (extra.length ? ' y nivel 1' : '')});

export const WALK_BODY = () => [setCos('paso 1'), waitB(0.15), setCos('paso 2'), waitB(0.15)];

export const WALK_S = (open) => Object.assign(hatFlag(fe(iff(orB(kp('right'), kp('left')), ...WALK_BODY()))), open ? {} : {fold:'animación de caminar: paso 1, paso 2'});
