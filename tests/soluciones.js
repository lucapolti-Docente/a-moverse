/* Solución esperada de cada nivel: el programa que arma el chico y lo que hace con el teclado.
   `programa` reemplaza el programa del nivel; `sprites` reemplaza el de cada personaje nombrado.
   Acciones (ver tests/ayudante/jugar.js):
     ['bandera'] · ['esperar', ticks] · ['tener', tecla, ticks] · ['tocar', tecla, veces, separación]
     ['ir', destino, opciones]   piloto automático hacia 'estrellas', 'meta', un personaje o {debajo:'Nave'}
     ['hacer', (S, creadas) => …] · ['quiz'] · ['explorar']
   30 ticks = 1 segundo. */
import { repB, hatFlag, hatKey, mv, cx, cy, fe, iff, kp, tc, orB, toO, bounceB, pdirB, ptoB, waitB, setV, chV, eqB, gtB, ltB, rndB, hideB, showB, andB, sendB, hatMsg, hatClone, gotoO, cloneB, delB, bdB, nextCos, setCos, hatBd, V, sayB, stopB, gotoB } from '../src/motor/bloques.js';
import { MOVE_S, MOVEW_S, GOAL_S, MOVE_FULL, PATROL, COIN_S, HEART_S, LIFE_S, OVER_S, WIN_S, SEED_FLY, NEXT_BUG, BACK_BUG, STAGE_START, WALK_BODY, WALK_S } from '../src/datos/programas.js';

const MOVER = () => [hatKey('right', cx(10)), hatKey('left', cx(-10)), hatKey('up', cy(10)), hatKey('down', cy(-10))];
const FLECHAS_IF = (r, l, u, d) => hatFlag(fe(iff(kp(r), cx(10)), iff(kp(l), cx(-10)), iff(kp(u), cy(10)), iff(kp(d), cy(-10))));
const CINCO_CLICS = Array.from({ length: 5 }, () => [['bandera'], ['esperar', 3]]).flat();
const LIVES_WAIT = () => hatFlag(setV('vidas', 3), fe(iff(toO('Avispa'), chV('vidas', -1), waitB(1))));

