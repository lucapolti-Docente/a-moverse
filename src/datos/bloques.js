import { S } from '../estado.js';
import { andB, bdB, bounceB, chV, cloneB, cx, cy, delB, eqB, fe, gotoB, gotoO, gtB, hatBd, hatClone, hatFlag, hatKey, hatMsg, hideB, iff, kp, ltB, mv, nextCos, orB, pdirB, ptoB, repB, rndB, sayB, sendB, setCos, setV, showB, stopB, tc, toO, waitB } from '../motor/bloques.js';
import { bdNames, msgNames, otherNames, varNames } from '../motor/nombres.js';

export const KEYS = {right:'flecha derecha', left:'flecha izquierda', up:'flecha arriba', down:'flecha abajo', w:'w', a:'a', s:'s', d:'d', space:'espacio'};

export const CATS = {ev:['Eventos','var(--ev)'], mo:['Movimiento','var(--mo)'], ap:['Apariencia','var(--ap)'], co:['Control','var(--co)'], se:['Sensores','var(--se)'], op:['Operadores','var(--op)'], va:['Variables','var(--va)']};

export const PAL = {
  flag:{cat:'ev', hat:true, make:() => hatFlag()},
  key:{cat:'ev', hat:true, make:() => hatKey(S.L.defaultKey || 'right')},
  whenmsg:{cat:'ev', hat:true, make:() => hatMsg(msgNames()[0])},
  whenclone:{cat:'co', hat:true, make:() => hatClone()},
  whenbd:{cat:'ev', hat:true, make:() => hatBd(bdNames()[1] || bdNames()[0])},
  switchbd:{cat:'ap', make:() => bdB(S.L.defaultBd || bdNames()[0])},
  broadcast:{cat:'ev', make:() => sendB(msgNames()[0])},
  hide:{cat:'ap', make:() => hideB()},
  show:{cat:'ap', make:() => showB()},
  and:{cat:'op', make:() => andB(null, null)},
  gotoobj:{cat:'mo', make:() => gotoO(otherNames()[0] || 'Bichito')},
  clone:{cat:'co', make:() => cloneB(otherNames().includes('Semilla') ? 'Semilla' : 'mí mismo')},
  delclone:{cat:'co', make:() => delB()},
  move:{cat:'mo', make:() => mv(10)},
  cx:{cat:'mo', make:() => cx(10)},
  cy:{cat:'mo', make:() => cy(10)},
  goto:{cat:'mo', make:() => gotoB(S.L.start ? S.L.start.x : 0, S.L.start ? S.L.start.y : 0)},
  say:{cat:'ap', make:() => sayB('¡Llegué!')},
  forever:{cat:'co', make:() => fe()},
  repeat:{cat:'co', make:() => repB(5)},
  nextcos:{cat:'ap', make:() => nextCos()},
  setcos:{cat:'ap', make:() => setCos(S.L.defaultCos || 'feliz')},
  if:{cat:'co', make:() => iff(null)},
  stop:{cat:'co', make:() => stopB()},
  keyp:{cat:'se', make:() => kp(S.L.defaultKey || 'right')},
  touchc:{cat:'se', make:() => tc((S.L.colors || ['goal'])[0])},
  or:{cat:'op', make:() => orB(null, null)},
  toucho:{cat:'se', make:() => toO(otherNames()[0] || 'borde')},
  bounce:{cat:'mo', make:() => bounceB()},
  pointdir:{cat:'mo', make:() => pdirB(90)},
  pointto:{cat:'mo', make:() => ptoB(otherNames()[0] || 'Bichito')},
  wait:{cat:'co', make:() => waitB(1)},
  setvar:{cat:'va', make:() => setV(varNames()[0], 0)},
  changevar:{cat:'va', make:() => chV(varNames()[0], 1)},
  eq:{cat:'op', make:() => eqB(varNames()[0], 0)},
  gt:{cat:'op', make:() => gtB(varNames()[0], 0)},
  lt:{cat:'op', make:() => ltB(varNames()[0], 0)},
  gorandom:{cat:'mo', make:() => rndB()},
};

export const COND_TYPES = ['keyp', 'touchc', 'or', 'toucho', 'eq', 'and', 'gt', 'lt'];

export const ALL_BLOCKS = ['flag','key','whenmsg','whenbd','whenclone','broadcast',
  'move','cx','cy','goto','gotoobj','gorandom','pointdir','pointto','bounce',
  'say','hide','show','nextcos','setcos','switchbd',
  'forever','repeat','if','wait','stop','clone','delclone',
  'keyp','touchc','toucho','and','or','eq','gt','lt','setvar','changevar'];

/* Lo que dice cada bloque, en orden (los huecos y menús van entre medio). Mismas palabras que Scratch 3 en español. */
export const ETIQUETAS = {
  flag: ['al hacer clic en'],
  key: ['al presionar tecla'],
  whenmsg: ['al recibir'],
  whenbd: ['al cambiar el fondo a'],
  whenclone: ['al comenzar como clon'],
  move: ['mover', 'pasos'],
  cx: ['sumar a x'],
  cy: ['sumar a y'],
  goto: ['ir a x:', 'y:'],
  gotoobj: ['ir a'],
  gorandom: ['ir a', 'posición aleatoria ▾'],
  pointdir: ['apuntar en dirección'],
  pointto: ['apuntar hacia'],
  bounce: ['rebotar si toca un borde'],
  say: ['decir'],
  hide: ['esconder'],
  show: ['mostrar'],
  nextcos: ['siguiente disfraz'],
  setcos: ['cambiar disfraz a'],
  switchbd: ['cambiar fondo a'],
  broadcast: ['enviar mensaje'],
  forever: ['por siempre'],
  repeat: ['repetir', 'veces'],
  'if': ['si', 'entonces'],
  wait: ['esperar', 'segundos'],
  stop: ['detener', 'todos ▾'],
  clone: ['crear clon de'],
  delclone: ['eliminar este clon'],
  keyp: ['¿tecla', 'presionada?'],
  touchc: ['¿tocando el color', '?'],
  toucho: ['¿tocando', '?'],
  and: ['y'],
  or: ['o'],
  eq: ['='],
  gt: ['>'],
  lt: ['<'],
  setvar: ['dar a', 'el valor'],
  changevar: ['sumar a']
};
