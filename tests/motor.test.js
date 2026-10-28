/* El motor nuevo (src/motor/motor.js) hace exactamente lo mismo que el del original. */
import { it, expect } from 'vitest';
import { createEngine } from '../src/motor/motor.js';
import { createEngineOriginal } from '../herramientas/motor-original.js';
import { hatFlag, hatKey, fe, iff, kp, cx, cy, mv, bounceB, pdirB, waitB, repB, hideB, showB, hatClone, cloneB, delB, toO, gotoB } from '../src/motor/bloques.js';

function correr(crear, programas, teclas){
  const sprites = programas.map((p, i) => ({ name: 'S' + i, x: -100 + i * 50, y: 0, dir: 90, program: p() }));
  const E = crear({ touchingObj: (s, t) => t === 'borde' && Math.abs(s.x) >= 224, findSprite: n => sprites.find(s => s.name === n) });
  E.sprites = sprites; E.flag();
  const huella = [];
  for (let t = 0; t < 200; t++){
    for (const [k, desde, hasta] of teclas){ if (t === desde) E.keyDown(k); if (t === hasta) E.keyUp(k); }
    E.step();
    huella.push(E.sprites.map(s => [s.x, s.y, s.dir, !!s.hidden].join(',')).join('|'));
  }
  return huella;
}

const CASOS = {
  'flechas con por siempre + si': [[() => [hatFlag(fe(iff(kp('right'), cx(10)), iff(kp('up'), cy(10))))]], [['right', 5, 60], ['up', 30, 90]]],
  'eventos de tecla con repetición': [[() => [hatKey('right', cx(10)), hatKey('left', cx(-10))]], [['right', 0, 40], ['left', 50, 120]]],
  'mover, rebotar y esperar': [[() => [hatFlag(pdirB(45), waitB(0.5), fe(mv(7), bounceB()))]], []],
  'repetir, esconder y mostrar': [[() => [hatFlag(repB(5, hideB(), waitB(0.1), showB(), waitB(0.1)), gotoB(30, 40))]], []],
  'clones': [[() => [hatFlag(repB(3, cloneB('mí mismo'), waitB(0.2))), hatClone(fe(cx(5), iff(toO('borde'), delB())))]], []]
};

for (const [nombre, [programas, teclas]] of Object.entries(CASOS))
  it(nombre, () => expect(correr(createEngine, programas, teclas)).toEqual(correr(createEngineOriginal, programas, teclas)));