export const SOLUCIONES = {
  /* ---------- Parte 1 ---------- */
  1: { programa: () => [hatFlag(mv(10))], acciones: CINCO_CLICS },
  2: { programa: () => [hatFlag(repB(30, mv(10)))], acciones: [['bandera'], ['esperar', 60]] },
  3: { programa: () => [hatKey('right', mv(10))], acciones: [['ir', 'estrellas', { ejes: 1 }]] },
  'p1-atras': { programa: () => [hatKey('left', mv(-10))], acciones: [['ir', 'estrellas', { ejes: 1 }]] },
  4: { programa: () => [hatKey('right', mv(10)), hatKey('left', mv(-10))], acciones: [['ir', 'estrellas', { ejes: 1 }]] },
  5: { acciones: [['explorar']] },
  6: { programa: MOVER, acciones: [['ir', 'estrellas', { ejes: 1 }]] },
  'p1-siempre': { programa: () => [hatFlag(fe(cx(10)))], acciones: [['bandera'], ['esperar', 60]] },
  'p1-pregunta': { programa: () => [hatFlag(fe(iff(kp('right'), cx(10))))], acciones: [['bandera'], ['ir', 'estrellas']] },
  7: { programa: () => [hatFlag(fe(iff(kp('right'), cx(10))))], acciones: [['bandera'], ['ir', 'estrellas']] },
  'p1-dossi': { programa: () => [hatFlag(fe(iff(kp('right'), cx(10)), iff(kp('up'), cy(10))))], acciones: [['bandera'], ['ir', 'estrellas']] },
  8: { programa: () => [FLECHAS_IF('right', 'left', 'up', 'down')], acciones: [['bandera'], ['ir', 'estrellas']] },
  'p1-wasd': { programa: () => [FLECHAS_IF('d', 'a', 'w', 's')], acciones: [['bandera'], ['ir', 'estrellas', { teclas: 'wasd' }]] },
  'p1-o': {
    programa: () => [hatFlag(fe(iff(orB(kp('right'), kp('d')), cx(10)), iff(orB(kp('left'), kp('a')), cx(-10)), iff(orB(kp('up'), kp('w')), cy(10)), iff(orB(kp('down'), kp('s')), cy(-10))))],
    acciones: [['bandera'], ['tener', 'right', 3], ['ir', 'estrellas', { teclas: 'wasd' }]]
  },
  9: { acciones: [['quiz']] },

  /* ---------- Parte 2 ---------- */
  'p2-1': { programa: () => [MOVE_S(), GOAL_S(false)], acciones: [['bandera'], ['ir', 'meta']] },
  'p2-2': { programa: () => [MOVE_S(), GOAL_S(true)], acciones: [['bandera'], ['ir', 'meta']] },
  'p2-3': { programa: () => [MOVE_S(), GOAL_S(true), hatFlag(fe(iff(tc('lava'), gotoB(-195, -140))))], acciones: [['bandera'], ['tener', 'right', 8], ['ir', 'meta']] },
  'p2-4': { programa: () => [MOVE_S(), hatFlag(fe(iff(tc('wall'), cx(-10))))], acciones: [['bandera'], ['ir', 'estrellas']] },
  'p2-dentro': {
    programa: () => [hatFlag(fe(iff(kp('right'), cx(10), iff(tc('wall'), cx(-10))), iff(kp('left'), cx(-10), iff(tc('wall'), cx(10))), iff(kp('up'), cy(10)), iff(kp('down'), cy(-10))))],
    acciones: [['bandera'], ['tener', 'left', 12], ['ir', 'estrellas']]
  },
  'p2-5': { programa: () => [MOVEW_S()], acciones: [['bandera'], ['ir', 'estrellas']] },
  'p2-barro': {
    programa: () => [hatFlag(fe(iff(kp('right'), cx(10), iff(tc('mud'), cx(-5)), iff(tc('ice'), cx(10))), iff(kp('left'), cx(-10)), iff(kp('up'), cy(10)), iff(kp('down'), cy(-10)))), GOAL_S(true)],
    acciones: [['bandera'], ['tener', 'right', 60]]
  },
  'p2-6': {
    programa: () => [Object.assign(hatFlag(MOVE_FULL()), {fold:'x'}), hatFlag(fe(iff(tc('lava'), gotoB(-200, -150)))), GOAL_S(true)],
    acciones: [['bandera'], ['ir', 'meta']]
  },
  'p2-7': { acciones: [['quiz']] },

  /* ---------- Parte 3 ---------- */
  'p3-1': { sprites: { Avispa: () => [hatFlag(fe(cx(5)))] }, acciones: [['bandera'], ['esperar', 120]] },
  'p3-2': { sprites: { Avispa: () => [hatFlag(fe(mv(5), bounceB()))] }, acciones: [['bandera'], ['esperar', 200]] },
  'p3-3': {
    sprites: { Bichito: () => [MOVE_S(), hatFlag(fe(iff(toO('Avispa'), gotoB(-190, -140))))] },
    acciones: [['bandera'], ['ir', 'estrellas', { esquivar: true }]]
  },
  'p3-dir': {
    acciones: [0, 90, 180, -90].flatMap(d => [['hacer', S => { S.sprites[0].program[0].body[0].n = d; }], ['bandera'], ['esperar', 45]])
  },
  'p3-4': {
    sprites: { Avispa: () => [hatFlag(pdirB(90), fe(mv(5), bounceB()))], 'Avispa 2': () => [hatFlag(pdirB(0), fe(mv(5), bounceB()))] },
    acciones: [['bandera'], ['esperar', 400]]
  },
  'p3-5': {
    sprites: { Avispa: () => [hatFlag(fe(ptoB('Bichito'), mv(3)))] },
    acciones: [['bandera'], ['ir', 'estrellas', { esquivar: true }]]
  },
  'p3-6': {
    sprites: { Avispa: () => [hatFlag(waitB(2), fe(ptoB('Bichito'), mv(4)))] },
    acciones: [['bandera'], ['ir', 'estrellas', { esquivar: true }]]
  },
  'p3-7': {
    sprites: { Bichito: () => [MOVE_S(), GOAL_S(true), hatFlag(fe(iff(orB(toO('Avispa'), toO('Avispa 2')), sayB('¡Ay!'), stopB())))] },
    acciones: [['bandera'], ['ir', 'meta', { esquivar: true }]]
  },
  'p3-8': { acciones: [['quiz']] },

  /* ---------- Parte 4 ---------- */
  'p4-obj': { sprites: { Moneda: () => [hatFlag(fe(iff(toO('Bichito'), rndB())))] }, acciones: [['bandera'], ['ir', 'Moneda']] },
  'p4-pts': { sprites: { Moneda: () => [COIN_S(true)] }, acciones: [['bandera'], ['ir', 'Moneda']] },
  'p4-crear': {
    sprites: { Moneda: () => [hatFlag(fe(iff(toO('Bichito'), chV('monedas', 1), rndB())))] },
    acciones: [['hacer', (S, creadas) => { creadas[S.L.id] = ['monedas']; S.VARS.monedas = 0; }], ['bandera'], ['ir', 'Moneda']]
  },
  'p4-cero': { sprites: { Moneda: () => [COIN_S(true, true)] }, acciones: [['bandera'], ['ir', 'Moneda']] },
  'p4-vidas': {
    sprites: { Bichito: () => [MOVE_S(), hatFlag(setV('vidas', 3), fe(iff(toO('Avispa'), chV('vidas', -1), gotoB(-190, -140))))] },
    acciones: [['bandera'], ['ir', 'Moneda', { esquivar: true }]]
  },
  'p4-corazon': { sprites: { 'Corazón': () => [HEART_S()] }, acciones: [['bandera'], ['ir', 'Corazón', { esquivar: true }]] },
  'p4-golpe': { sprites: { Bichito: () => [MOVE_S(), LIVES_WAIT()] }, acciones: [['bandera'], ['ir', 'Moneda', { esquivar: true }]] },
  'p4-igual': {
    sprites: { Bichito: () => [MOVE_S(), hatFlag(fe(iff(eqB('puntos', 5), sayB('¡Tengo 5!'))))] },
    acciones: [['bandera'], ['ir', 'Moneda']]
  },
  'p4-over': { sprites: { Bichito: () => [MOVE_S(), LIFE_S({wait:true}), OVER_S(true)] }, acciones: [['bandera'], ['ir', 'Avispa']] },
  'p4-ganar': {
    sprites: { Bichito: () => [MOVE_S(), LIFE_S({wait:true}), OVER_S(), WIN_S()] },
    acciones: [['bandera'], ['ir', 'Moneda', { esquivar: true }]]
  },
  'p4-reloj': {
    sprites: { Bichito: () => [MOVE_S(), hatFlag(fe(iff(eqB('puntos', 5), sayB('¡Listo!'), stopB()))), hatFlag(setV('tiempo', 0), fe(waitB(1), chV('tiempo', 1)))] },
    acciones: [['bandera'], ['ir', 'Moneda']]
  },
  'p4-regresiva': {
    sprites: { Bichito: () => [MOVE_S(), hatFlag(setV('tiempo', 10), fe(waitB(1), chV('tiempo', -1))), hatFlag(fe(iff(eqB('puntos', 8), sayB('¡Ganaste!'), stopB()))), hatFlag(fe(iff(eqB('tiempo', 0), sayB('Se acabó el tiempo'), stopB())))] },
    acciones: [['bandera'], ['ir', 'Moneda']]
  },
  'p4-todo': {
    sprites: { Bichito: () => [MOVE_S(), LIFE_S({wait:true}), hatFlag(fe(iff(eqB('vidas', 0), sayB('Perdiste'), stopB()), iff(eqB('puntos', 10), sayB('¡Ganaste!'), stopB())))] },
    acciones: [['bandera'], ['ir', 'Moneda', { esquivar: true }]]
  },
  'p4-cierre': { acciones: [['quiz']] },

  /* ---------- Parte 5 ---------- */
  'p5-aplasta': { sprites: { Avispa: () => [PATROL(3), hatFlag(fe(iff(toO('Bichito'), hideB())))] }, acciones: [['bandera'], ['ir', 'Avispa']] },
  'p5-mostrar': { sprites: { Avispa: () => [PATROL(3), hatFlag(showB(), fe(iff(toO('Bichito'), hideB())))] }, acciones: [['bandera'], ['ir', 'Avispa']] },
  'p5-espacio': {
    sprites: { Avispa: () => [PATROL(3), hatFlag(showB(), fe(iff(andB(toO('Bichito'), kp('space')), hideB())))] },
    acciones: [['bandera'], ['ir', 'Avispa', { espacio: true }]]
  },
  'p5-mensaje': {
    sprites: {
      Bichito: () => [MOVE_S(), hatFlag(setV('puntos', 0)), hatMsg('atrapada', chV('puntos', 1))],
      Avispa: () => [PATROL(3), hatFlag(showB(), fe(iff(andB(toO('Bichito'), kp('space')), hideB(), sendB('atrapada'), waitB(1), rndB(), showB())))]
    },
    acciones: [['bandera'], ['ir', 'Avispa', { espacio: true }]]
  },
  'p5-dedonde': {
    sprites: { Semilla: () => [SEED_FLY(), hatKey('space', gotoO('Bichito'), showB())] },
    acciones: [['bandera'], ['esperar', 5], ['tocar', 'space', 4, 30]]
  },
  'p5-pego': {
    sprites: { Avispa: () => [PATROL(2), hatFlag(showB(), fe(iff(toO('Semilla'), hideB(), sendB('atrapada'))))] },
    acciones: [['bandera'], ['ir', { debajo: 'Avispa' }]]
  },
  'p5-queclon': {
    sprites: { Moneda: () => [hatFlag(hideB()), hatKey('space', cloneB('mí mismo')), hatClone(rndB(), showB(), waitB(3), delB())] },
    acciones: [['bandera'], ['tocar', 'space', 7, 6]]
  },
  'p5-clones': {
    sprites: {
      Bichito: () => [MOVE_S(), hatKey('space', cloneB('Semilla'))],
      Semilla: () => [hatFlag(hideB(), pdirB(0)), hatClone(gotoO('Bichito'), showB(), fe(mv(15), iff(toO('borde'), delB())))]
    },
    acciones: [['bandera'], ['tocar', 'space', 6, 4]]
  },
  'p5-mayor': {
    sprites: { Bichito: () => [MOVE_S(), hatFlag(setV('semillas', 0)), hatFlag(fe(iff(ltB('semillas', 1), sayB('¡No tengo!')), iff(gtB('semillas', 3), sayB('¡Muchas!'))))] },
    acciones: [['bandera'], ['esperar', 3], ['ir', 'Bolsa']]
  },
  'p5-balas': {
    sprites: { Bichito: () => [MOVE_S(), hatFlag(setV('semillas', 0)), hatKey('space', iff(gtB('semillas', 0), cloneB('Semilla'), chV('semillas', -1)))] },
    acciones: [['bandera'], ['ir', 'Bolsa', { parar: S => S.VARS.semillas > 0 }], ['tocar', 'space', 3, 10]]
  },
  'p5-espada': {
    sprites: { Espada: () => [hatKey('space', gotoO('Bichito'), showB(), waitB(0.3), hideB())] },
    acciones: [['bandera'], ['ir', 'Avispa', { golpe: true }]]
  },
  'p5-cerca': {
    sprites: {
      Avispa: () => [Object.assign(hatFlag(showB(), waitB(1), fe(ptoB('Bichito'), mv(2))), {fold:'x'}), hatMsg('atrapada', waitB(1), rndB(), showB()), hatFlag(fe(iff(toO('Espada'), hideB(), sendB('atrapada'))))]
    },
    acciones: [['bandera'], ['ir', 'Avispa', { golpe: true }]]
  },
  'p5-lluvia': {
    sprites: {
      Nave: () => [hatFlag(hideB(), fe(waitB(1.2), rndB(), cy(400), cloneB('mí mismo'))), hatClone(showB(), pdirB(180), fe(mv(3), iff(toO('Bichito'), sendB('daño'), delB()), iff(tc('lava'), sendB('daño'), delB()), iff(toO('Semilla'), sendB('atrapada'), delB())))]
    },
    acciones: [['bandera'], ['ir', { debajo: 'Nave' }]]
  },
  'p5-cierre': { acciones: [['bandera'], ['esperar', 2400]] }, // infinito: termina cuando te quedás sin vidas

  /* ---------- Parte 6 ---------- */
  'p6-escenario': { sprites: { Escenario: () => [hatFlag(bdB('arena'))] }, acciones: [['bandera'], ['esperar', 5]] },
  'p6-inicio': { sprites: { Escenario: () => [hatFlag(bdB('pasto'))] }, acciones: [['bandera'], ['ir', 'meta']] },
  'p6-pasar': {
    sprites: { Bichito: () => [MOVEW_S(), hatFlag(fe(iff(tc('goal'), bdB('arena'), gotoB(-200, -150))))] },
    acciones: [['bandera'], ['ir', 'meta']]
  },
  'p6-aviso': {
    sprites: { Escenario: () => [STAGE_START(), hatMsg('siguiente nivel', bdB('siguiente fondo'))] },
    acciones: [['bandera'], ['ir', 'meta']]
  },
  'p6-nivel': {
    sprites: {
      Bichito: () => [MOVEW_S(), NEXT_BUG(), BACK_BUG(), hatFlag(fe(iff(eqB('nivel', 4), sayB('¡Ganaste!'), stopB())))],
      Escenario: () => [STAGE_START([setV('nivel', 1)]), hatMsg('siguiente nivel', bdB('siguiente fondo'), chV('nivel', 1))]
    },
    acciones: [['bandera'], ['ir', 'meta']]
  },
  'p6-cadauno': {
    sprites: { Avispa: () => [PATROL(4), hatFlag(hideB()), hatBd('arena', showB()), hatBd('noche', hideB())] },
    acciones: [['bandera'], ['ir', 'meta', { esquivar: true }]]
  },
  'p6-dificil': {
    sprites: { Avispa: () => [hatFlag(showB(), fe(mv(V('velocidad')), bounceB()))] },
    acciones: [['bandera'], ['ir', 'meta', { esquivar: true }]]
  },
  'p6-juego': {
    sprites: {
      Bichito: () => [MOVEW_S(), NEXT_BUG(), BACK_BUG(), hatFlag(setV('vidas', 3), fe(iff(toO('Avispa'), chV('vidas', -1), gotoB(-200, -150), waitB(1)))), hatFlag(fe(iff(eqB('vidas', 0), sayB('Perdiste'), stopB()), iff(eqB('nivel', 4), sayB('¡Ganaste!'), stopB()))), hatFlag(fe(iff(tc('lava'), chV('vidas', -1), gotoB(-200, -150))))]
    },
    acciones: [['bandera'], ['ir', 'meta', { esquivar: true }]]
  },
  'p6-cierre': { acciones: [['bandera'], ['ir', 'meta', { esquivar: true }]] },

  /* ---------- Parte 7 ---------- */
  'p7-disfraces': {
    sprites: { Bichito: () => [hatKey('space', nextCos()), hatKey('up', setCos('feliz'))] },
    acciones: [['bandera'], ['tocar', 'space', 4, 3], ['tocar', 'up', 1, 3]]
  },
  'p7-raras': { acciones: [['bandera'], ['tener', 'right', 60]] },
  'p7-caminar': {
    sprites: { Bichito: () => [MOVE_S(), hatFlag(fe(iff(kp('right'), ...WALK_BODY())))] },
    acciones: [['bandera'], ['tener', 'right', 60]]
  },
  'p7-dolor': {
    sprites: { Bichito: () => [MOVE_S(), WALK_S(), hatFlag(setV('vidas', 3), fe(iff(toO('Avispa'), setCos('dolor'), chV('vidas', -1), waitB(1), setCos('paso 1'))))] },
    acciones: [['bandera'], ['ir', 'Avispa', { parar: S => S.R.hurtShown }], ['esperar', 60]]
  },
  'p7-parpadeo': {
    sprites: { Bichito: () => [MOVE_S(), WALK_S(), hatFlag(setV('vidas', 3), fe(iff(toO('Avispa'), setCos('dolor'), chV('vidas', -1), repB(5, hideB(), waitB(0.1), showB(), waitB(0.1)), setCos('paso 1'))))] },
    acciones: [['bandera'], ['ir', 'Avispa', { parar: S => S.R.bugBlinks >= 1 }], ['esperar', 60]]
  },
  'p7-festejo': {
    sprites: { Bichito: () => [MOVE_S(), WALK_S(), hatFlag(fe(iff(tc('goal'), setCos('feliz'), sayB('¡Llegué!'), stopB())))] },
    acciones: [['bandera'], ['ir', 'meta']]
  },
  'p7-todo': {
    sprites: {
      Bichito: () => [MOVE_S(), hatFlag(fe(iff(orB(kp('right'), kp('left')), ...WALK_BODY()))), hatFlag(setV('vidas', 3), fe(iff(toO('Avispa'), setCos('dolor'), chV('vidas', -1), repB(5, hideB(), waitB(0.1), showB(), waitB(0.1)), setCos('paso 1')))), hatFlag(fe(iff(tc('goal'), setCos('feliz'), sayB('¡Llegué!'), stopB()), iff(eqB('vidas', 0), sayB('Perdiste'), stopB())))]
    },
    acciones: [['bandera'], ['ir', 'meta', { esquivar: true }]]
  }
};

/* Otras formas válidas de resolver algunos niveles: el chequeo no puede rechazar un programa que funciona. */
const MOVE_SOLO = () => hatFlag(fe(iff(kp('right'), cx(10)), iff(kp('left'), cx(-10)), iff(kp('up'), cy(10)), iff(kp('down'), cy(-10))));
export const ALTERNATIVAS = {
  2: { programa: () => [hatFlag(repB(10, mv(30)))], acciones: [['bandera'], ['esperar', 60]] },
  'p2-barro': { programa: () => [hatFlag(fe(iff(kp('right'), cx(10), iff(tc('mud'), cx(-5))), iff(kp('left'), cx(-10)), iff(kp('up'), cy(10)), iff(kp('down'), cy(-10)))), hatFlag(fe(iff(tc('ice'), cx(10)))), GOAL_S(true)], acciones: [['bandera'], ['tener', 'right', 60]] },
  'p2-4': { programa: () => [MOVE_S(), hatFlag(fe(iff(tc('wall'), cx(-10)))), hatFlag(fe(iff(tc('wall'), cy(0))))], acciones: [['bandera'], ['ir', 'estrellas']] },
  'p2-3': { programa: () => [MOVE_S(), GOAL_S(true), hatFlag(fe(iff(tc('lava'), gotoB(-180, -140))))], acciones: [['bandera'], ['tener', 'right', 8], ['ir', 'meta']] },
  'p3-3': { sprites: { Bichito: () => [MOVE_S(), hatFlag(fe(iff(toO('Avispa'), sayB('¡Ay!'), stopB())))] }, acciones: [['bandera'], ['ir', 'estrellas', { esquivar: true }]] },
  'p3-5': { sprites: { Avispa: () => [hatFlag(fe(ptoB('Bichito'), mv(2), mv(1)))] }, acciones: [['bandera'], ['ir', 'estrellas', { esquivar: true }]] },
  'p3-7': { sprites: { Bichito: () => [MOVE_S(), GOAL_S(true), hatFlag(fe(iff(toO('Avispa'), stopB()))), hatFlag(fe(iff(toO('Avispa 2'), stopB())))] }, acciones: [['bandera'], ['ir', 'meta', { esquivar: true }]] },
  'p4-reloj': { sprites: { Bichito: () => [MOVE_S(), hatFlag(fe(iff(eqB('puntos', 5), sayB('¡Listo!'), stopB()))), hatFlag(setV('tiempo', 0), fe(chV('tiempo', 1), waitB(1)))] }, acciones: [['bandera'], ['ir', 'Moneda']] },
  'p5-balas': { sprites: { Bichito: () => [MOVE_S(), hatFlag(setV('semillas', 0)), hatKey('space', iff(gtB('semillas', 0), chV('semillas', -1), cloneB('Semilla')))] }, acciones: [['bandera'], ['ir', 'Bolsa', { parar: S => S.VARS.semillas > 0 }], ['tocar', 'space', 3, 10]] },
  'p5-mensaje': { sprites: { Bichito: () => [MOVE_S(), hatFlag(setV('puntos', 0)), hatMsg('atrapada', chV('puntos', 1))], Avispa: () => [PATROL(3), hatFlag(showB(), fe(iff(andB(kp('space'), toO('Bichito')), sendB('atrapada'), hideB(), waitB(1), rndB(), showB())))] }, acciones: [['bandera'], ['ir', 'Avispa', { espacio: true }]] },
  'p5-espada': { sprites: { Espada: () => [hatKey('space', gotoO('Bichito'), showB(), waitB(0.2), hideB())] }, acciones: [['bandera'], ['ir', 'Avispa', { golpe: true }]] },
  'p6-pasar': { sprites: { Bichito: () => [MOVEW_S(), hatFlag(fe(iff(tc('goal'), gotoB(-200, -150), bdB('arena'))))] }, acciones: [['bandera'], ['ir', 'meta']] },
  'p7-dolor': { sprites: { Bichito: () => [MOVE_S(), WALK_S(), hatFlag(setV('vidas', 3), fe(iff(toO('Avispa'), setCos('dolor'), chV('vidas', -1), waitB(1), setCos('paso 2'))))] }, acciones: [['bandera'], ['ir', 'Avispa', { parar: S => S.R.hurtShown }], ['esperar', 60]] },
  'p7-festejo': { sprites: { Bichito: () => [MOVE_S(), WALK_S(), hatFlag(fe(iff(tc('goal'), sayB('¡Llegué!'), setCos('feliz'), stopB())))] }, acciones: [['bandera'], ['ir', 'meta']] }
};

/* Programas que NO tienen que ganar: el nivel pide una idea y esto la saltea. */
export const NO_GANAN = {
  'p2-3': { programa: () => [MOVE_S(), GOAL_S(true), hatFlag(fe(iff(tc('lava'), gotoB(-195, -140))))], acciones: [['bandera'], ['ir', 'meta']], dice: 'probá la lava' },
  'p2-dentro': { acciones: [['bandera'], ['tener', 'left', 12], ['ir', 'estrellas']], dice: 'se metió en la pared' },
  'p2-barro': { acciones: [['bandera'], ['tener', 'right', 80]], dice: 'Caminando normal no llegás' },
  2: { programa: () => [hatFlag(mv(300))], acciones: [['bandera'], ['esperar', 60]], dice: 'se salteó estrellas' }
};
